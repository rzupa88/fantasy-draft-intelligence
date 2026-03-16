from pathlib import Path

import pandas as pd


def ensure_parent_dir(path: str | Path) -> Path:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return output_path


def write_parquet(df: pd.DataFrame, path: str | Path) -> None:
    output_path = ensure_parent_dir(path)
    df.to_parquet(output_path, index=False)


def read_parquet(path: str | Path) -> pd.DataFrame:
    return pd.read_parquet(path)
