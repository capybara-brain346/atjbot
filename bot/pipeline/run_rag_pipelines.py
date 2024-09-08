import os
import utils.utils as utils
import shutil
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import (
    DirectoryLoader,
    TextLoader,
    CSVLoader,
)
from langchain.schema.document import Document
import argparse
from dotenv import load_dotenv
# from langchain_community.embeddings import OllamaEmbeddings

load_dotenv()


class RAGPipeline:
    def __init__(self, data_path: str, database_path: str, document_type: str) -> None:
        self.data_path = data_path
        self.database_path = database_path
        self.document_type = document_type

    def load_documents(self) -> List[Document]:
        text_loader_kwargs = {"autodetect_encoding": True}
        loader = {
            "text": DirectoryLoader(
                self.data_path,
                glob="**/*.txt",
                loader_cls=TextLoader,
                loader_kwargs=text_loader_kwargs,
            ),
            "pdf": PyPDFDirectoryLoader(
                self.data_path,
                glob="./*.pdf",
            ),
            "scanned": utils.load_and_process_scanned_pdfs(self.data_path),
            "csv": DirectoryLoader(
                self.data_path,
                glob="./*.csv",
                loader_cls=CSVLoader,
                loader_kwargs=text_loader_kwargs,
            ),
        }

        if self.document_type == "scanned":
            documents = loader[
                self.document_type
            ]  # utils.load_and_process_scanned_pdfs(self.data_path)
            return documents

        documents = loader[self.document_type].load()

        return documents

    def chunk_documents(self, documents: List[Document]) -> List[Document]:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=80,
            length_function=len,
            is_separator_regex=False,
        )
        return splitter.split_documents(documents)

    def calculate_chunk_ids(self, chunks):
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

    def populate_chroma(self, chunks: List[Document]):
        db = Chroma(
            persist_directory=self.database_path,
            embedding_function=GoogleGenerativeAIEmbeddings(
                model="models/embedding-001"
            ),
        )

        chunks_with_ids = self.calculate_chunk_ids(chunks)

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

    def clear_database(self):
        if os.path.exists(self.database_path):
            shutil.rmtree(self.database_path)

    def run_pipeline(self):
        documents = self.load_documents()
        chunks = self.chunk_documents(documents)
        self.populate_chroma(chunks)


def main() -> None:
    arg_parse = argparse.ArgumentParser(
        prog="Run data pipeline.",
        description="Script to run the entire data pipeline. Use cli args to control what pipeline to run.",
    )

    arg_parse.add_argument("document_type", type=str)
    arg_parse.add_argument("directory", type=str)
    args = arg_parse.parse_args()

    rag_pipeline = RAGPipeline(
        data_path=args.directory,
        database_path="chroma_links",  # chroma_links
        document_type=args.document_type,
    )

    rag_pipeline.run_pipeline()


if __name__ == "__main__":
    main()
