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
