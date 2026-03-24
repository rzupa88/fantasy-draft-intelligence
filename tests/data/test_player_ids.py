from __future__ import annotations

import pandas as pd
import polars as pl

from packages.data.player_ids import (
    attach_canonical_ids_pandas,
    attach_canonical_ids_polars,
    build_canonical_player_id,
    build_player_reference_table,
    normalize_dst_name,
    normalize_player_name,
)


def test_normalize_player_name_removes_punctuation_and_suffix() -> None:
    assert normalize_player_name("D.J. Moore") == "dj_moore"
    assert normalize_player_name("Kenneth Walker III") == "kenneth_walker"
    assert normalize_player_name("Brian Thomas Jr.") == "brian_thomas"


def test_normalize_dst_name_handles_abbreviation_and_tokens() -> None:
    assert normalize_dst_name("DAL") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys DST") == "dallas_cowboys"
    assert normalize_dst_name("Dallas Cowboys D/ST") == "dallas_cowboys"


def test_build_canonical_player_id_is_stable() -> None:
    assert build_canonical_player_id("D.J. Moore", "WR") == "player:dj_moore:WR"
    assert build_canonical_player_id("Kenneth Walker III", "RB") == "player:kenneth_walker:RB"
    assert build_canonical_player_id("Dallas Cowboys DST", "DST") == "dst:dallas_cowboys:DST"


def test_attach_canonical_ids_pandas() -> None:
    df = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    out = attach_canonical_ids_pandas(df)

    assert "canonical_player_id" in out.columns
    assert out.loc[0, "canonical_player_id"] == "player:dj_moore:WR"
    assert out.loc[1, "canonical_player_id"] == "player:kenneth_walker:RB"


def test_attach_canonical_ids_polars() -> None:
    df = pl.DataFrame(
        {
            "player_name": ["Dallas Cowboys DST"],
            "position": ["DST"],
            "source_name": ["fantasypros"],
        }
    )

    out = attach_canonical_ids_polars(df)

    assert "canonical_player_id" in out.columns
    assert out["canonical_player_id"].to_list() == ["dst:dallas_cowboys:DST"]


def test_build_player_reference_table_unifies_cross_source_names() -> None:
    adp = pd.DataFrame(
        {
            "player_name": ["D.J. Moore", "Kenneth Walker III"],
            "position": ["WR", "RB"],
            "source_name": ["fantasypros", "fantasypros"],
        }
    )

    nflverse = pd.DataFrame(
        {
            "player_name": ["DJ Moore", "Kenneth Walker"],
            "position": ["WR", "RB"],
            "source_name": ["nflverse", "nflverse"],
        }
    )

    reference = build_player_reference_table([adp, nflverse])

    dj_rows = reference.loc[reference["canonical_player_id"] == "player:dj_moore:WR"]
    kw_rows = reference.loc[reference["canonical_player_id"] == "player:kenneth_walker:RB"]

    assert len(dj_rows) == 2
    assert len(kw_rows) == 2
