import requests
from typing import List
from bs4 import BeautifulSoup


class GetWhatsNew:
    def __init__(self, url) -> None:
        self.url = url

    def make_request(self):
        resp = requests.get(self.url)
        return resp.text

    def extract_links(self, body) -> List[str]:
        soup = BeautifulSoup(body, "html.parser").find_all(
            "div",
            class_="gen-list",
        )
        soup_ul_elements = BeautifulSoup(str(soup[0]), "html.parser").find("ul")
        soup_a_elements = BeautifulSoup(str(soup_ul_elements), "html.parser").find_all(
            "a"
        )
        return [link.get("href") for link in soup_a_elements]

    def extract_pdfs(self, links: List[str]):
        pdf_list = []
        for link in links:
            resp = requests.get(link)
            soup = BeautifulSoup(resp.text, "html.parser")
            tables = soup.find_all("table")
            soup_a_element = (
                BeautifulSoup(str(tables), "html.parser").find("a").get("href")
            )
            pdf_list.append(str(soup_a_element))
        return pdf_list

    def download_pdfs(self, links):
        i = 0
        for link in links:
            response = requests.get(link)

            pdf = open(f"bot\data\pdfs\whats_new_{i}.pdf", "wb")
            pdf.write(response.content)
            pdf.close()
            print("File downloaded")
            i += 1

        print("All PDF files downloaded")

    def run_pipline(self):
        body = self.make_request()
        links = self.extract_links(body)
        pdfs = self.extract_pdfs(links)
        self.download_pdfs(pdfs)


def main():
    g = GetWhatsNew("https://doj.gov.in/")
    g.run_pipline()


if __name__ == "__main__":
    main()
