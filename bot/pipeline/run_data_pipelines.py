from get_links import GetLinks
from get_pending_cases import GetChipStats, GetPendingCases
from get_tables import GetTables
import argparse


def main() -> None:
    arg_parse = argparse.ArgumentParser(
        prog="Run data pipeline.",
        description="Script to run the entire data pipeline. Use cli args to control what pipeline to run.",
    )
    arg_parse.add_argument("pipeline", type=str)
    arg_parse.add_argument("url", type=str)
    args = arg_parse.parse_args()

    pipeline_dict = {
        "links": GetLinks,
        "chips": GetChipStats,
        "pendingcases": GetPendingCases,
        "tables": GetTables,
    }

    pipeline_dict[args.pipeline](args.url).run_pipeline()


if __name__ == "__main__":
    main()
