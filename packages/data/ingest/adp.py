from __future__ import annotations

import re
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from typing import Final
from urllib.request import Request, urlopen

import pandas as pd

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.io import write_parquet
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "position",
    "source_name",
]

SOURCE_NAME: Final[str] = "fantasypros"

DEFAULT_SOURCE_URLS: Final[dict[int, str]] = {
    2023: "https://www.fantasypros.com/nfl/adp/overall.php?year=2023",
    2024: "https://www.fantasypros.com/nfl/adp/overall.php?year=2024",
}

REQUEST_HEADERS: Final[dict[str, str]] = {
    "User-Agent": "fantasy-draft-intelligence/0.1 (+historical-adp-ingestion)"
}


@dataclass(frozen=True)
class AdpIngestConfig:
    years: list[int]
    raw_dir: Path
    intermediate_dir: Path
    source_urls: dict[int, str]


def default_config() -> AdpIngestConfig:
    return AdpIngestConfig(
        years=list(DEFAULT_PILOT_YEARS),
        raw_dir=Path(RAW_DATA_DIR),
        intermediate_dir=Path(INTERMEDIATE_DATA_DIR),
        source_urls=dict(DEFAULT_SOURCE_URLS),
    )


def _fetch_html(url: str) -> str:
    request = Request(url, headers=REQUEST_HEADERS)
    with urlopen(request) as response:  # noqa: S310
        return response.read().decode("utf-8")


def _extract_raw_table_from_html(html: str, season: int) -> pd.DataFrame:
    tables = pd.read_html(StringIO(html))
    if not tables:
        raise ValueError(f"No HTML tables found for season {season}")

    raw = tables[0].copy()
    raw.columns = [str(col).strip() for col in raw.columns]

    expected_columns = {"Player Team (Bye)", "POS", "AVG"}
    missing_columns = expected_columns.difference(raw.columns)
    if missing_columns:
        raise ValueError(
            f"Missing expected FantasyPros columns for season {season}: "
            f"{sorted(missing_columns)}"
        )

    raw["season"] = season
    raw["source_name"] = SOURCE_NAME
    return raw


def _split_player_name(value: object) -> str:
    text = str(value).strip()
    if not text:
        return text

    # Remove trailing "TEAM (BYE)" suffix, e.g. "DAL (7)", "SF (9)", "NYJ (12)"
    text = re.sub(r"\s+[A-Z]{2,3}\s+\(\d+\)$", "", text)
    return text.strip()


def _extract_position(value: object) -> str:
    text = str(value).strip().upper()
    if not text:
        return text

    for valid_position in ("QB", "RB", "WR", "TE", "DST", "K"):
        if text.startswith(valid_position):
            return valid_position

    return text


def normalize_historical_adp(raw_df: pd.DataFrame) -> pd.DataFrame:
    normalized = pd.DataFrame(
        {
            "season": pd.to_numeric(raw_df["season"], errors="coerce").astype("Int64"),
            "player_name": raw_df["Player Team (Bye)"].map(_split_player_name),
            "position": raw_df["POS"].map(_extract_position),
            "adp_overall": pd.to_numeric(raw_df["AVG"], errors="coerce"),
            "source_name": raw_df["source_name"].astype("string").str.strip(),
        }
    )

    normalized["player_name"] = normalized["player_name"].astype("string").str.strip()
    normalized["position"] = normalized["position"].astype("string").str.strip()

    normalized = normalized.dropna(subset=["season", "player_name", "position", "adp_overall"])

    normalized["player_name"] = normalized["player_name"].str.strip()

    normalized = normalized.loc[
        (normalized["player_name"] != "") & (normalized["player_name"].notna())
    ].copy()

    normalized["season"] = normalized["season"].astype(int)
    normalized["adp_overall"] = normalized["adp_overall"].astype(float)

    require_columns(normalized, REQUIRED_OUTPUT_COLUMNS)
    assert_unique_key(normalized, UNIQUE_KEY_COLUMNS)

    return normalized.sort_values(["season", "adp_overall", "player_name"]).reset_index(drop=True)


def _raw_snapshot_path(raw_dir: Path, season: int) -> Path:
    return raw_dir / f"adp_{SOURCE_NAME}_{season}_overall.html"


def _normalized_output_path(intermediate_dir: Path, years: list[int]) -> Path:
    min_year = min(years)
    max_year = max(years)
    return intermediate_dir / f"adp_historical_{min_year}_{max_year}.parquet"


def ingest_historical_adp(config: AdpIngestConfig) -> pd.DataFrame:
    missing_years = [year for year in config.years if year not in config.source_urls]
    if missing_years:
        raise ValueError(f"No ADP source URL configured for seasons {missing_years}")

    raw_frames: list[pd.DataFrame] = []

    config.raw_dir.mkdir(parents=True, exist_ok=True)
    config.intermediate_dir.mkdir(parents=True, exist_ok=True)

    for season in config.years:
        html = _fetch_html(config.source_urls[season])

        snapshot_path = _raw_snapshot_path(config.raw_dir, season)
        snapshot_path.write_text(html, encoding="utf-8")

        raw_frame = _extract_raw_table_from_html(html, season)
        raw_frame["raw_snapshot_path"] = str(snapshot_path)
        raw_frames.append(raw_frame)

    raw_combined = pd.concat(raw_frames, ignore_index=True)
    normalized = normalize_historical_adp(raw_combined)

    output_path = _normalized_output_path(config.intermediate_dir, config.years)
    write_parquet(normalized, output_path)

    return normalized


def fetch_historical_adp() -> pd.DataFrame:
    """
    Backward-compatible public entry point for historical ADP ingestion.
    """
    return ingest_historical_adp(default_config())
