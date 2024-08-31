import os

# from bot import config
import requests
import pandas as pd
from typing import List
from bs4 import BeautifulSoup


class GetLinks:
    def __init__(self, url: str) -> None:
        self.url = url

    def make_request(self):
        resp = requests.get(url=self.url)
        return resp.text

    def extract_links(self) -> List[str]:
        body = self.make_request()
        soup = BeautifulSoup(body, "html.parser")
        links = [link.get("href") for link in soup.find_all("a")]
        return links


def main() -> None:
    get_links = GetLinks("https://doj.gov.in/")
    links = get_links.extract_links()
    link_dataframe = pd.DataFrame(links, columns=["Links"])
    link_dataframe.to_csv("data/links/links.csv", index=False)


if __name__ == "__main__":
    main()
