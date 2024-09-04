import os
import logging
from typing import List, Tuple
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

load_dotenv()


def extract_keywords(prompt: str) -> List[Tuple]:
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


def get_links(prompt) -> List[str]:
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