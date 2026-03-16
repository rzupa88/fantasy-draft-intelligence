from packages.data.ingest.adp import fetch_historical_adp
from packages.data.io import write_parquet
from packages.shared.logging import get_logger

logger = get_logger(__name__)


def main() -> None:
    logger.info("Fetching historical ADP data")
    df = fetch_historical_adp()
    output_path = "data/raw/adp_sample.parquet"
    write_parquet(df, output_path)
    logger.info("Wrote %s rows to %s", len(df), output_path)


if __name__ == "__main__":
    main()
