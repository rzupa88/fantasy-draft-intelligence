from packages.data.ingest.adp import fetch_historical_adp
from packages.data.ingest.nflverse import fetch_weekly_player_data


def test_fetch_historical_adp_returns_dataframe() -> None:
    df = fetch_historical_adp()
    assert not df.empty


def test_fetch_weekly_player_data_returns_dataframe() -> None:
    df = fetch_weekly_player_data([2024])
    assert not df.is_empty()
