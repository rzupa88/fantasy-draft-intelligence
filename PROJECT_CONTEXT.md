# Fantasy Draft Intelligence — Project Context

This file is auto-generated to give ChatGPT a compact, practical understanding of the repository. It is meant to support feature planning, debugging, architecture discussions, and implementation help.

## Project Summary

# Fantasy Draft Intelligence

A Git-first fantasy football draft intelligence platform built in GitHub Codespaces.

## Purpose
This project aims to identify when the fantasy football market is mispricing players relative to expected outcomes.

The product is built around four layers:
1. Data collection and normalization
2. Feature engineering and research
3. Predictive modeling and value scoring
4. Draft decision support

## Core Question
At a given draft pick, which available player offers the best risk-adjusted value relative to market price and roster needs?

## Principles
- ADP is the baseline, not the answer
- Narratives must become variables
- Opportunity matters more than story
- Everything should be reproducible
- Git is the operating system for the project

## Tech Stack
- Python
- GitHub Codespaces
- Pandas / Polars
- DuckDB / Parquet
- scikit-learn
- pytest
- ruff
- black

## Initial Milestone
**M1: Core Historical Warehouse for Pilot Seasons**

This milestone includes:
- repo setup
- Codespaces environment
- source inventory
- nflverse ingestion
- ADP ingestion prototype
- canonical IDs
- initial validation

## Quick Start

### 1. Open in Codespaces
Open the repository in GitHub Codespaces.

### 2. Install dependencies
This should happen automatically in the devcontainer. If needed:

