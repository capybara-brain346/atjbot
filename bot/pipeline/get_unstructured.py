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
        list = BeautifulSoup(body, "html.parser").find("div", class_="gen-list")
        list_a_elements = BeautifulSoup(str(list), "html.parser").find_all("a")
        return list_a_elements

    def download_pdfs(self, links):
        i = 0
        for link in links:
            response = requests.get(link.get("href"))

            pdf = open(f"bot\data\pdfs\high_court_judges_{i}.pdf", "wb")
            pdf.write(response.content)
            pdf.close()
            print("File downloaded")
            i += 1

        print("All PDF files downloaded")

    def run_pipline(self):
        body = self.make_request()
        links = self.extract_links(body)
        self.download_pdfs(links)


def main():
    g = GetWhatsNew("https://doj.gov.in/list-of-high-court-judges/")
    g.run_pipline()


if __name__ == "__main__":
    main()
