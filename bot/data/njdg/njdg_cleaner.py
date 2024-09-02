import pandas as pd


def matter_case_types_to_csv():
    data = {
        "Category": [
            "Write Petition",
            "Second Appeal",
            "First Appeal",
            "Appeal",
            "Case/Petition",
            "Revision",
            "Reference",
            "Suit",
            "Review",
            "Application",
        ],
        "Number": [
            "1592809",
            "279899",
            "469023",
            "387945",
            "344648",
            "81233",
            "3391",
            "31516",
            "21579",
            "450385",
        ],
    }

    df = pd.DataFrame(data=data)
    df.to_csv(r"bot\data\njdg\pending_cases\matter_case_types.csv", index=False)


def application_case_types_to_csv():
    data = {
        "Category": [
            "Regular",
            "Other",
            "Original",
            "Execution",
            "Servicematters",
            "PIL",
            "TaxExciseDutyCess",
            "LabourIndustrial",
            "HabeasCorpus",
            "SpecialSubjects",
            "Landrelated",
            "SuoMotu",
            "CrossObjection",
        ],
        "Number": [
            "1,297,489",
            "108,331",
            "105,795",
            "37,215",
            "30,189",
            "10,940",
            "4,539",
            "1,370",
            "485",
            "485",
            "279",
            "94",
            "2",
        ],
    }

    df = pd.DataFrame(data=data)
    df.to_csv(r"bot\data\njdg\pending_cases\application_case_types.csv", index=False)


def age_wise_data_to_csv():
    data = {
        "Age": [
            "0 to 1 years",
            "1 to 3 years",
            "3 to 5 years",
            "5 to 10 years",
            "10 to 20 years",
            "20 to 30 years",
            "above 30 years",
        ],
        "Number": [
            "1053462",
            "723369",
            "583996",
            "1021908",
            "715597",
            "182266",
            "51610",
        ],
    }

    df = pd.DataFrame(data=data)
    df.to_csv(r"bot\data\njdg\pending_cases\age_wise_case_types.csv", index=False)


def main() -> None:
    matter_case_types_to_csv()
    application_case_types_to_csv()
    age_wise_data_to_csv()


if __name__ == "__main__":
    main()