```bash
pip install -e .[dev]

## Quickstart and Useful Commands

Potentially useful commands and setup hints found in project files:

```text
- pytest
## Quick Start
### 2. Install dependencies
This should happen automatically in the devcontainer. If needed:
pip install -e .[dev]
[build-system]
build-backend = "setuptools.build_meta"
dev = [
"pytest>=8.2.0",
[tool.ruff.lint]
[tool.pytest.ini_options]
testpaths = ["tests"]
.PHONY: install lint format test bootstrap ingest-nflverse ingest-adp validate
install:
lint:
test:
pytest
```

## Repository Structure

```text
├── apps
│   ├── api
│   └── web
├── artifacts
│   ├── figures
│   ├── model_cards
│   └── reports
├── config
│   └── settings.yaml
├── data
│   ├── intermediate
│   ├── processed
│   └── raw
├── docs
│   ├── adr
│   │   └── 0000-adr-template.md
│   ├── architecture
│   │   └── README.md
│   ├── research
│   │   └── README.md
│   ├── runbooks
│   │   └── README.md
│   ├── MASTER_PROJECT_PLAN.md
│   └── SOURCE_INVENTORY.md
├── notebooks
│   ├── exploratory
│   ├── modeling
│   └── validation
├── packages
│   ├── data
│   │   ├── ingest
│   │   │   ├── __init__.py
│   │   │   ├── adp.py
│   │   │   ├── coaching.py
│   │   │   └── nflverse.py
│   │   ├── __init__.py
│   │   ├── constants.py
│   │   ├── io.py
│   │   ├── player_ids.py
│   │   └── validation.py
│   ├── modeling
│   │   ├── __init__.py
│   │   └── baseline.py
│   └── shared
│       ├── __init__.py
│       └── logging.py
├── scripts
│   ├── bootstrap.py
│   ├── build_player_reference.py
│   ├── ingest_adp.py
│   ├── ingest_nflverse.py
│   └── validate_data.py
├── tests
│   ├── data
│   │   ├── ingest
│   │   │   ├── test_adp.py
│   │   │   └── test_nflverse.py
│   │   └── test_player_ids.py
│   ├── test_smoke.py
│   └── test_validation.py
├── tools
│   └── build_project_context.py
├── debug_adp.csv
├── Makefile
├── PROJECT_CONTEXT.md
├── pyproject.toml
└── README.md
```

## Root Configuration and Dependency Files

### `README.md`

```text
# Fantasy Draft Intelligence

A Git-first fantasy football draft intelligence platform built in GitHub Codespaces.

## Purpose
This project aims to identify when the fantasy football market is mispricing players relative to expected outcomes.

The product is built around four layers:
1. Data collection and normalization
2. Feature engineering and research
3. Predictive modeling and value scoring
4. Draft decision support

## Core Question
At a given draft pick, which available player offers the best risk-adjusted value relative to market price and roster needs?

## Principles
- ADP is the baseline, not the answer
- Narratives must become variables
- Opportunity matters more than story
- Everything should be reproducible
- Git is the operating system for the project

## Tech Stack
- Python
- GitHub Codespaces
- Pandas / Polars
- DuckDB / Parquet
- scikit-learn
- pytest
- ruff
- black

## Initial Milestone
**M1: Core Historical Warehouse for Pilot Seasons**

This milestone includes:
- repo setup
- Codespaces environment
- source inventory
- nflverse ingestion
- ADP ingestion prototype
- canonical IDs
- initial validation

## Quick Start

### 1. Open in Codespaces
Open the repository in GitHub Codespaces.

### 2. Install dependencies
This should happen automatically in the devcontainer. If needed:

```bash
pip install -e .[dev]
```

### `pyproject.toml`

```text
[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "fantasy-draft-intelligence"
version = "0.1.0"
description = "Git-first fantasy football draft intelligence platform"
readme = "README.md"
requires-python = ">=3.11"
authors = [
  { name = "Ryan Zupa" }
]
dependencies = [
  "pandas>=2.2.0",
  "pyarrow>=16.0.0",
  "duckdb>=1.0.0",
  "requests>=2.32.0",
  "beautifulsoup4>=4.12.0",
  "lxml>=5.2.0",
  "pydantic>=2.7.0",
  "scikit-learn>=1.5.0",
  "pyyaml>=6.0.1",
  "typer>=0.12.3",
  "rich>=13.7.1",
  "nflreadpy>=0.1.0",
  "polars>=1.0.0",
  "pyarrow>=15.0.0"
]

[project.optional-dependencies]
dev = [
  "pytest>=8.2.0",
  "ruff>=0.5.0",
  "black>=24.4.2",
  "jupyter>=1.0.0",
  "ipykernel>=6.29.4"
]

[tool.setuptools]
packages = ["packages.data", "packages.data.ingest", "packages.modeling", "packages.shared"]

[tool.black]
line-length = 100
target-version = ["py311"]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]
ignore = []

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
```

### `Makefile`

```text
.PHONY: install lint format test bootstrap ingest-nflverse ingest-adp validate

install:
	pip install -e .[dev]

lint:
	ruff check .

format:
	black .

test:
	pytest

bootstrap:
	python scripts/bootstrap.py

ingest-nflverse:
	python scripts/ingest_nflverse.py --years 2023 2024

ingest-adp:
	python scripts/ingest_adp.py

validate:
	python scripts/validate_data.py
```

### `config/settings.yaml`

```text
project:
  name: fantasy-draft-intelligence
  default_scoring_format: half_ppr
  pilot_years:
    - 2023
    - 2024

paths:
  raw_data: data/raw
  intermediate_data: data/intermediate
  processed_data: data/processed
  artifacts: artifacts

validation:
  fail_on_duplicate_keys: true
  fail_on_missing_required_columns: true
```

## Key Documentation

### `docs/adr/0000-adr-template.md`

```text
# ADR-0000: Title Goes Here

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Decision Makers:**
- **Related Issues:**

## Context
What problem are we solving?

## Decision
What did we decide?

## Rationale
Why was this chosen over alternatives?

## Alternatives Considered
- Option A
- Option B
- Option C

## Consequences
### Positive
-

### Negative
-

## Follow-Up Actions
- [ ]
- [ ]
```

### `docs/architecture/README.md`

```text
# Architecture Notes

This directory stores architecture diagrams, decisions, and system design notes.

Suggested future contents:
- system context diagram
- data flow diagram
- storage design notes
- model lifecycle notes
- app architecture notes
```

### `docs/MASTER_PROJECT_PLAN.md`

```text

```

### `docs/research/README.md`

```text
# Research Notes

This directory stores research summaries that translate exploratory analysis into product and modeling decisions.

Each research note should include:
- question
- data used
- method
- findings
- limitations
- implications
```

### `docs/runbooks/README.md`

```text
# Runbooks

This directory stores step-by-step operational procedures.

Suggested future runbooks:
- historical backfill runbook
- preseason refresh runbook
- model training runbook
- release checklist
```

### `docs/SOURCE_INVENTORY.md`

```text
# Source Inventory

## Purpose
This document tracks every external data source used by the project.

## Guiding Rules
- Prefer free and reproducible sources
- Minimize scraping surface area
- Snapshot volatile data where practical
- Document provenance for every dataset

## Core Sources

### 1. nflverse
**Use for:**
- weekly player stats
- rosters
- schedules
- snap counts
- play-by-play
- team-level data where applicable

**Access method:**
- Python package access or direct supported data access workflow

**Priority:** Primary

### 2. FantasyPros
**Use for:**
- historical ADP
- overall draft cost baseline for MVP pilot seasons

**Access method:**
- controlled extract from season-specific historical overall ADP pages
- explicit URL manifest by season
- raw HTML snapshots saved to `data/raw/`
- normalized parquet saved to `data/intermediate/`

**Current provenance:**
- FantasyPros NFL historical overall ADP page for 2023
- FantasyPros NFL historical overall ADP page for 2024

**Normalization fields:**
- season
- player_name
- position
- adp_overall
- source_name

**Reproducibility policy:**
- snapshot raw source HTML during ingestion
- avoid broad, dynamic scraping
- extend coverage by adding explicit season URLs to the ingestion manifest

**Priority:** Primary for ADP

### 3. Pro-Football-Reference
**Use for:**
- coaching history
- team-level reference data
- fallback cross-checking

**Access method:**
- careful scrape or manual maintenance when needed

**Priority:** Secondary / selective

## Datasets Required for MVP
- weekly player stats
- season player stats
- snap counts
- rosters
- ADP
- coaching history
- team season context

## Open Questions
- exact ADP historical coverage by season
- whether coaching table should be fully manual for MVP
- whether additional context sources are needed for QB changes / depth chart changes
```

## Important Source Files

### `packages/data/ingest/adp.py`

```text
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
from packages.data.player_ids import attach_canonical_ids_pandas
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "canonical_player_id",
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

    normalized["player_name"] = normalized["player_name"].astyp

[TRUNCATED]
```

### `packages/data/ingest/coaching.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_coaching_history() -> pd.DataFrame:
    """
    Placeholder coaching history extractor.

    MVP may begin with a manually maintained table.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "team": "EX",
                "head_coach": "Example HC",
                "offensive_coordinator": "Example OC",
            }
        ]
    )
```

### `packages/data/ingest/nflverse.py`

```text
from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

import nflreadpy as nfl
import polars as pl

from packages.data.player_ids import attach_canonical_ids_polars

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "team",
    "position",
    "fantasy_points",
    "source_name",
]

TEAM_COLUMN_CANDIDATES = [
    "recent_team",
    "team",
    "team_abbr",
    "posteam",
]

PLAYER_NAME_CANDIDATES = [
    "player_display_name",
    "player_name",
]

FANTASY_POINTS_CANDIDATES = [
    "fantasy_points",
    "fantasy_points_ppr",
]

SOURCE_NAME = "nflverse"


@dataclass(frozen=True)
class NflverseIngestConfig:
    years: Sequence[int]
    raw_dir: Path
    intermediate_dir: Path


def _first_existing_column(df: pl.DataFrame, candidates: Sequence[str]) -> str:
    for column in candidates:
        if column in df.columns:
            return column
    raise ValueError(f"None of the candidate columns exist: {candidates}")


def _normalize_weekly_player_stats(df: pl.DataFrame) -> pl.DataFrame:
    player_name_col = _first_existing_column(df, PLAYER_NAME_CANDIDATES)
    team_col = _first_existing_column(df, TEAM_COLUMN_CANDIDATES)
    fantasy_points_col = _first_existing_column(df, FANTASY_POINTS_CANDIDATES)

    required_source_columns = {
        "season",
        "week",
        player_name_col,
        team_col,
        "position",
        fantasy_points_col,
    }
    missing = required_source_columns.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required source columns: {sorted(missing)}")

    normalized = (
        df.select(
            [
                pl.col("season").cast(pl.Int64),
                pl.col("week").cast(pl.Int64),
                pl.col(player_name_col).alias("player_name").cast(pl.Utf8),
                pl.col(team_col).alias("team").cast(pl.Utf8),
                pl.col("position").cast(pl.Utf8),
                pl.col(fantasy_points_col).alias("fantasy_points").cast(pl.Float64),
            ]
        )
        .filter(
            pl.col("season").is_not_null()
            & pl.col("week").is_not_null()
            & pl.col("player_name").is_not_null()
        )
        .with_columns(
            [
                pl.col("player_name").str.strip_chars(),
                pl.col("team").str.strip_chars(),
                pl.col("position").str.strip_chars(),
                pl.lit(SOURCE_NAME).alias("source_name"),
            ]
        )
    )

    normalized = attach_canonical_ids_polars(normalized)
    normalized = normalized.select(REQUIRED_OUTPUT_COLUMNS)
    normalized = normalized.sort(["season", "week", "canonical_player_id"])

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_

[TRUNCATED]
```

### `packages/data/validation.py`

```text
from collections.abc import Sequence

import pandas as pd


class ValidationError(Exception):
    """Raised when a data validation check fails."""


def require_columns(df: pd.DataFrame, required_columns: Sequence[str]) -> None:
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValidationError(f"Missing required columns: {missing}")


def assert_unique_key(df: pd.DataFrame, key_columns: Sequence[str]) -> None:
    duplicates = df.duplicated(subset=list(key_columns), keep=False)
    if duplicates.any():
        dup_count = int(duplicates.sum())
        raise ValidationError(
            f"Found {dup_count} duplicate rows for key columns: {list(key_columns)}"
        )
```

### `packages/modeling/baseline.py`

```text
from __future__ import annotations

import pandas as pd


def adp_baseline_rank(df: pd.DataFrame) -> pd.DataFrame:
    """
    Minimal baseline that treats ADP as the model prediction.
    """
    output = df.copy()
    if "adp_overall" in output.columns:
        output["predicted_rank_from_adp"] = output["adp_overall"]
    return output
```

### `scripts/ingest_adp.py`

```text
from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.ingest.adp import (
    DEFAULT_SOURCE_URLS,
    AdpIngestConfig,
    ingest_historical_adp,
)
from packages.shared.logging import get_logger

logger = get_logger(__name__)

DEFAULT_RAW_DIR = Path(RAW_DATA_DIR)
DEFAULT_INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest historical fantasy football ADP data")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_PILOT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw HTML snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    source_urls = {year: DEFAULT_SOURCE_URLS[year] for year in args.years}

    config = AdpIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
        source_urls=source_urls,
    )

    logger.info("Ingesting historical ADP for seasons=%s", args.years)
    df = ingest_historical_adp(config)
    logger.info(
        "ADP ingest complete: rows=%s cols=%s years=%s-%s",
        len(df),
        len(df.columns),
        min(args.years),
        max(args.years),
    )


if __name__ == "__main__":
    main()
```

### `scripts/ingest_nflverse.py`

```text
from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.ingest.nflverse import NflverseIngestConfig, ingest_nflverse_weekly_players

DEFAULT_YEARS = [2023, 2024]
DEFAULT_RAW_DIR = Path("data/raw")
DEFAULT_INTERMEDIATE_DIR = Path("data/intermediate")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest weekly NFL player data from nflverse")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw parquet snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    config = NflverseIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
    )

    df = ingest_nflverse_weekly_players(config)
    print(
        f"Ingest complete: rows={df.height}, cols={df.width}, "
        f"years={min(args.years)}-{max(args.years)}"
    )


if __name__ == "__main__":
    main()
```

### `scripts/validate_data.py`

```text
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.validation import require_columns


def main() -> None:
    adp = fetch_historical_adp()
    require_columns(adp, ["season", "player_name", "position", "adp_overall"])
    print("Validation passed.")


if __name__ == "__main__":
    main()
```

### `tests/test_smoke.py`

```text
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.ingest.nflverse import fetch_weekly_player_data


def test_fetch_historical_adp_returns_dataframe() -> None:
    df = fetch_historical_adp()
    assert not df.empty


def test_fetch_weekly_player_data_returns_dataframe() -> None:
    df = fetch_weekly_player_data([2024])
    assert not df.is_empty()
```

### `tests/test_validation.py`

```text
import pandas as pd
import pytest

from packages.data.validation import ValidationError, assert_unique_key, require_columns


def test_require_columns_passes_when_columns_exist() -> None:
    df = pd.DataFrame({"a": [1], "b": [2]})
    require_columns(df, ["a", "b"])


def test_require_columns_raises_when_missing_columns() -> None:
    df = pd.DataFrame({"a": [1]})
    with pytest.raises(ValidationError):
        require_columns(df, ["a", "b"])


def test_assert_unique_key_raises_on_duplicates() -> None:
    df = pd.DataFrame({"season": [2024, 2024], "player": ["x", "x"]})
    with pytest.raises(ValidationError):
        assert_unique_key(df, ["season", "player"])
```

### `packages/data/ingest/__init__.py`

```text
"""Data ingestion modules."""
```

### `packages/modeling/__init__.py`

```text
"""Modeling package."""
```

### `packages/data/constants.py`

```text
"""Project-wide constants."""

RAW_DATA_DIR = "data/raw"
INTERMEDIATE_DATA_DIR = "data/intermediate"
PROCESSED_DATA_DIR = "data/processed"

DEFAULT_PILOT_YEARS = [2023, 2024]
VALID_POSITIONS = {"QB", "RB", "WR", "TE", "K", "DST"}
```

### `packages/data/io.py`

```text
from pathlib import Path

import pandas as pd


def ensure_parent_dir(path: str | Path) -> Path:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return output_path


def write_parquet(df: pd.DataFrame, path: str | Path) -> None:
    output_path = ensure_parent_dir(path)
    df.to_parquet(output_path, index=False)


def read_parquet(path: str | Path) -> pd.DataFrame:
    return pd.read_parquet(path)
```

### `packages/data/player_ids.py`

```text
from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

import pandas as pd
import polars as pl

from packages.data.validation import assert_unique_key, require_columns

CANONICAL_ID_COLUMN = "canonical_player_id"
NORMALIZED_NAME_COLUMN = "normalized_player_name"
ENTITY_TYPE_COLUMN = "entity_type"

PLAYER_ENTITY = "player"
DST_ENTITY = "dst"

POSITION_NORMALIZATION_MAP: dict[str, str] = {
    "QB": "QB",
    "RB": "RB",
    "WR": "WR",
    "TE": "TE",
    "K": "K",
    "DST": "DST",
    "DEF": "DST",
    "D/ST": "DST",
}

_SUFFIX_PATTERN = re.compile(r"\b(jr|sr|ii|iii|iv|v)\b", flags=re.IGNORECASE)
_MULTI_SPACE_PATTERN = re.compile(r"\s+")
_NON_WORD_SPACE_HYPHEN_SLASH_PATTERN = re.compile(r"[^a-z0-9\s\-/]")
_DST_TOKEN_PATTERN = re.compile(r"\b(?:d\s*/\s*st|dst|defense|def)\b", flags=re.IGNORECASE)

DST_ALIAS_MAP: dict[str, str] = {
    "arizona cardinals": "arizona_cardinals",
    "atlanta falcons": "atlanta_falcons",
    "baltimore ravens": "baltimore_ravens",
    "buffalo bills": "buffalo_bills",
    "carolina panthers": "carolina_panthers",
    "chicago bears": "chicago_bears",
    "cincinnati bengals": "cincinnati_bengals",
    "cleveland browns": "cleveland_browns",
    "dallas cowboys": "dallas_cowboys",
    "denver broncos": "denver_broncos",
    "detroit lions": "detroit_lions",
    "green bay packers": "green_bay_packers",
    "houston texans": "houston_texans",
    "indianapolis colts": "indianapolis_colts",
    "jacksonville jaguars": "jacksonville_jaguars",
    "kansas city chiefs": "kansas_city_chiefs",
    "las vegas raiders": "las_vegas_raiders",
    "los angeles chargers": "los_angeles_chargers",
    "los angeles rams": "los_angeles_rams",
    "miami dolphins": "miami_dolphins",
    "minnesota vikings": "minnesota_vikings",
    "new england patriots": "new_england_patriots",
    "new orleans saints": "new_orleans_saints",
    "new york giants": "new_york_giants",
    "new york jets": "new_york_jets",
    "philadelphia eagles": "philadelphia_eagles",
    "pittsburgh steelers": "pittsburgh_steelers",
    "san francisco 49ers": "san_francisco_49ers",
    "seattle seahawks": "seattle_seahawks",
    "tampa bay buccaneers": "tampa_bay_buccaneers",
    "tennessee titans": "tennessee_titans",
    "washington commanders": "washington_commanders",
}

DST_ABBR_MAP: dict[str, str] = {
    "ARI": "arizona_cardinals",
    "ATL": "atlanta_falcons",
    "BAL": "baltimore_ravens",
    "BUF": "buffalo_bills",
    "CAR": "carolina_panthers",
    "CHI": "chicago_bears",
    "CIN": "cincinnati_bengals",
    "CLE": "cleveland_browns",
    "DAL": "dallas_cowboys",
    "DEN": "denver_broncos",
    "DET": "detroit_lions",
    "GB": "green_bay_packers",
    "HOU": "houston_texans",
    "IND": "indianapolis_colts",
    "JAX": "jacksonville_jaguars",
    "KC": "kansas_city_chiefs",
    "LV": "las_vegas_raiders",
    "LAC": "los_angeles_chargers",
    "LAR": "los_angeles_rams",
    "MIA": "miami_dolphins",
    "MIN": "minnesota_vikings",
    "NE": "new_england_patriots",
    "NO": "new_orleans_saints",
    "NYG": "new_york_giants",
    "NYJ": "new_york_jets",
    "PHI": "philadelphia_eagles",
    "PIT": "pittsburgh_steelers",
    "SF": "san_francisco_49ers",
    "SEA": "seattle_seahawks",
    "TB": "tampa_bay_buccaneers",
    "TEN": "tennessee_titans",
    "WAS": "washington_commanders",
}


def normalize_position(value: object) -> str:
    text = str(value).strip().upper()
    return POSITION_NORMALIZA

[TRUNCATED]
```

### `packages/shared/logging.py`

```text
import logging


def get_logger(name: str) -> logging.Logger:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    return logging.getLogger(name)
```

### `scripts/bootstrap.py`

```text
from pathlib import Path

DIRECTORIES = [
    "data/raw",
    "data/intermediate",
    "data/processed",
    "artifacts/figures",
    "artifacts/reports",
    "artifacts/model_cards",
]

for directory in DIRECTORIES:
    Path(directory).mkdir(parents=True, exist_ok=True)

print("Bootstrap complete.")
```

### `scripts/build_player_reference.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
```

### `tests/data/ingest/test_adp.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from packages.data.ingest.adp import (
    REQUIRED_OUTPUT_COLUMNS,
    UNIQUE_KEY_COLUMNS,
    AdpIngestConfig,
    ingest_historical_adp,
    normalize_historical_adp,
)
from packages.data.validation import ValidationError


@pytest.fixture
def fantasypros_html_2023() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Christian McCaffrey SF (9)</td><td>RB1</td><td>1.2</td></tr>
            <tr><td>2</td><td>Tyreek Hill MIA (10)</td><td>WR1</td><td>4.8</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


@pytest.fixture
def fantasypros_html_2024() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>CeeDee Lamb DAL (7)</td><td>WR1</td><td>2.1</td></tr>
            <tr><td>2</td><td>Breece Hall NYJ (12)</td><td>RB2</td><td>5.0</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


def test_normalize_historical_adp_requires_expected_columns() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)"],
            "POS": ["WR1"],
            "AVG": [2.1],
            "source_name": ["fantasypros"],
        }
    )

    normalized = normalize_historical_adp(raw)

    assert list(normalized.columns) == REQUIRED_OUTPUT_COLUMNS
    assert normalized.iloc[0]["player_name"] == "CeeDee Lamb"
    assert normalized.iloc[0]["position"] == "WR"


def test_normalize_historical_adp_rejects_duplicate_keys() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024, 2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)", "CeeDee Lamb DAL (7)"],
            "POS": ["WR1", "WR1"],
            "AVG": [2.1, 2.1],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    with pytest.raises(ValidationError, match="duplicate rows"):
        normalize_historical_adp(raw)


def test_ingest_historical_adp_writes_raw_and_intermediate_outputs(
    monkeypatch,
    tmp_path: Path,
    fantasypros_html_2023: str,
    fantasypros_html_2024: str,
) -> None:
    from packages.data.ingest import adp as adp_module

    html_by_url = {
        "https://example.test/2023": fantasypros_html_2023,
        "https://example.test/2024": fantasypros_html_2024,
    }

    def fake_fetch_html(url: str) -> str:
        return html_by_url[url]

    monkeypatch.setattr(adp_module, "_fetch_html", fake_fetch_html)

    config = AdpIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
        source_urls={
            2023: "https://example.test/2023",
            2024: "https://example.test/2024",
        },
    )

    df = ingest_historical_adp(config)

    assert list(df.columns) == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().tolist()) == [2023, 2024]
    assert UNIQUE_KEY_COLUMNS == ["season", "canonical_player_id", "source_name"]

[TRUNCATED]
```

### `tests/data/ingest/test_nflverse.py`

```text
from __future__ import annotations

from pathlib import Path

import polars as pl
import pytest

from packages.data.ingest.nflverse import (
    REQUIRED_OUTPUT_COLUMNS,
    NflverseIngestConfig,
    ingest_nflverse_weekly_players,
)


@pytest.fixture
def sample_raw_df() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2023, 2023, 2024],
            "week": [1, 2, 1],
            "player_display_name": ["Christian McCaffrey", "Tyreek Hill", "Josh Allen"],
            "recent_team": ["SF", "MIA", "BUF"],
            "position": ["RB", "WR", "QB"],
            "fantasy_points": [24.6, 31.2, 27.8],
            "extra_col": [1, 2, 3],
        }
    )


def test_ingest_nflverse_weekly_players_writes_outputs(
    monkeypatch,
    tmp_path: Path,
    sample_raw_df: pl.DataFrame,
) -> None:

    from packages.data.ingest import nflverse as nflverse_module

    def fake_load_player_stats(seasons, summary_level):
        assert seasons == [2023, 2024]
        assert summary_level == "week"
        return sample_raw_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    df = ingest_nflverse_weekly_players(config)

    assert df.height == 3
    assert df.columns == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().to_list()) == [2023, 2024]

    raw_files = list((tmp_path / "raw").glob("*.parquet"))
    intermediate_files = list((tmp_path / "intermediate").glob("*.parquet"))

    assert len(raw_files) == 1
    assert len(intermediate_files) == 1


def test_ingest_requires_expected_columns(monkeypatch, tmp_path: Path) -> None:
    from packages.data.ingest import nflverse as nflverse_module

    bad_df = pl.DataFrame(
        {
            "season": [2023],
            "week": [1],
            "position": ["RB"],
        }
    )

    def fake_load_player_stats(seasons, summary_level):
        return bad_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    with pytest.raises(ValueError):
        ingest_nflverse_weekly_players(config)
```

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "RB"],
            "source_name": ["nflverse", "nflverse"],
        }
    )

    reference = build_player_reference_table([adp, nflverse])

    dj_rows = reference.loc[reference["canonical_player_id"] == "player:dj_moore:WR"]
    kw_rows = reference.loc[reference["canonical_player_id"] == "player:kenneth_walker:RB"]

    assert len(dj_rows) == 2
    assert len(kw_rows) == 2
```

### `packages/data/__init__.py`

```text
"""Data package for ingestion, normalization, and validation."""
```

### `packages/shared/__init__.py`

```text
"""Shared utilities."""
```

## Fantasy Domain Logic Files

### `packages/data/ingest/adp.py`

```text
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
from packages.data.player_ids import attach_canonical_ids_pandas
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "canonical_player_id",
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

    normalized["player_name"] = normalized["player_name"].astyp

[TRUNCATED]
```

### `packages/data/player_ids.py`

```text
from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

import pandas as pd
import polars as pl

from packages.data.validation import assert_unique_key, require_columns

CANONICAL_ID_COLUMN = "canonical_player_id"
NORMALIZED_NAME_COLUMN = "normalized_player_name"
ENTITY_TYPE_COLUMN = "entity_type"

PLAYER_ENTITY = "player"
DST_ENTITY = "dst"

POSITION_NORMALIZATION_MAP: dict[str, str] = {
    "QB": "QB",
    "RB": "RB",
    "WR": "WR",
    "TE": "TE",
    "K": "K",
    "DST": "DST",
    "DEF": "DST",
    "D/ST": "DST",
}

_SUFFIX_PATTERN = re.compile(r"\b(jr|sr|ii|iii|iv|v)\b", flags=re.IGNORECASE)
_MULTI_SPACE_PATTERN = re.compile(r"\s+")
_NON_WORD_SPACE_HYPHEN_SLASH_PATTERN = re.compile(r"[^a-z0-9\s\-/]")
_DST_TOKEN_PATTERN = re.compile(r"\b(?:d\s*/\s*st|dst|defense|def)\b", flags=re.IGNORECASE)

DST_ALIAS_MAP: dict[str, str] = {
    "arizona cardinals": "arizona_cardinals",
    "atlanta falcons": "atlanta_falcons",
    "baltimore ravens": "baltimore_ravens",
    "buffalo bills": "buffalo_bills",
    "carolina panthers": "carolina_panthers",
    "chicago bears": "chicago_bears",
    "cincinnati bengals": "cincinnati_bengals",
    "cleveland browns": "cleveland_browns",
    "dallas cowboys": "dallas_cowboys",
    "denver broncos": "denver_broncos",
    "detroit lions": "detroit_lions",
    "green bay packers": "green_bay_packers",
    "houston texans": "houston_texans",
    "indianapolis colts": "indianapolis_colts",
    "jacksonville jaguars": "jacksonville_jaguars",
    "kansas city chiefs": "kansas_city_chiefs",
    "las vegas raiders": "las_vegas_raiders",
    "los angeles chargers": "los_angeles_chargers",
    "los angeles rams": "los_angeles_rams",
    "miami dolphins": "miami_dolphins",
    "minnesota vikings": "minnesota_vikings",
    "new england patriots": "new_england_patriots",
    "new orleans saints": "new_orleans_saints",
    "new york giants": "new_york_giants",
    "new york jets": "new_york_jets",
    "philadelphia eagles": "philadelphia_eagles",
    "pittsburgh steelers": "pittsburgh_steelers",
    "san francisco 49ers": "san_francisco_49ers",
    "seattle seahawks": "seattle_seahawks",
    "tampa bay buccaneers": "tampa_bay_buccaneers",
    "tennessee titans": "tennessee_titans",
    "washington commanders": "washington_commanders",
}

DST_ABBR_MAP: dict[str, str] = {
    "ARI": "arizona_cardinals",
    "ATL": "atlanta_falcons",
    "BAL": "baltimore_ravens",
    "BUF": "buffalo_bills",
    "CAR": "carolina_panthers",
    "CHI": "chicago_bears",
    "CIN": "cincinnati_bengals",
    "CLE": "cleveland_browns",
    "DAL": "dallas_cowboys",
    "DEN": "denver_broncos",
    "DET": "detroit_lions",
    "GB": "green_bay_packers",
    "HOU": "houston_texans",
    "IND": "indianapolis_colts",
    "JAX": "jacksonville_jaguars",
    "KC": "kansas_city_chiefs",
    "LV": "las_vegas_raiders",
    "LAC": "los_angeles_chargers",
    "LAR": "los_angeles_rams",
    "MIA": "miami_dolphins",
    "MIN": "minnesota_vikings",
    "NE": "new_england_patriots",
    "NO": "new_orleans_saints",
    "NYG": "new_york_giants",
    "NYJ": "new_york_jets",
    "PHI": "philadelphia_eagles",
    "PIT": "pittsburgh_steelers",
    "SF": "san_francisco_49ers",
    "SEA": "seattle_seahawks",
    "TB": "tampa_bay_buccaneers",
    "TEN": "tennessee_titans",
    "WAS": "washington_commanders",
}


def normalize_position(value: object) -> str:
    text = str(value).strip().upper()
    return POSITION_NORMALIZA

[TRUNCATED]
```

### `scripts/build_player_reference.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
```

### `scripts/ingest_adp.py`

```text
from __future__ import annotations

import argparse
from pathlib import Path

from packages.data.constants import (
    DEFAULT_PILOT_YEARS,
    INTERMEDIATE_DATA_DIR,
    RAW_DATA_DIR,
)
from packages.data.ingest.adp import (
    DEFAULT_SOURCE_URLS,
    AdpIngestConfig,
    ingest_historical_adp,
)
from packages.shared.logging import get_logger

logger = get_logger(__name__)

DEFAULT_RAW_DIR = Path(RAW_DATA_DIR)
DEFAULT_INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest historical fantasy football ADP data")
    parser.add_argument(
        "--years",
        nargs="+",
        type=int,
        default=DEFAULT_PILOT_YEARS,
        help="Season years to ingest, e.g. --years 2023 2024",
    )
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=DEFAULT_RAW_DIR,
        help="Directory for raw HTML snapshots",
    )
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=DEFAULT_INTERMEDIATE_DIR,
        help="Directory for normalized parquet outputs",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    source_urls = {year: DEFAULT_SOURCE_URLS[year] for year in args.years}

    config = AdpIngestConfig(
        years=args.years,
        raw_dir=args.raw_dir,
        intermediate_dir=args.intermediate_dir,
        source_urls=source_urls,
    )

    logger.info("Ingesting historical ADP for seasons=%s", args.years)
    df = ingest_historical_adp(config)
    logger.info(
        "ADP ingest complete: rows=%s cols=%s years=%s-%s",
        len(df),
        len(df.columns),
        min(args.years),
        max(args.years),
    )


if __name__ == "__main__":
    main()
```

### `tests/data/ingest/test_adp.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from packages.data.ingest.adp import (
    REQUIRED_OUTPUT_COLUMNS,
    UNIQUE_KEY_COLUMNS,
    AdpIngestConfig,
    ingest_historical_adp,
    normalize_historical_adp,
)
from packages.data.validation import ValidationError


@pytest.fixture
def fantasypros_html_2023() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Christian McCaffrey SF (9)</td><td>RB1</td><td>1.2</td></tr>
            <tr><td>2</td><td>Tyreek Hill MIA (10)</td><td>WR1</td><td>4.8</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


@pytest.fixture
def fantasypros_html_2024() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>CeeDee Lamb DAL (7)</td><td>WR1</td><td>2.1</td></tr>
            <tr><td>2</td><td>Breece Hall NYJ (12)</td><td>RB2</td><td>5.0</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


def test_normalize_historical_adp_requires_expected_columns() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)"],
            "POS": ["WR1"],
            "AVG": [2.1],
            "source_name": ["fantasypros"],
        }
    )

    normalized = normalize_historical_adp(raw)

    assert list(normalized.columns) == REQUIRED_OUTPUT_COLUMNS
    assert normalized.iloc[0]["player_name"] == "CeeDee Lamb"
    assert normalized.iloc[0]["position"] == "WR"


def test_normalize_historical_adp_rejects_duplicate_keys() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024, 2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)", "CeeDee Lamb DAL (7)"],
            "POS": ["WR1", "WR1"],
            "AVG": [2.1, 2.1],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    with pytest.raises(ValidationError, match="duplicate rows"):
        normalize_historical_adp(raw)


def test_ingest_historical_adp_writes_raw_and_intermediate_outputs(
    monkeypatch,
    tmp_path: Path,
    fantasypros_html_2023: str,
    fantasypros_html_2024: str,
) -> None:
    from packages.data.ingest import adp as adp_module

    html_by_url = {
        "https://example.test/2023": fantasypros_html_2023,
        "https://example.test/2024": fantasypros_html_2024,
    }

    def fake_fetch_html(url: str) -> str:
        return html_by_url[url]

    monkeypatch.setattr(adp_module, "_fetch_html", fake_fetch_html)

    config = AdpIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
        source_urls={
            2023: "https://example.test/2023",
            2024: "https://example.test/2024",
        },
    )

    df = ingest_historical_adp(config)

    assert list(df.columns) == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().tolist()) == [2023, 2024]
    assert UNIQUE_KEY_COLUMNS == ["season", "canonical_player_id", "source_name"]

[TRUNCATED]
```

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "RB"],
            "source_name": ["nflverse", "nflverse"],
        }
    )

    reference = build_player_reference_table([adp, nflverse])

    dj_rows = reference.loc[reference["canonical_player_id"] == "player:dj_moore:WR"]
    kw_rows = reference.loc[reference["canonical_player_id"] == "player:kenneth_walker:RB"]

    assert len(dj_rows) == 2
    assert len(kw_rows) == 2
```

## Data Pipeline and Ingestion Files

### `packages/data/ingest/__init__.py`

```text
"""Data ingestion modules."""
```

### `packages/data/ingest/adp.py`

```text
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
from packages.data.player_ids import attach_canonical_ids_pandas
from packages.data.validation import assert_unique_key, require_columns

REQUIRED_OUTPUT_COLUMNS: Final[list[str]] = [
    "season",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "position",
    "adp_overall",
    "source_name",
]

UNIQUE_KEY_COLUMNS: Final[list[str]] = [
    "season",
    "canonical_player_id",
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

    normalized["player_name"] = normalized["player_name"].astyp

[TRUNCATED]
```

### `packages/data/ingest/coaching.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_coaching_history() -> pd.DataFrame:
    """
    Placeholder coaching history extractor.

    MVP may begin with a manually maintained table.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "team": "EX",
                "head_coach": "Example HC",
                "offensive_coordinator": "Example OC",
            }
        ]
    )
