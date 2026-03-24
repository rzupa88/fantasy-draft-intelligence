# Source Inventory

## Purpose
This document tracks every external data source used by the project and how each source is normalized into the data warehouse.

---

## Guiding Rules

- Prefer free and reproducible sources
- Minimize scraping surface area
- Snapshot volatile data where practical
- Document provenance for every dataset
- Normalize all sources into a common schema with canonical IDs

---

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
- Python package / supported data access workflows

**Priority:** Primary

**Output location:**

data/intermediate/nflverse_player_weekly_<years>.parquet


**Normalized fields (key subset):**
- season
- player_name
- position
- team
- stats fields (yards, TDs, etc.)
- **normalized_player_name**
- **canonical_player_id**
- source_name

---

### 2. FantasyPros

**Use for:**
- historical ADP
- market pricing baseline

**Access method:**
- controlled extraction from season-specific ADP pages
- explicit URL manifest by season
- raw HTML snapshots stored locally

**Raw storage:**

data/raw/adp_fantasypros_<season>_overall.html


**Output location:**

data/intermediate/adp_historical_<years>.parquet


**Current provenance:**
- FantasyPros NFL historical overall ADP (2023, 2024)

**Normalized fields:**
- season
- player_name
- position
- adp_overall
- source_name
- **normalized_player_name**
- **entity_type** (player / DST)
- **canonical_player_id**

---

### 3. Pro-Football-Reference

**Use for:**
- coaching history
- team-level reference data
- fallback validation

**Access method:**
- targeted scrape or manual ingestion

**Priority:** Secondary

---

## Derived Artifacts

### Player Reference Table

**Location:**

data/intermediate/player_reference_<years>.parquet


**Purpose:**
- provides a unified mapping of players across all sources
- enables stable joins between datasets

**Built from:**
- normalized nflverse output
- normalized ADP output

**Key fields:**
- canonical_player_id
- normalized_player_name
- source_name
- source_player_name

---

## Join Standard (Critical)

> All cross-source joins must use `canonical_player_id`.

Raw `player_name` values are not reliable due to:
- suffix differences (Jr., Sr., III)
- punctuation (D.J. vs DJ)
- spacing / casing inconsistencies
- DST naming differences

---

## Datasets Required for MVP

- weekly player stats
- season-level stats
- snap counts
- rosters
- ADP
- coaching history
- team context

---

## Open Questions

- ADP historical depth across more seasons
- alias handling (nicknames, alternate spellings)
- DST normalization edge cases
- whether coaching data should be fully manual for MVP