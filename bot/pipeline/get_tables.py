import requests
from bs4 import BeautifulSoup
import os


def scrape_tables_to_txt(url: str, output_file: str):
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    tables = soup.find_all("table")

    with open(output_file, "w", encoding="utf-8") as file:
        for i, table in enumerate(tables, start=1):
            file.write(f"Table {i}:\n")

            rows = table.find_all("tr")

            for row in rows:
                cells = row.find_all(["td", "th"])

                cell_text = [cell.get_text(strip=True) for cell in cells]
                file.write("\t".join(cell_text) + "\n")

            file.write("\n" + "=" * 50 + "\n\n")

    print(f"Scraped {len(tables)} tables and saved to {output_file}")


def main():
    url = "https://doj.gov.in/national-judicial-academy-5/"
    output_file = r"bot\data\text\administration_of_justice\acts_and_rules.txt"

    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    scrape_tables_to_txt(url, output_file)


if __name__ == "__main__":
    main()