```

### `packages/data/ingest/nflverse.py`

```text
from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

import nflreadpy as nfl
import polars as pl

from packages.data.player_ids import attach_canonical_ids_polars

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "normalized_player_name",
    "entity_type",
    "canonical_player_id",
    "team",
    "position",
    "fantasy_points",
    "source_name",
]

TEAM_COLUMN_CANDIDATES = [
    "recent_team",
    "team",
    "team_abbr",
    "posteam",
]

PLAYER_NAME_CANDIDATES = [
    "player_display_name",
    "player_name",
]

FANTASY_POINTS_CANDIDATES = [
    "fantasy_points",
    "fantasy_points_ppr",
]

SOURCE_NAME = "nflverse"


@dataclass(frozen=True)
class NflverseIngestConfig:
    years: Sequence[int]
    raw_dir: Path
    intermediate_dir: Path


def _first_existing_column(df: pl.DataFrame, candidates: Sequence[str]) -> str:
    for column in candidates:
        if column in df.columns:
            return column
    raise ValueError(f"None of the candidate columns exist: {candidates}")


def _normalize_weekly_player_stats(df: pl.DataFrame) -> pl.DataFrame:
    player_name_col = _first_existing_column(df, PLAYER_NAME_CANDIDATES)
    team_col = _first_existing_column(df, TEAM_COLUMN_CANDIDATES)
    fantasy_points_col = _first_existing_column(df, FANTASY_POINTS_CANDIDATES)

    required_source_columns = {
        "season",
        "week",
        player_name_col,
        team_col,
        "position",
        fantasy_points_col,
    }
    missing = required_source_columns.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required source columns: {sorted(missing)}")

    normalized = (
        df.select(
            [
                pl.col("season").cast(pl.Int64),
                pl.col("week").cast(pl.Int64),
                pl.col(player_name_col).alias("player_name").cast(pl.Utf8),
                pl.col(team_col).alias("team").cast(pl.Utf8),
                pl.col("position").cast(pl.Utf8),
                pl.col(fantasy_points_col).alias("fantasy_points").cast(pl.Float64),
            ]
        )
        .filter(
            pl.col("season").is_not_null()
            & pl.col("week").is_not_null()
            & pl.col("player_name").is_not_null()
        )
        .with_columns(
            [
                pl.col("player_name").str.strip_chars(),
                pl.col("team").str.strip_chars(),
                pl.col("position").str.strip_chars(),
                pl.lit(SOURCE_NAME).alias("source_name"),
            ]
        )
    )

    normalized = attach_canonical_ids_polars(normalized)
    normalized = normalized.select(REQUIRED_OUTPUT_COLUMNS)
    normalized = normalized.sort(["season", "week", "canonical_player_id"])

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_

