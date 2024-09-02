import requests
from bs4 import BeautifulSoup


class GetTables:
    def __init__(self, url: str) -> None:
        self.url = url

    def run_pipeline(self):
        response = requests.get(self.url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        tables = soup.find_all("table")

        with open("temp_table_file.txt", "w", encoding="utf-8") as file:
            for i, table in enumerate(tables, start=1):
                file.write(f"Table {i}:\n")

                rows = table.find_all("tr")

                for row in rows:
                    cells = row.find_all(["td", "th"])

                    cell_text = [cell.get_text(strip=True) for cell in cells]
                    file.write("\t".join(cell_text) + "\n")

                file.write("\n" + "=" * 50 + "\n\n")

        print(f"Scraped {len(tables)} tables and saved to temp_table_file.txt")
