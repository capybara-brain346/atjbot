import os
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import config

load_dotenv()

def query_rag(query_text: str, prompt_template: str) -> str:
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
    response_text = model.invoke(prompt)

    formatted_response = f"Response: {response_text}"
    print(formatted_response)
    return response_text
