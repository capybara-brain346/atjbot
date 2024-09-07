import os
import logging
import re
from typing import List, Tuple
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
from nltk import pos_tag

load_dotenv()


def extract_keywords(prompt: str) -> str:
    nltk.download("punkt", quiet=True)
    nltk.download("punkt_tab", quiet=True)
    nltk.download("stopwords", quiet=True)
    nltk.download("averaged_perceptron_tagger", quiet=True)
    nltk.download("averaged_perceptron_tagger_eng", quiet=True)

    tokens = word_tokenize(prompt.lower())

    stop_words = set(stopwords.words("english"))
    filtered_tokens = [
        word for word in tokens if word.isalnum() and word not in stop_words
    ]

    tagged_tokens = pos_tag(filtered_tokens)

    keywords = [
        word for word, tag in tagged_tokens if tag in ("NN", "NNS", "JJ", "JJR", "JJS")
    ]
    fdist = FreqDist(keywords)

    keywords = fdist.most_common()
    keyword_joint = " ".join([keyword for keyword, idx in keywords]).title()

    return keyword_joint


def extract_urls(url_list: List[str]) -> List[str]:
    url_pattern = re.compile(
        r"http[s]?://"
        r"(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|"
        r"(?:%[0-9a-fA-F][0-9a-fA-F]))+"
    )

    extracted_urls = []
    for text in url_list:
        match = url_pattern.search(text)
        if match:
            extracted_urls.append(match.group(0))

    return extracted_urls


def query_rag(query_text: str) -> Tuple[str, List[str]] | str:
    PROMPT_TEMPLATE = """
    Here is the context provided:

    {context}

    ---

    Answer the following question based on the above context. If the question is a greeting, farewell, or expression of thanks, respond warmly and personally without referencing the context. For queries unrelated to legal content, reply with: "I’m sorry, but I can’t assist with that." Please ensure your response is descriptive and informative based on the context.

    Question: {question}
    """
    try:
        db = Chroma(
            persist_directory="chroma",
            embedding_function=GoogleGenerativeAIEmbeddings(
                model="models/embedding-001"
            ),
        )
        db_links = Chroma(
            persist_directory="chroma_links",
            embedding_function=GoogleGenerativeAIEmbeddings(
                model="models/embedding-001"
            ),
        )

        results = db.similarity_search_with_score(query_text, k=5)
        hyperlink_results = db_links.similarity_search_with_score(
            extract_keywords(query_text), k=5
        )

        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
        context_links = extract_urls(
            [doc.page_content for doc, _score in hyperlink_results]
        )
        print(context_links)
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", api_key=os.getenv("GOOGLE_API_KEY")
        )
        response = model.invoke(prompt)

        if hasattr(response, "content"):
            return response.content.strip(), context_links
        return str(response).strip(), context_links

    except Exception as e:
        logging.error(f"Error in query_rag: {e}")
        return "An error occurred while processing the query."
