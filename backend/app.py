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
