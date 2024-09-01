from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# from langchain_community.llms.ollama import Ollama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# from langchain_community.embeddings import OllamaEmbeddings
from dotenv import load_dotenv

load_dotenv()


def query_rag(query_text: str, prompt_template: str) -> str:
    db = Chroma(
        persist_directory="../chroma",
        embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
    )

    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(prompt_template)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
    )
    response_text = model.invoke(prompt)

    chain = {"context": context_text, "question": query_text}
    formatted_response = f"Response: {response_text}"
    print(formatted_response)
    return response_text


def main() -> None:
    PROMPT_TEMPLATE = """
    Below is context:

    {context}

    ---

    Answer the question based on the above context in 50 to 80 words. 
    If the question is a greeting or goodbye or a thank you, be friendly and you can respond with a friendly greeting while ignoring the context.
    If the question is not related to legal content respond with I cannot help with this query. : {question}
    """
    query_text = "Thank you!"
    print(f"Your question: {query_text}")

    print(query_rag(query_text=query_text, prompt_template=PROMPT_TEMPLATE))


if __name__ == "__main__":
    main()
