# Architecture Notes

This directory stores system design decisions, data flow structure, and architectural principles.

---

## Data Architecture Overview

The project follows a layered, reproducible data pipeline designed to support stable cross-source joins and downstream modeling.

### Pipeline Flow


raw source data
↓
normalized source tables (ADP, nflverse, etc.)
↓
canonical player ID enrichment
↓
player reference table (cross-source mapping)


---

## Core Components

### 1. Source Ingestion

Located in:

packages/data/ingest/


Responsibilities:
- extract data from external sources
- normalize schema into structured tables
- write outputs to `data/intermediate/`

---

### 2. Canonical Player ID Layer

Located in:

packages/data/player_ids.py


Responsibilities:
- normalize player names across sources
- generate a stable `canonical_player_id`
- handle:
  - suffixes (Jr., Sr., III)
  - punctuation (D.J. vs DJ)
  - casing and whitespace
  - DST naming inconsistencies

---

### 3. Player Reference Table

Built via:

scripts/build_player_reference.py


Output:

data/intermediate/player_reference_<years>.parquet


Responsibilities:
- unify player identities across sources
- enable consistent joins between datasets
- act as a foundational lookup table

---

## Design Decisions

### Canonical IDs as Join Key

All joins across datasets must use:


canonical_player_id


**Reason:**
Raw `player_name` fields are inconsistent across sources and will lead to:
- broken joins
- duplicate entities
- incorrect modeling inputs

---

### Code-First Data Logic

- All normalization and ID logic lives in `packages/data/`
- Notebooks are for exploration only
- Ensures reproducibility and testability

---

### Intermediate Data = Source of Truth

- All normalized datasets are stored in `data/intermediate/`
- Format: Parquet
- These serve as the foundation for:
  - feature engineering
  - modeling
  - validation

---

## Next Architecture Steps

- Introduce alias resolution layer (nicknames, edge cases)
- Add additional data sources (injuries, depth charts)
- Build feature engineering pipeline
- Introduce modeling layer with versioned outputs  