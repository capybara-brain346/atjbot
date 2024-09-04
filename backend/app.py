from flask import Flask, render_template, jsonify, request
import logging
from flask_cors import CORS
from utils import get_links, query_rag

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)

logging.basicConfig(level=logging.INFO)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/predict")
def predict():
    try:
        data = request.json
        if not data or "message" not in data:
            logging.error("Invalid input: No message field in request data.")
            return jsonify({"answer": "No message provided"})

        message = data["message"]
        PROMPT_TEMPLATE = """
        Here is the context provided:

        {context}

        ---

        Answer the following question based on the above context. If the question is a greeting, farewell, or expression of thanks, respond warmly and personally without referencing the context. For queries unrelated to legal content, reply with: "I’m sorry, but I can’t assist with that." Please ensure your response is descriptive and informative based on the context.

        Question: {question}
        """
        response = query_rag(query_text=message, prompt_template=PROMPT_TEMPLATE)
        return jsonify({"answer": response, "links": ["https://doj.gov.in/"]})

    except Exception as e:
        logging.error(f"Error in /predict: {e}")
        return jsonify({"answer": "An error occurred while processing your request."})


if __name__ == "__main__":
    app.run(debug=True)