[TRUNCATED]
```

### `tests/data/ingest/test_adp.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from packages.data.ingest.adp import (
    REQUIRED_OUTPUT_COLUMNS,
    UNIQUE_KEY_COLUMNS,
    AdpIngestConfig,
    ingest_historical_adp,
    normalize_historical_adp,
)
from packages.data.validation import ValidationError


@pytest.fixture
def fantasypros_html_2023() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Christian McCaffrey SF (9)</td><td>RB1</td><td>1.2</td></tr>
            <tr><td>2</td><td>Tyreek Hill MIA (10)</td><td>WR1</td><td>4.8</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


@pytest.fixture
def fantasypros_html_2024() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>CeeDee Lamb DAL (7)</td><td>WR1</td><td>2.1</td></tr>
            <tr><td>2</td><td>Breece Hall NYJ (12)</td><td>RB2</td><td>5.0</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


def test_normalize_historical_adp_requires_expected_columns() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)"],
            "POS": ["WR1"],
            "AVG": [2.1],
            "source_name": ["fantasypros"],
        }
    )

    normalized = normalize_historical_adp(raw)

    assert list(normalized.columns) == REQUIRED_OUTPUT_COLUMNS
    assert normalized.iloc[0]["player_name"] == "CeeDee Lamb"
    assert normalized.iloc[0]["position"] == "WR"


