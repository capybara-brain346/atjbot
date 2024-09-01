import requests
import argparse
import re
import pandas as pd
from typing import List, Dict
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
            links_filtered.to(r"bot\data\links\links.csv", index=False)
            print("Successfully saved dataframe.")
        except IOError:
            print("Failed to save dataframe.")

    def run_pipline(self):
        body = self.make_request()
        links = self.extract_links(body=body)
        self.save_links(links=links)
        print("Pipeline ran successfully.")


class GetPendingCases:
    def __init__(self, url: str) -> None:
        self.url = url

    def make_request(self):
        resp = requests.get(url=self.url)
        return resp.text

    def extract_cummulative_stats(self, body: str) -> Dict[str, str]:
        data_labels = [
            "Civil cases.",
            "Criminal cases.",
            "Total cases.",
            "Civil cases more than 1 year old.",
            "Criminal cases more than 1 year old.",
            "Cases more than 1 year old.",
        ]

        soup = BeautifulSoup(body, "html.parser")
        cummulative_stats = [
            stats.text for stats in soup.find_all("span", class_="count_class counter")
        ]
        cummulative_stats_clean = [
            re.search(r"\d+", item).group() for item in cummulative_stats
        ]

        return {
            labels: values
            for labels, values in zip(data_labels, cummulative_stats_clean)
        }


def main() -> None:
    arg_parse = argparse.ArgumentParser()

    URL = "https://doj.gov.in/"
    URL2 = "https://njdg.ecourts.gov.in/hcnjdgnew/?p=main/pend_dashboard"
    # get_links = GetLinks(url=URL)
    # get_links.run_pipline()
    get_pending_cases = GetPendingCases(url=URL2)
    print(get_pending_cases.extract_cummulative_stats(get_pending_cases.make_request()))


if __name__ == "__main__":
    main()
