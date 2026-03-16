from packages.data.ingest.adp import fetch_historical_adp
from packages.data.validation import require_columns



def main() -> None:
    adp = fetch_historical_adp()
    require_columns(adp, ["season", "player_name", "position", "adp_overall"])
    print("Validation passed.")


if __name__ == "__main__":
    main()