def test_normalize_historical_adp_rejects_duplicate_keys() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024, 2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)", "CeeDee Lamb DAL (7)"],
            "POS": ["WR1", "WR1"],
            "AVG": [2.1, 2.1],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    with pytest.raises(ValidationError, match="duplicate rows"):
        normalize_historical_adp(raw)


def test_ingest_historical_adp_writes_raw_and_intermediate_outputs(
    monkeypatch,
    tmp_path: Path,
    fantasypros_html_2023: str,
    fantasypros_html_2024: str,
) -> None:
    from packages.data.ingest import adp as adp_module

    html_by_url = {
        "https://example.test/2023": fantasypros_html_2023,
        "https://example.test/2024": fantasypros_html_2024,
    }

    def fake_fetch_html(url: str) -> str:
        return html_by_url[url]

    monkeypatch.setattr(adp_module, "_fetch_html", fake_fetch_html)

    config = AdpIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
        source_urls={
            2023: "https://example.test/2023",
            2024: "https://example.test/2024",
        },
    )

    df = ingest_historical_adp(config)

    assert list(df.columns) == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().tolist()) == [2023, 2024]
    assert UNIQUE_KEY_COLUMNS == ["season", "canonical_player_id", "source_name"]

[TRUNCATED]
```

### `tests/data/ingest/test_nflverse.py`

```text
from __future__ import annotations

