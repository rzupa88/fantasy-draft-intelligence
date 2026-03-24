from __future__ import annotations

from pathlib import Path

import pandas as pd

from packages.data.constants import DEFAULT_PILOT_YEARS, INTERMEDIATE_DATA_DIR
from packages.data.io import read_parquet, write_parquet
from packages.data.player_ids import build_player_reference_table

INTERMEDIATE_DIR = Path(INTERMEDIATE_DATA_DIR)


def _adp_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"adp_historical_{min(years)}_{max(years)}.parquet"


def _nflverse_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"nflverse_player_weekly_{min(years)}_{max(years)}.parquet"


def _reference_path(years: list[int]) -> Path:
    return INTERMEDIATE_DIR / f"player_reference_{min(years)}_{max(years)}.parquet"


def main() -> None:
    years = list(DEFAULT_PILOT_YEARS)

    adp = read_parquet(_adp_path(years))
    nflverse = pd.read_parquet(_nflverse_path(years))

    reference = build_player_reference_table([adp, nflverse])
    write_parquet(reference, _reference_path(years))

    print(
        f"Player reference build complete: rows={len(reference)}, "
        f"cols={len(reference.columns)}, years={min(years)}-{max(years)}"
    )


if __name__ == "__main__":
    main()
