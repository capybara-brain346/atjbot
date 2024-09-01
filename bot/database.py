import os
import shutil
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

# from langchain_community.embeddings import OllamaEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.schema.document import Document

from dotenv import load_dotenv

load_dotenv()


def load_documents(data_path: str) -> List[Document]:
    text_loader_kwargs = {"autodetect_encoding": True}
    loader = DirectoryLoader(
        data_path,
        glob="./*.txt",
        loader_cls=TextLoader,
        loader_kwargs=text_loader_kwargs,
    )
    documents = loader.load()
    return documents


def chunk_documents(documents: List[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return splitter.split_documents(documents)


def calculate_chunk_ids(chunks):
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id

    return chunks


def populate_chroma(chunks: List[Document], database_path: str):
    db = Chroma(
        persist_directory=database_path,
        embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
    )

    chunks_with_ids = calculate_chunk_ids(chunks)

    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
    else:
        print("No new documents to add")


def clear_database(database_path: str):
    if os.path.exists(database_path):
        shutil.rmtree(database_path)


def main():
    DATA_DIRECTORY = "./data"
    CHROMA_PATH = "../chroma"

    documents = load_documents(data_path=DATA_DIRECTORY)
    chunks = chunk_documents(documents)
    populate_chroma(chunks, database_path=CHROMA_PATH)


if __name__ == "__main__":
    main()