from pathlib import Path

import polars as pl
import pytest

from packages.data.ingest.nflverse import (
    REQUIRED_OUTPUT_COLUMNS,
    NflverseIngestConfig,
    ingest_nflverse_weekly_players,
)


@pytest.fixture
def sample_raw_df() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2023, 2023, 2024],
            "week": [1, 2, 1],
            "player_display_name": ["Christian McCaffrey", "Tyreek Hill", "Josh Allen"],
            "recent_team": ["SF", "MIA", "BUF"],
            "position": ["RB", "WR", "QB"],
            "fantasy_points": [24.6, 31.2, 27.8],
            "extra_col": [1, 2, 3],
        }
    )


def test_ingest_nflverse_weekly_players_writes_outputs(
    monkeypatch,
    tmp_path: Path,
    sample_raw_df: pl.DataFrame,
) -> None:

    from packages.data.ingest import nflverse as nflverse_module

    def fake_load_player_stats(seasons, summary_level):
        assert seasons == [2023, 2024]
        assert summary_level == "week"
        return sample_raw_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    df = ingest_nflverse_weekly_players(config)

    assert df.height == 3
    assert df.columns == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().to_list()) == [2023, 2024]

    raw_files = list((tmp_path / "raw").glob("*.parquet"))
    intermediate_files = list((tmp_path / "intermediate").glob("*.parquet"))

    assert len(raw_files) == 1
    assert len(intermediate_files) == 1


