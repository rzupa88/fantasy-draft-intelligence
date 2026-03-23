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
