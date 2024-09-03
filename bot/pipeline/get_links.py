import requests
import re
import pandas as pd
from typing import List
from bs4 import BeautifulSoup


class GetLinks:
    def __init__(self, url: str) -> None:
        self.url = url

    def make_request(self):
        try:
            resp = requests.get(url=self.url)
            resp.raise_for_status()
            return resp.text
        except requests.exceptions.ConnectionError as e:
            print(f"Connection Error: {e}")
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error: {e}")

    def extract_links(self, body: str) -> List[str]:
        soup = BeautifulSoup(body, "html.parser")
        links = [
            link.get("href")
            for link in soup.find_all("a")
            if link.get("href").split(".")[-1] not in ["pdf", "jpg"]
        ]
        if len(links) < 1:
            raise ValueError("No links found.")
        return links

    def save_links(self, links: List[str]) -> None:
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

        print(links_filtered)

        try:
            links_filtered.to_csv(r"bot\data\links\links.csv", index=False)
            print("Successfully saved dataframe.")
        except IOError as e:
            print(f"Failed to save dataframe: {e}")

    def run_pipeline(self):
        body = self.make_request()
        links = self.extract_links(body=body)
        self.save_links(links=links)
        print("Links pipeline ran successfully.")