def test_ingest_requires_expected_columns(monkeypatch, tmp_path: Path) -> None:
    from packages.data.ingest import nflverse as nflverse_module

    bad_df = pl.DataFrame(
        {
            "season": [2023],
            "week": [1],
            "position": ["RB"],
        }
    )

    def fake_load_player_stats(seasons, summary_level):
        return bad_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    with pytest.raises(ValueError):
        ingest_nflverse_weekly_players(config)
```

### `packages/data/__init__.py`

```text
"""Data package for ingestion, normalization, and validation."""
```

### `packages/data/constants.py`

```text
"""Project-wide constants."""

RAW_DATA_DIR = "data/raw"
INTERMEDIATE_DATA_DIR = "data/intermediate"
PROCESSED_DATA_DIR = "data/processed"

DEFAULT_PILOT_YEARS = [2023, 2024]
VALID_POSITIONS = {"QB", "RB", "WR", "TE", "K", "DST"}
```

### `packages/data/io.py`

```text
from pathlib import Path

import pandas as pd


def ensure_parent_dir(path: str | Path) -> Path:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return output_path


def write_parquet(df: pd.DataFrame, path: str | Path) -> None:
    output_path = ensure_parent_dir(path)
    df.to_parquet(output_path, index=False)


def read_parquet(path: str | Path) -> pd.DataFrame:
    return pd.read_parquet(path)
```

### `packages/data/player_ids.py`

```text
from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

import pandas as pd
import polars as pl

from packages.data.validation import assert_unique_key, require_columns

CANONICAL_ID_COLUMN = "canonical_player_id"
NORMALIZED_NAME_COLUMN = "normalized_player_name"
ENTITY_TYPE_COLUMN = "entity_type"

PLAYER_ENTITY = "player"
DST_ENTITY = "dst"

POSITION_NORMALIZATION_MAP: dict[str, str] = {
    "QB": "QB",
    "RB": "RB",
    "WR": "WR",
    "TE": "TE",
    "K": "K",
    "DST": "DST",
    "DEF": "DST",
    "D/ST": "DST",
}

_SUFFIX_PATTERN = re.compile(r"\b(jr|sr|ii|iii|iv|v)\b", flags=re.IGNORECASE)
_MULTI_SPACE_PATTERN = re.compile(r"\s+")
_NON_WORD_SPACE_HYPHEN_SLASH_PATTERN = re.compile(r"[^a-z0-9\s\-/]")
_DST_TOKEN_PATTERN = re.compile(r"\b(?:d\s*/\s*st|dst|defense|def)\b", flags=re.IGNORECASE)

DST_ALIAS_MAP: dict[str, str] = {
    "arizona cardinals": "arizona_cardinals",
    "atlanta falcons": "atlanta_falcons",
    "baltimore ravens": "baltimore_ravens",
    "buffalo bills": "buffalo_bills",
    "carolina panthers": "carolina_panthers",
    "chicago bears": "chicago_bears",
    "cincinnati bengals": "cincinnati_bengals",
    "cleveland browns": "cleveland_browns",
    "dallas cowboys": "dallas_cowboys",
    "denver broncos": "denver_broncos",
    "detroit lions": "detroit_lions",
    "green bay packers": "green_bay_packers",
    "houston texans": "houston_texans",
    "indianapolis colts": "indianapolis_colts",
    "jacksonville jaguars": "jacksonville_jaguars",
    "kansas city chiefs": "kansas_city_chiefs",
    "las vegas raiders": "las_vegas_raiders",
    "los angeles chargers": "los_angeles_chargers",
    "los angeles rams": "los_angeles_rams",
    "miami dolphins": "miami_dolphins",
    "minnesota vikings": "minnesota_vikings",
    "new england patriots": "new_england_patriots",
    "new orleans saints": "new_orleans_saints",
    "new york giants": "new_york_giants",
    "new york jets": "new_york_jets",
    "philadelphia eagles": "philadelphia_eagles",
    "pittsburgh steelers": "pittsburgh_steelers",
    "san francisco 49ers": "san_francisco_49ers",
    "seattle seahawks": "seattle_seahawks",
    "tampa bay buccaneers": "tampa_bay_buccaneers",
    "tennessee titans": "tennessee_titans",
    "washington commanders": "washington_commanders",
}

DST_ABBR_MAP: dict[str, str] = {
    "ARI": "arizona_cardinals",
    "ATL": "atlanta_falcons",
    "BAL": "baltimore_ravens",
    "BUF": "buffalo_bills",
    "CAR": "carolina_panthers",
    "CHI": "chicago_bears",
    "CIN": "cincinnati_bengals",
    "CLE": "cleveland_browns",
    "DAL": "dallas_cowboys",
    "DEN": "denver_broncos",
    "DET": "detroit_lions",
    "GB": "green_bay_packers",
    "HOU": "houston_texans",
    "IND": "indianapolis_colts",
    "JAX": "jacksonville_jaguars",
    "KC": "kansas_city_chiefs",
    "LV": "las_vegas_raiders",
    "LAC": "los_angeles_chargers",
    "LAR": "los_angeles_rams",
    "MIA": "miami_dolphins",
    "MIN": "minnesota_vikings",
    "NE": "new_england_patriots",
    "NO": "new_orleans_saints",
    "NYG": "new_york_giants",
    "NYJ": "new_york_jets",
    "PHI": "philadelphia_eagles",
    "PIT": "pittsburgh_steelers",
    "SF": "san_francisco_49ers",
    "SEA": "seattle_seahawks",
    "TB": "tampa_bay_buccaneers",
    "TEN": "tennessee_titans",
    "WAS": "washington_commanders",
}


