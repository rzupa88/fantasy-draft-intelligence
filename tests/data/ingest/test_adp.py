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
    assert UNIQUE_KEY_COLUMNS == ["season", "player_name", "position", "source_name"]

    raw_files = list((tmp_path / "raw").glob("*.html"))
    intermediate_files = list((tmp_path / "intermediate").glob("*.parquet"))

    assert len(raw_files) == 2
    assert len(intermediate_files) == 1


def test_ingest_historical_adp_fails_when_season_url_missing(tmp_path: Path) -> None:
    config = AdpIngestConfig(
        years=[2023, 2024],
        raw_dir=tmp_path / "raw",
        intermediate_dir=tmp_path / "intermediate",
        source_urls={2023: "https://example.test/2023"},
    )

    with pytest.raises(
        ValueError,
        match=r"No ADP source URL configured for seasons \[2024\]",
    ):
        ingest_historical_adp(config)