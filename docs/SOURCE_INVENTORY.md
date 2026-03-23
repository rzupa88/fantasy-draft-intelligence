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
