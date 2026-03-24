# Fantasy Draft Intelligence

A Git-first fantasy football draft intelligence platform built in GitHub Codespaces.

## Purpose

This project aims to identify when the fantasy football market is mispricing players relative to expected outcomes.

The product is built around four layers:

1. **Data collection and normalization**
2. **Feature engineering and research**
3. **Predictive modeling and value scoring**
4. **Draft decision support**

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

## Data Architecture (M1 Foundation)

The project uses a layered data pipeline designed for reproducibility and stable cross-source joins.

### Pipeline Flow

```text
raw source data
↓
normalized source tables (ADP, nflverse, etc.)
↓
canonical player ID enrichment
↓
player reference table (cross-source mapping)
```

### Key Concepts

**Canonical Player ID**
- Stable identifier used across all datasets
- Generated via normalization logic in `packages/data/player_ids.py`
- Handles:
  - suffixes (Jr., Sr., III)
  - punctuation
  - casing / whitespace
  - common naming inconsistencies
  - DST naming standardization

**Player Reference Table**
- Located at:

```text
data/intermediate/player_reference_<years>.parquet
```

- Built from all normalized sources
- Serves as the **join layer across datasets**

**Join Rule (Important)**
> All cross-source joins should use `canonical_player_id`, not raw `player_name`.

## Current Data Outputs

After running ingestion + reference build:

```text
data/intermediate/
├── adp_historical_2023_2024.parquet
├── nflverse_player_weekly_2023_2024.parquet
└── player_reference_2023_2024.parquet
```

## Initial Milestone

### **M1: Core Historical Warehouse for Pilot Seasons**

This milestone includes:

- repo setup
- Codespaces environment
- source inventory
- nflverse ingestion
- ADP ingestion
- canonical player ID layer
- player reference mapping
- data validation and tests

## Quick Start

### 1. Open in Codespaces

Open the repository in GitHub Codespaces.

### 2. Install dependencies

This should happen automatically in the devcontainer. If needed:

```bash
pip install -e .[dev]
```

### 3. Run Data Pipeline

#### Ingest ADP

```bash
python scripts/ingest_adp.py
```

#### Ingest nflverse

```bash
python scripts/ingest_nflverse.py
```

#### Build Player Reference Table

```bash
python scripts/build_player_reference.py
```

### 4. Run Tests

```bash
pytest
```

## Project Structure

```text
packages/
  data/
    ingest/              # source ingestion (ADP, nflverse)
    player_ids.py        # canonical ID logic
    io.py                # read/write utilities
    validation.py        # data validation helpers

scripts/
  ingest_*.py            # ingestion entrypoints
  build_player_reference.py

data/
  raw/                   # source snapshots
  intermediate/          # normalized + canonical outputs

tests/
  data/                  # ingestion + ID tests
```

## Development Notes

- Canonical ID logic is **code-first**, not notebook-based
- All intermediate datasets are written as **Parquet**
- Validation includes:
  - required columns
  - uniqueness constraints
- Tests cover:
  - normalization edge cases
  - cross-source join stability

## Next Steps

- Expand player identity resolution (aliases, edge cases)
- Add additional data sources (injuries, depth charts, projections)
- Build feature engineering layer
- Develop baseline predictive models
- Implement draft decision engine
