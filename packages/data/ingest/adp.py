from __future__ import annotations

import pandas as pd



def fetch_historical_adp() -> pd.DataFrame:
    """
    Placeholder ADP ingestion function.

    Replace with careful historical ADP extraction logic.
    """
    return pd.DataFrame(
        [
            {
                "season": 2024,
                "player_name": "example_player",
                "position": "RB",
                "adp_overall": 42.5,
                "source_name": "example_source",
            }
        ]
    )
