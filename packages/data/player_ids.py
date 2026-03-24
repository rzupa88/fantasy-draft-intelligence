from __future__ import annotations

import re
import unicodedata
from collections.abc import Iterable

import pandas as pd
import polars as pl

from packages.data.validation import assert_unique_key, require_columns

CANONICAL_ID_COLUMN = "canonical_player_id"
NORMALIZED_NAME_COLUMN = "normalized_player_name"
ENTITY_TYPE_COLUMN = "entity_type"

PLAYER_ENTITY = "player"
DST_ENTITY = "dst"

POSITION_NORMALIZATION_MAP: dict[str, str] = {
    "QB": "QB",
    "RB": "RB",
    "WR": "WR",
    "TE": "TE",
    "K": "K",
    "DST": "DST",
    "DEF": "DST",
    "D/ST": "DST",
}

_SUFFIX_PATTERN = re.compile(r"\b(jr|sr|ii|iii|iv|v)\b", flags=re.IGNORECASE)
_MULTI_SPACE_PATTERN = re.compile(r"\s+")
_NON_WORD_SPACE_HYPHEN_SLASH_PATTERN = re.compile(r"[^a-z0-9\s\-/]")
_DST_TOKEN_PATTERN = re.compile(r"\b(?:d\s*/\s*st|dst|defense|def)\b", flags=re.IGNORECASE)

DST_ALIAS_MAP: dict[str, str] = {
    "arizona cardinals": "arizona_cardinals",
    "atlanta falcons": "atlanta_falcons",
    "baltimore ravens": "baltimore_ravens",
    "buffalo bills": "buffalo_bills",
    "carolina panthers": "carolina_panthers",
    "chicago bears": "chicago_bears",
    "cincinnati bengals": "cincinnati_bengals",
    "cleveland browns": "cleveland_browns",
    "dallas cowboys": "dallas_cowboys",
    "denver broncos": "denver_broncos",
    "detroit lions": "detroit_lions",
    "green bay packers": "green_bay_packers",
    "houston texans": "houston_texans",
    "indianapolis colts": "indianapolis_colts",
    "jacksonville jaguars": "jacksonville_jaguars",
    "kansas city chiefs": "kansas_city_chiefs",
    "las vegas raiders": "las_vegas_raiders",
    "los angeles chargers": "los_angeles_chargers",
    "los angeles rams": "los_angeles_rams",
    "miami dolphins": "miami_dolphins",
    "minnesota vikings": "minnesota_vikings",
    "new england patriots": "new_england_patriots",
    "new orleans saints": "new_orleans_saints",
    "new york giants": "new_york_giants",
    "new york jets": "new_york_jets",
    "philadelphia eagles": "philadelphia_eagles",
    "pittsburgh steelers": "pittsburgh_steelers",
    "san francisco 49ers": "san_francisco_49ers",
    "seattle seahawks": "seattle_seahawks",
    "tampa bay buccaneers": "tampa_bay_buccaneers",
    "tennessee titans": "tennessee_titans",
    "washington commanders": "washington_commanders",
    "washington football team": "washington_commanders",
    "washington redskins": "washington_commanders",
}

DST_ABBR_MAP: dict[str, str] = {
    "ARI": "arizona_cardinals",
    "ATL": "atlanta_falcons",
    "BAL": "baltimore_ravens",
    "BUF": "buffalo_bills",
    "CAR": "carolina_panthers",
    "CHI": "chicago_bears",
    "CIN": "cincinnati_bengals",
    "CLE": "cleveland_browns",
    "DAL": "dallas_cowboys",
    "DEN": "denver_broncos",
    "DET": "detroit_lions",
    "GB": "green_bay_packers",
    "HOU": "houston_texans",
    "IND": "indianapolis_colts",
    "JAX": "jacksonville_jaguars",
    "KC": "kansas_city_chiefs",
    "LV": "las_vegas_raiders",
    "LAC": "los_angeles_chargers",
    "LAR": "los_angeles_rams",
    "MIA": "miami_dolphins",
    "MIN": "minnesota_vikings",
    "NE": "new_england_patriots",
    "NO": "new_orleans_saints",
    "NYG": "new_york_giants",
    "NYJ": "new_york_jets",
    "PHI": "philadelphia_eagles",
    "PIT": "pittsburgh_steelers",
    "SF": "san_francisco_49ers",
    "SEA": "seattle_seahawks",
    "TB": "tampa_bay_buccaneers",
    "TEN": "tennessee_titans",
    "WAS": "washington_commanders",
    "WSH": "washington_commanders",
}


def normalize_position(value: object) -> str:
    text = str(value).strip().upper()
    return POSITION_NORMALIZATION_MAP.get(text, text)


def _ascii_fold(text: str) -> str:
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")


def _normalize_for_person_name(text: str) -> str:
    text = _ascii_fold(text).lower().strip()
    # remove apostrophes and periods without inserting spaces so D.J. -> dj
    text = text.replace(".", "").replace("'", "")
    text = _NON_WORD_SPACE_HYPHEN_SLASH_PATTERN.sub(" ", text)
    text = text.replace("-", " ")
    text = _MULTI_SPACE_PATTERN.sub(" ", text).strip()
    return text


