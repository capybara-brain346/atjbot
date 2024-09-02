import requests
import re
import pandas as pd
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from typing import Dict
from bs4 import BeautifulSoup


class GetChipStats:
    def __init__(self, url: str) -> None:
        self.url = url

    def make_request(self) -> str:
        try:
            resp = requests.get(url=self.url)
            resp.raise_for_status()
            return resp.text
        except requests.exceptions.ConnectionError as e:
            print(f"Connection Error: {e}")
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error: {e}")

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

    def save_links(self, stats: Dict[str, str]):
        chips_data = {
            "Label": [label for label, _values in stats.items()],
            "Statistics": [values for _label, values in stats.items()],
        }
        chips_dataframe = pd.DataFrame(chips_data)
        if len(chips_dataframe) < 1:
            raise ValueError("Trying to create an empty dataframe.")
        try:
            chips_dataframe.to_csv("bot\data\\njdg\chips\chips.csv", index=False)
            print("Successfully saved dataframe.")
        except IOError:
            print("Failed to save dataframe.")

    def run_pipeline(self) -> None:
        body = self.make_request()
        stats = self.extract_cummulative_stats(body=body)
        self.save_links(stats=stats)
        print("Chips pipeline ran successfully.")


class GetPendingCases:
    def __init__(self, url: str) -> None:
        self.url = url
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_service = Service(
            executable_path=r"C:\Users\piyus\Downloads\chromedriver-win64\chromedriver.exe"
        )
        self.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

    def make_request(self) -> str:
        self.driver.get(self.url)
        return self.driver.page_source

    def extract_pending_cases(self):
        radio_buttons = self.driver.find_elements(By.NAME, "ci_cri_matter")

        all_data = []

        for button in radio_buttons:
            button.click()
            time.sleep(2)

            body = self.driver.page_source

            soup = BeautifulSoup(body, "html.parser")

            div_tag = soup.find_all("text")
            data = [txt.text for txt in div_tag]
            all_data.append(data)
        print(all_data)
        return all_data

    def close(self):
        self.driver.quit()
