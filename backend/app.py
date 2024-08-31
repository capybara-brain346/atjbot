from flask import Flask, render_template, jsonify, request
import os
import logging
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')

# Set up logging
logging.basicConfig(level=logging.INFO)

def query_rag(query_text: str, prompt_template: str) -> str:
    try:
        db = Chroma(
            persist_directory="bot/chroma",
            embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        )

        results = db.similarity_search_with_score(query_text, k=5)
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

        prompt_template = ChatPromptTemplate.from_template(prompt_template)
        prompt = prompt_template.format(context=context_text, question=query_text)

        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", api_key=os.getenv("GOOGLE_API_KEY")
        )
        response = model.invoke(prompt)

        # Ensure response is a string
        if hasattr(response, 'text'):
            return response.text
        return str(response)

    except Exception as e:
        logging.error(f"Error in query_rag: {e}")
        return "An error occurred while processing the query."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'message' not in data:
            logging.error("Invalid input: No message field in request data.")
            return jsonify({'answer': 'No message provided'})

        message = data['message']
        PROMPT_TEMPLATE = """
        Answer the question based only on the following context:

        {context}

        ---

        Answer the question based on the above context in 50 to 80 words. If the question is not related to legal content respond with I cannot help with this query. : {question}
        """
        response = query_rag(query_text=message, prompt_template=PROMPT_TEMPLATE)
        return jsonify({'answer': response})

    except Exception as e:
        logging.error(f"Error in /predict: {e}")
        return jsonify({'answer': 'An error occurred while processing your request.'})

if __name__ == '__main__':
    app.run(debug=True)