def _normalize_for_dst_name(text: str) -> str:
    text = _ascii_fold(text).lower().strip()
    text = text.replace(".", "").replace("'", "")
    text = _NON_WORD_SPACE_HYPHEN_SLASH_PATTERN.sub(" ", text)
    text = _MULTI_SPACE_PATTERN.sub(" ", text).strip()
    return text


def normalize_player_name(name: object) -> str:
    text = _normalize_for_person_name(str(name))
    text = _SUFFIX_PATTERN.sub("", text)
    text = _MULTI_SPACE_PATTERN.sub(" ", text).strip()
    return text.replace(" ", "_")


def normalize_dst_name(name: object) -> str:
    raw = str(name).strip()
    upper_raw = raw.upper()
    if upper_raw in DST_ABBR_MAP:
        return DST_ABBR_MAP[upper_raw]

    text = _normalize_for_dst_name(raw)
    text = _DST_TOKEN_PATTERN.sub("", text)
    text = _MULTI_SPACE_PATTERN.sub(" ", text).strip()

    if text in DST_ALIAS_MAP:
        return DST_ALIAS_MAP[text]

    return text.replace(" ", "_")


def infer_entity_type(position: object) -> str:
    normalized_position = normalize_position(position)
    return DST_ENTITY if normalized_position == "DST" else PLAYER_ENTITY


def normalize_entity_name(name: object, position: object) -> str:
    if infer_entity_type(position) == DST_ENTITY:
        return normalize_dst_name(name)
    return normalize_player_name(name)


def build_canonical_player_id(name: object, position: object) -> str:
    normalized_position = normalize_position(position)
    normalized_name = normalize_entity_name(name=name, position=normalized_position)
    entity_type = infer_entity_type(normalized_position)
    return f"{entity_type}:{normalized_name}:{normalized_position}"


def attach_canonical_ids_pandas(
    df: pd.DataFrame,
    *,
    player_name_col: str = "player_name",
    position_col: str = "position",
) -> pd.DataFrame:
    require_columns(df, [player_name_col, position_col])

    output = df.copy()
    output[position_col] = output[position_col].map(normalize_position)
    output[NORMALIZED_NAME_COLUMN] = [
        normalize_entity_name(name, position)
        for name, position in zip(output[player_name_col], output[position_col], strict=False)
    ]
    output[ENTITY_TYPE_COLUMN] = output[position_col].map(infer_entity_type)
    output[CANONICAL_ID_COLUMN] = [
        build_canonical_player_id(name, position)
        for name, position in zip(output[player_name_col], output[position_col], strict=False)
    ]
    return output


def attach_canonical_ids_polars(
    df: pl.DataFrame,
    *,
    player_name_col: str = "player_name",
    position_col: str = "position",
) -> pl.DataFrame:
    required = {player_name_col, position_col}
    missing = required.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required columns for canonical IDs: {sorted(missing)}")

    normalized_position_expr = (
        pl.col(position_col)
        .map_elements(normalize_position, return_dtype=pl.Utf8)
        .alias(position_col)
    )

    output = df.with_columns([normalized_position_expr])

    output = output.with_columns(
        [
            pl.struct([pl.col(player_name_col), pl.col(position_col)])
            .map_elements(
                lambda row: normalize_entity_name(row[player_name_col], row[position_col]),
                return_dtype=pl.Utf8,
            )
            .alias(NORMALIZED_NAME_COLUMN),
            pl.col(position_col)
            .map_elements(infer_entity_type, return_dtype=pl.Utf8)
            .alias(ENTITY_TYPE_COLUMN),
            pl.struct([pl.col(player_name_col), pl.col(position_col)])
            .map_elements(
                lambda row: build_canonical_player_id(row[player_name_col], row[position_col]),
                return_dtype=pl.Utf8,
            )
            .alias(CANONICAL_ID_COLUMN),
        ]
    )
    return output


def build_player_reference_table(
    frames: Iterable[pd.DataFrame],
    *,
    source_col: str = "source_name",
    player_name_col: str = "player_name",
    position_col: str = "position",
) -> pd.DataFrame:
    prepared_frames: list[pd.DataFrame] = []

    for frame in frames:
        require_columns(frame, [player_name_col, position_col, source_col])
        enriched = attach_canonical_ids_pandas(
            frame,
            player_name_col=player_name_col,
            position_col=position_col,
        )

        prepared = enriched[
            [
                CANONICAL_ID_COLUMN,
                NORMALIZED_NAME_COLUMN,
                ENTITY_TYPE_COLUMN,
                player_name_col,
                position_col,
                source_col,
            ]
        ].rename(
            columns={
                player_name_col: "source_player_name",
                position_col: "position",
                source_col: "source_name",
            }
        )

        prepared_frames.append(prepared)

    if not prepared_frames:
        raise ValueError("At least one frame must be provided")

    combined = pd.concat(prepared_frames, ignore_index=True).drop_duplicates()

    combined = combined.sort_values(
        [CANONICAL_ID_COLUMN, "source_name", "source_player_name"]
    ).reset_index(drop=True)

    assert_unique_key(
        combined,
        [CANONICAL_ID_COLUMN, "source_name", "source_player_name"],
    )
    return combined
