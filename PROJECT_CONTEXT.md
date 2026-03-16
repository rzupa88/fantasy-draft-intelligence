# Fantasy Draft Intelligence — Project Context

This file is auto-generated from the repository to give ChatGPT Projects a compact view of the repo.

## README

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
├── fantasy_draft_intelligence.egg-info
│   ├── dependency_links.txt
│   ├── PKG-INFO
│   ├── requires.txt
│   ├── SOURCES.txt
│   └── top_level.txt
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
│   ├── test_smoke.py
│   └── test_validation.py
├── tools
│   └── build_project_context.py
├── Makefile
├── pyproject.toml
└── README.md
```

## Documentation

### `docs/MASTER_PROJECT_PLAN.md`



### `docs/SOURCE_INVENTORY.md`

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


### `docs/adr/0000-adr-template.md`

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


### `docs/architecture/README.md`

# Architecture Notes

This directory stores architecture diagrams, decisions, and system design notes.

Suggested future contents:
- system context diagram
- data flow diagram
- storage design notes
- model lifecycle notes
- app architecture notes


### `docs/research/README.md`

# Research Notes

This directory stores research summaries that translate exploratory analysis into product and modeling decisions.

Each research note should include:
- question
- data used
- method
- findings
- limitations
- implications


### `docs/runbooks/README.md`

# Runbooks

This directory stores step-by-step operational procedures.

Suggested future runbooks:
- historical backfill runbook
- preseason refresh runbook
- model training runbook
- release checklist

## Build and Dependency Files

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
  "rich>=13.7.1"
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

## Important Source Files

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

import pandas as pd



def fetch_weekly_player_data(years: list[int]) -> pd.DataFrame:
    """
    Placeholder ingestion function.

    Replace this with the actual nflverse / supported data access logic.
    The purpose right now is to establish the contract and repo structure.
    """
    rows: list[dict] = []
    for year in years:
        rows.append(
            {
                "season": year,
                "player_name": "example_player",
                "position": "RB",
                "team": "EX",
                "week": 1,
                "fantasy_points": 10.0,
            }
        )
    return pd.DataFrame(rows)
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

### `packages/modeling/__init__.py`

```text
"""Modeling package."""
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

### `packages/shared/__init__.py`

```text
"""Shared utilities."""
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
