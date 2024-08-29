import config
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from langchain_community.embeddings import OllamaEmbeddings


def query_rag(query_text: str, prompt_template: str) -> str:
    db = Chroma(
        persist_directory=config.CHROMA_PATH,
        embedding_function=OllamaEmbeddings(model="llama3.1"),
    )

    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(prompt_template)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = Ollama(model="llama3.1")
    response_text = model.invoke(prompt)

    formatted_response = f"Response: {response_text}"
    print(formatted_response)
    return response_text


def main() -> None:
    PROMPT_TEMPLATE = """
    Answer the question based only on the following context:

    {context}

    ---

    Answer the question based on the above context in 50 to 80 words: {question}
    """
    query_text = "What is Tele-Law?"

    print(query_rag(query_text=query_text, prompt_template=PROMPT_TEMPLATE))


if __name__ == "__main__":
    main()
