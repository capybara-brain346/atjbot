from flask import Flask, render_template, jsonify, request
import os
import logging
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
from nltk import pos_tag
from flask_cors import CORS

load_dotenv()

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)

logging.basicConfig(level=logging.INFO)

CORS(app, resources={r"/*": {"origins": "*"}})


def extract_keywords(prompt):
    nltk.download("punkt", quiet=True)
    nltk.download("punkt_tab", quiet=True)
    nltk.download("stopwords", quiet=True)
    nltk.download("averaged_perceptron_tagger", quiet=True)
    nltk.download("averaged_perceptron_tagger_eng", quiet=True)

    tokens = word_tokenize(prompt.lower())

    stop_words = set(stopwords.words("english"))
    filtered_tokens = [
        word for word in tokens if word.isalnum() and word not in stop_words
    ]

    tagged_tokens = pos_tag(filtered_tokens)

    keywords = [
        word for word, tag in tagged_tokens if tag in ("NN", "NNS", "JJ", "JJR", "JJS")
    ]
    fdist = FreqDist(keywords)

    return fdist.most_common()


def query_rag(query_text: str, prompt_template: str) -> str:
    try:
        db = Chroma(
            persist_directory="chroma",
            embedding_function=GoogleGenerativeAIEmbeddings(
                model="models/embedding-001"
            ),
        )

        results = db.similarity_search_with_score(query_text, k=5)
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

        prompt_template = ChatPromptTemplate.from_template(prompt_template)
        prompt = prompt_template.format(context=context_text, question=query_text)

        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", api_key=os.getenv("GOOGLE_API_KEY")
        )
        response = model.invoke(prompt)

        if hasattr(response, "content"):
            return response.content.strip()
        return str(response).strip()

    except Exception as e:
        logging.error(f"Error in query_rag: {e}")
        return "An error occurred while processing the query."


def get_links(prompt):
    keywords = extract_keywords(prompt)
    keyword_joint = " ".join([keyword for keyword, idx in keywords]).title()

    json_file_path = r"bot\data\links\links.json"

    with open(json_file_path, "r") as j:
        contents = json.loads(j.read())

    dict_content = dict(contents)
    dict_keys = dict_content.keys()

    links = []
    for i in dict_keys:
        if keyword_joint in i:
            links.append(dict_content[i])

    return links


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "message" not in data:
            logging.error("Invalid input: No message field in request data.")
            return jsonify({"answer": "No message provided"})

        message = data["message"]
        PROMPT_TEMPLATE = """
        Answer the question based only on the following context:

        {context}

        ---

        Answer the question based on the above context in 50 to 80 words. If the question is not related to legal content respond with I cannot help with this query. You can be a little interactive by replying to simple prompts like greetings and goodbyes: {question}
        """
        response = query_rag(query_text=message, prompt_template=PROMPT_TEMPLATE)
        return jsonify({"answer": response, "links": get_links(message)})

    except Exception as e:
        logging.error(f"Error in /predict: {e}")
        return jsonify({"answer": "An error occurred while processing your request."})


if __name__ == "__main__":
    app.run(debug=True)
