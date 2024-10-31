# Chatbot for the Department Of Justice Website 🤖

![image](https://github.com/user-attachments/assets/6d3bb7aa-695e-4476-ae2c-474b7736eab3)

## Overview

This project implements a chat support application using React for the frontend and a Flask backend that processes queries using a Retrieval-Augmented Generation (RAG) pipeline. Users can select a language, send messages, and receive responses from a chatbot powered by machine learning. The application supports multiple document types and stores relevant data using Chroma as the database.

## Features

- **Interactive Chatbot**: Users can interact with a chatbot that responds to queries.
- **Language Selection**: Supports multiple languages, allowing users to receive answers in their preferred language.
- **Dynamic Suggestions**: Provides predefined suggestions to enhance user experience.
- **RAG Pipeline**: Utilizes a RAG pipeline to fetch and process relevant documents and generate responses.
- **Link Extraction**: Extracts URLs from the context for users to reference.
- **Rate Limiting**: Implements rate limiting on API requests to ensure fair use.

## Technologies Used

- **Frontend**: React
- **Backend**: Flask
- **Database**: Chroma
- **Natural Language Processing**: NLTK, LangChain, Google Generative AI
- **Document Loaders**: Supports PDF, CSV, and text files
- **Deployment**: Docker (if applicable)

## Installation

### Prerequisites

- Node.js and npm (for the React frontend)
- Python 3.7 or higher (for the Flask backend)
- Virtual environment (recommended for Python)
- `pip` (Python package manager)

### Clone the Repository

```bash
git clone https://github.com/yourusername/chat-support-app.git
cd chat-support-app
```

### Setup Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required npm packages:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Setup Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory and add your Google API key:

   ```bash
   GOOGLE_API_KEY=your_api_key_here
   ```

5. Run the Flask application:

   ```bash
   python app.py
   ```

## Usage

1. Open your browser and go to `http://localhost:5173` (or the port specified by your frontend setup).
2. Select a language from the dropdown.
3. Type your query in the input box and press the send button.
4. View the chatbot's response along with any relevant links provided.

### API Endpoints

- **GET /**: Returns the main page (frontend).
- **POST /predict**: Accepts a JSON request with a `message` field to generate a response based on the provided query.

### Example Request

```json
{
  "message": "Tell me about Mann Ki Baat | >English"
}
```

### Rate Limits

- Users can make a maximum of **10 requests per minute** to the `/predict` endpoint.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [LangChain](https://www.langchain.com) for providing the tools for document processing and embeddings.
- [NLTK](https://www.nltk.org/) for natural language processing utilities.
- [React](https://reactjs.org/) and [Flask](https://flask.palletsprojects.com/) for building the frontend and backend.

```

Feel free to modify the sections as needed to fit your project's specifics, especially the repository link, dependencies, and any other relevant information!
