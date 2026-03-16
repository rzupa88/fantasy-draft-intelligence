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
