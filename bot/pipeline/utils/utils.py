import os
from typing import List
from langchain.schema.document import Document
from PIL import Image
import fitz
import pytesseract


def ocr_image(image_path: str) -> str:
    return pytesseract.image_to_string(Image.open(image_path))


def extract_text_from_scanned_pdf(pdf_path: str) -> List[Document]:
    """Extract text from scanned PDF files using OCR."""
    documents = []
    doc = fitz.open(pdf_path)

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        images = page.get_images(full=True)

        page_text = ""
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]

            image_path = f"temp_image_{page_num}_{img_index}.png"
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)

            text = ocr_image(image_path)
            page_text += text

            os.remove(image_path)

        documents.append(
            Document(
                page_content=page_text, metadata={"source": pdf_path, "page": page_num}
            )
        )

    return documents


def load_and_process_scanned_pdfs(pdf_directory: str) -> List[Document]:
    scanned_documents = []
    for root, _, files in os.walk(pdf_directory):
        for file in files:
            if file.lower().endswith(".pdf"):
                pdf_path = os.path.join(root, file)
                scanned_documents.extend(extract_text_from_scanned_pdf(pdf_path))
    return scanned_documents
