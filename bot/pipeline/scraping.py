import requests
import re
import pandas as pd
from typing import List
from bs4 import BeautifulSoup


class GetLinks:
    def __init__(self, url: str) -> None:
        self.url = url

    def make_request(self):
        resp = requests.get(url=self.url)
        return resp.text

    def extract_links(self, body: str) -> List[str]:
        soup = BeautifulSoup(body, "html.parser")
        links = [link.get("href") for link in soup.find_all("a")]
        if len(links) < 1:
            raise ValueError("No links found.")
        return links

    def save_links(self, links: List[str]) -> str:
        link_dataframe = pd.DataFrame(links, columns=["Links"])
        if len(link_dataframe) <= 1:
            raise ValueError("Trying to create an empty dataframe.")

        url_pattern = re.compile(
            r"^(https?://)?"
            r"(www\.)?"
            r"([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)"
            r"(/[a-zA-Z0-9._~:/?#@!$&\'()*+,;=%-]*)?$"
        )
        links_filtered = link_dataframe[
            link_dataframe["Links"].apply(lambda x: bool(url_pattern.match(x)))
        ]

        try:
            links_filtered.to_csv(r"bot\data\links\links.csv", index=False)
            print("Successfully saved dataframe.")
        except IOError:
            print("Failed to save dataframe.")

    def run_pipline(self):
        body = self.make_request()
        links = self.extract_links(body=body)
        self.save_links(links=links)
        print("Pipeline ran successfully.")


def main() -> None:
    URL = "https://doj.gov.in/"
    get_links = GetLinks(url=URL)
    get_links.run_pipline()


if __name__ == "__main__":
    main()
