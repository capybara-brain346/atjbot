import os
import shutil
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

# from langchain_community.embeddings import OllamaEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain.schema.document import Document

from PIL import Image
import fitz  # PyMuPDF
import pytesseract
from dotenv import load_dotenv

load_dotenv()

def ocr_image(image_path: str) -> str:
    """Perform OCR on an image and return the extracted text."""
    return pytesseract.image_to_string(Image.open(image_path))

def extract_text_from_scanned_pdf(pdf_path: str) -> List[Document]:
    """Extract text from scanned PDF files using OCR."""
    documents = []
    doc = fitz.open(pdf_path)  # Open the PDF with PyMuPDF
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)  # Load each page
        images = page.get_images(full=True)  # Extract images from the page

        page_text = ""
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]

            # Save image temporarily for OCR processing
            image_path = f"temp_image_{page_num}_{img_index}.png"
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)
            
            # Perform OCR on the image
            text = ocr_image(image_path)
            page_text += text
            
            # Clean up temporary image file
            os.remove(image_path)

        # Append extracted text as a Document
        documents.append(Document(page_content=page_text, metadata={"source": pdf_path, "page": page_num}))

    return documents

def load_documents(data_path: str, file_type: str) -> List[Document]:
    """Load text or PDF documents from a directory."""
    if file_type == "text":
        text_loader_kwargs = {"autodetect_encoding": True}
        loader = DirectoryLoader(
            data_path,
            glob="./*.txt",
            loader_cls=TextLoader,
            loader_kwargs=text_loader_kwargs,
        )
    elif file_type == "pdf":
        loader = DirectoryLoader(
            data_path,
            glob="./*.pdf",
            loader_cls=PyPDFLoader,
        )
    else:
        raise ValueError("Unsupported file type")
        
    documents = loader.load()
    return documents

def load_and_process_scanned_pdfs(pdf_directory: str) -> List[Document]:
    """Load and process scanned PDFs from a directory."""
    scanned_documents = []
    for root, _, files in os.walk(pdf_directory):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                scanned_documents.extend(extract_text_from_scanned_pdf(pdf_path))
    return scanned_documents

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
    TEXT_DATA_DIRECTORY = "./bot/data/text/access_to_justice"
    PDF_DATA_DIRECTORY = "./bot/data/pdfs"
    CHROMA_PATH = "chroma"

    # Load text documents
    text_documents = load_documents(data_path=TEXT_DATA_DIRECTORY, file_type="text")
    
    # Load normal PDF documents
    pdf_documents = load_documents(data_path=PDF_DATA_DIRECTORY, file_type="pdf")
    
    # Load scanned PDFs using OCR
    scanned_pdf_documents = load_and_process_scanned_pdfs(PDF_DATA_DIRECTORY)

    # Combine all documents
    all_documents = text_documents + pdf_documents + scanned_pdf_documents

    # Split documents into chunks
    chunks = chunk_documents(all_documents)

    # Populate the Chroma database with document chunks
    populate_chroma(chunks, database_path=CHROMA_PATH)


if __name__ == "__main__":
    main()