def normalize_position(value: object) -> str:
    text = str(value).strip().upper()
    return POSITION_NORMALIZA

[TRUNCATED]
```

### `packages/data/validation.py`

```text
from collections.abc import Sequence

import pandas as pd


class ValidationError(Exception):
    """Raised when a data validation check fails."""


def require_columns(df: pd.DataFrame, required_columns: Sequence[str]) -> None:
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValidationError(f"Missing required columns: {missing}")


def assert_unique_key(df: pd.DataFrame, key_columns: Sequence[str]) -> None:
    duplicates = df.duplicated(subset=list(key_columns), keep=False)
    if duplicates.any():
        dup_count = int(duplicates.sum())
        raise ValidationError(
            f"Found {dup_count} duplicate rows for key columns: {list(key_columns)}"
        )
```

### `scripts/build_player_reference.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
```

## Testing and Quality Signals

### `tests/test_smoke.py`

```text
from packages.data.ingest.adp import fetch_historical_adp
from packages.data.ingest.nflverse import fetch_weekly_player_data


def test_fetch_historical_adp_returns_dataframe() -> None:
    df = fetch_historical_adp()
    assert not df.empty


def test_fetch_weekly_player_data_returns_dataframe() -> None:
    df = fetch_weekly_player_data([2024])
    assert not df.is_empty()
```

### `tests/test_validation.py`

```text
import pandas as pd
import pytest

from packages.data.validation import ValidationError, assert_unique_key, require_columns


def test_require_columns_passes_when_columns_exist() -> None:
    df = pd.DataFrame({"a": [1], "b": [2]})
    require_columns(df, ["a", "b"])


def test_require_columns_raises_when_missing_columns() -> None:
    df = pd.DataFrame({"a": [1]})
    with pytest.raises(ValidationError):
        require_columns(df, ["a", "b"])


def test_assert_unique_key_raises_on_duplicates() -> None:
    df = pd.DataFrame({"season": [2024, 2024], "player": ["x", "x"]})
    with pytest.raises(ValidationError):
        assert_unique_key(df, ["season", "player"])
```

### `tests/data/ingest/test_adp.py`

```text
from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from packages.data.ingest.adp import (
    REQUIRED_OUTPUT_COLUMNS,
    UNIQUE_KEY_COLUMNS,
    AdpIngestConfig,
    ingest_historical_adp,
    normalize_historical_adp,
)
from packages.data.validation import ValidationError


@pytest.fixture
def fantasypros_html_2023() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Christian McCaffrey SF (9)</td><td>RB1</td><td>1.2</td></tr>
            <tr><td>2</td><td>Tyreek Hill MIA (10)</td><td>WR1</td><td>4.8</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


@pytest.fixture
def fantasypros_html_2024() -> str:
    return """
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Team (Bye)</th>
              <th>POS</th>
              <th>AVG</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>CeeDee Lamb DAL (7)</td><td>WR1</td><td>2.1</td></tr>
            <tr><td>2</td><td>Breece Hall NYJ (12)</td><td>RB2</td><td>5.0</td></tr>
          </tbody>
        </table>
      </body>
    </html>
    """


def test_normalize_historical_adp_requires_expected_columns() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)"],
            "POS": ["WR1"],
            "AVG": [2.1],
            "source_name": ["fantasypros"],
        }
    )

    normalized = normalize_historical_adp(raw)

    assert list(normalized.columns) == REQUIRED_OUTPUT_COLUMNS
    assert normalized.iloc[0]["player_name"] == "CeeDee Lamb"
    assert normalized.iloc[0]["position"] == "WR"


def test_normalize_historical_adp_rejects_duplicate_keys() -> None:
    raw = pd.DataFrame(
        {
            "season": [2024, 2024],
            "Player Team (Bye)": ["CeeDee Lamb DAL (7)", "CeeDee Lamb DAL (7)"],
            "POS": ["WR1", "WR1"],
            "AVG": [2.1, 2.1],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    with pytest.raises(ValidationError, match="duplicate rows"):
        normalize_historical_adp(raw)


def test_ingest_historical_adp_writes_raw_and_in

[TRUNCATED]
```

### `tests/data/ingest/test_nflverse.py`

```text
from __future__ import annotations

from pathlib import Path

import polars as pl
import pytest

from packages.data.ingest.nflverse import (
    REQUIRED_OUTPUT_COLUMNS,
    NflverseIngestConfig,
    ingest_nflverse_weekly_players,
)


@pytest.fixture
def sample_raw_df() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "season": [2023, 2023, 2024],
            "week": [1, 2, 1],
            "player_display_name": ["Christian McCaffrey", "Tyreek Hill", "Josh Allen"],
            "recent_team": ["SF", "MIA", "BUF"],
            "position": ["RB", "WR", "QB"],
            "fantasy_points": [24.6, 31.2, 27.8],
            "extra_col": [1, 2, 3],
        }
    )


def test_ingest_nflverse_weekly_players_writes_outputs(
    monkeypatch,
    tmp_path: Path,
    sample_raw_df: pl.DataFrame,
) -> None:

    from packages.data.ingest import nflverse as nflverse_module

    def fake_load_player_stats(seasons, summary_level):
        assert seasons == [2023, 2024]
        assert summary_level == "week"
        return sample_raw_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    df = ingest_nflverse_weekly_players(config)

    assert df.height == 3
    assert df.columns == REQUIRED_OUTPUT_COLUMNS
    assert sorted(df["season"].unique().to_list()) == [2023, 2024]

    raw_files = list((tmp_path / "raw").glob("*.parquet"))
    intermediate_files = list((tmp_path / "intermediate").glob("*.parquet"))

    assert len(raw_files) == 1
    assert len(intermediate_files) == 1


def test_ingest_requires_expected_columns(monkeypatch, tmp_path: Path) -> None:
    from packages.data.ingest import nflverse as nflverse_module

    bad_df = pl.DataFrame(
        {
            "season": [2023],
            "week": [1],
            "position": ["RB"],
        }
    )

    def fake_load_player_stats(seasons, summary_level):
        return bad_df

    monkeypatch.setattr(nflverse_module.nfl, "load_player_stats", fake_load_player_stats)

    config = NflverseIngestConfig(
        years=[2023],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
    )

    with pytest.raises(ValueError):
        ingest_nflverse_weekly_players(config)
```

### `tests/data/test_player_ids.py`

```text
from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "

[TRUNCATED]
```

## Open Implementation Notes

Use this file as the primary project snapshot for ChatGPT. Prefer relying on:
1. project summary and docs for intent
2. root config files for setup and tooling
3. fantasy domain logic files for business rules
4. data pipeline files for source-of-truth data flow

If responses start feeling stale, regenerate this file and re-upload it to the Project.
