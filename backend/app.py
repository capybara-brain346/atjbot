from flask import Flask, render_template, jsonify, request
import logging
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from utils import get_links, query_rag

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

logging.basicConfig(level=logging.INFO)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/predict")
@limiter.limit("10 per minute")
def predict():
    try:
        data = request.json
        if not data or "message" not in data:
            logging.error("Invalid input: No message field in request data.")
            return jsonify({"answer": "No message provided"})

        message = data["message"]

        response = query_rag(query_text=message)
        return jsonify({"answer": response, "links": get_links(message)[0:1]})

    except Exception as e:
        logging.error(f"Error in /predict: {e}")
        return jsonify({"answer": "An error occurred while processing your request."})


if __name__ == "__main__":
    app.run(debug=True)
