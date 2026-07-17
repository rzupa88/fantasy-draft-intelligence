import pandas as pd
import polars as pl

from packages.data.ingest import adp as adp_module
from packages.data.ingest import nflverse as nflverse_module


def test_fetch_historical_adp_returns_dataframe(monkeypatch) -> None:
    expected = pd.DataFrame({"season": [2024], "player_name": ["Test Player"]})

    monkeypatch.setattr(
        adp_module,
        "ingest_historical_adp",
        lambda config: expected,
    )

    result = adp_module.fetch_historical_adp()

    assert isinstance(result, pd.DataFrame)
    assert result.equals(expected)


def test_fetch_weekly_player_data_returns_dataframe(monkeypatch) -> None:
    expected = pl.DataFrame({"season": [2024], "week": [1]})

    monkeypatch.setattr(
        nflverse_module,
        "load_weekly_player_stats",
        lambda years: expected,
    )

    result = nflverse_module.fetch_weekly_player_data([2024])

    assert isinstance(result, pl.DataFrame)
    assert result.equals(expected)
