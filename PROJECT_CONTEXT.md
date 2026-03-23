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
│   │   └── validation.py
│   ├── modeling
│   │   ├── __init__.py
│   │   └── baseline.py
│   └── shared
│       ├── __init__.py
│       └── logging.py
├── scripts
│   ├── bootstrap.py
│   ├── ingest_adp.py
│   ├── ingest_nflverse.py
│   └── validate_data.py
├── tests
│   ├── data
│   │   └── ingest
│   │       └── test_nflverse.py
│   ├── test_smoke.py
│   └── test_validation.py
├── tools
│   └── build_project_context.py
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
- overall and positional draft cost

**Access method:**
- careful scrape / controlled extract

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

import pandas as pd


def fetch_historical_adp() -> pd.DataFrame:
    """
    Placeholder ADP ingestion function.

    Replace with careful historical ADP extraction logic.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "player_name": "example_player",
                "position": "RB",
                "adp_overall": 42.5,
                "source_name": "example_source",
            }
        ]
    )
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

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "team",
    "position",
    "fantasy_points",
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
            ]
        )
        .sort(["season", "week", "player_name"])
    )

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    """Backward-compatible wrapper for legacy callers/tests."""
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    # nflreadpy load_player_stats() returns a Polars DataFrame and supports
    # week/reg/post/reg+post summary levels.
    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_pandas(raw)

    return raw


def write_partitioned_snapshots(
    raw_df: pl.DataFrame,
    normalized_df: pl.DataFrame,
    config: NflverseIngestConfig,
) -> None:
    config.raw_dir.mkdir(parents=True,

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
VALID_POSITIONS = {"QB", "RB", "WR", "TE"}
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

### `packages/shared/__init__.py`

```text
"""Shared utilities."""
```

## Fantasy Domain Logic Files

### `packages/data/ingest/adp.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_historical_adp() -> pd.DataFrame:
    """
    Placeholder ADP ingestion function.

    Replace with careful historical ADP extraction logic.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "player_name": "example_player",
                "position": "RB",
                "adp_overall": 42.5,
                "source_name": "example_source",
            }
        ]
    )
```

### `scripts/ingest_adp.py`

```text
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
```

## Data Pipeline and Ingestion Files

### `packages/data/ingest/__init__.py`

```text
"""Data ingestion modules."""
```

### `packages/data/ingest/adp.py`

```text
from __future__ import annotations

import pandas as pd


def fetch_historical_adp() -> pd.DataFrame:
    """
    Placeholder ADP ingestion function.

    Replace with careful historical ADP extraction logic.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "player_name": "example_player",
                "position": "RB",
                "adp_overall": 42.5,
                "source_name": "example_source",
            }
        ]
    )
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

REQUIRED_OUTPUT_COLUMNS = [
    "season",
    "week",
    "player_name",
    "team",
    "position",
    "fantasy_points",
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
            ]
        )
        .sort(["season", "week", "player_name"])
    )

    missing_output = [col for col in REQUIRED_OUTPUT_COLUMNS if col not in normalized.columns]
    if missing_output:
        raise ValueError(f"Normalized output missing required columns: {missing_output}")

    return normalized


def fetch_weekly_player_data(years: Iterable[int]) -> pl.DataFrame:
    """Backward-compatible wrapper for legacy callers/tests."""
    return load_weekly_player_stats(years)


def load_weekly_player_stats(years: Iterable[int]) -> pl.DataFrame:
    years = sorted({int(year) for year in years})
    if not years:
        raise ValueError("At least one year must be provided")

    # nflreadpy load_player_stats() returns a Polars DataFrame and supports
    # week/reg/post/reg+post summary levels.
    raw = nfl.load_player_stats(seasons=years, summary_level="week")
    if not isinstance(raw, pl.DataFrame):
        raw = pl.from_pandas(raw)

    return raw


def write_partitioned_snapshots(
    raw_df: pl.DataFrame,
    normalized_df: pl.DataFrame,
    config: NflverseIngestConfig,
) -> None:
    config.raw_dir.mkdir(parents=True,

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
VALID_POSITIONS = {"QB", "RB", "WR", "TE"}
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

### `scripts/ingest_adp.py`

```text
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

## Open Implementation Notes

Use this file as the primary project snapshot for ChatGPT. Prefer relying on:
1. project summary and docs for intent
2. root config files for setup and tooling
3. fantasy domain logic files for business rules
4. data pipeline files for source-of-truth data flow

If responses start feeling stale, regenerate this file and re-upload it to the Project.
