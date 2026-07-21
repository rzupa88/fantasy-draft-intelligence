import { useEffect, useState } from "react";
import type { PlayerDataRecord, ScoringPreset } from "@fdi/shared-types";

interface PlayerResearchModalProps {
  player: PlayerDataRecord;
  scoringPreset: ScoringPreset;
  releaseSeason: number;
  sources: string[];
  onClose: () => void;
}

type ResearchTab = "overview" | "production" | "data";

export function PlayerResearchModal({
  player,
  scoringPreset,
  releaseSeason,
  sources,
  onClose,
}: PlayerResearchModalProps) {
  const [activeTab, setActiveTab] = useState<ResearchTab>("overview");
  const history = player.prior_season_stats ?? null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const priorPoints = getScoringValue(history, scoringPreset, "season");
  const priorPpg = getScoringValue(history, scoringPreset, "game");
  const initials = player.display_name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="player-research-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="player-research-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-research-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="player-research-close" type="button" onClick={onClose} aria-label="Close player research">
          ×
        </button>

        <header className={`player-research-hero research-position-${player.position.toLowerCase()}`}>
          <div className="player-research-avatar" aria-hidden="true">{initials}</div>
          <div className="player-research-identity">
            <div className="player-research-position-line">
              <span>{player.position}</span>
              <span>{player.nfl_team ?? "Free agent"}</span>
              <span>Bye {player.bye_week ?? "—"}</span>
            </div>
            <h2 id="player-research-title">{player.display_name}</h2>
            <p>UDK draft profile enriched with NFLverse prior-season production.</p>
          </div>
          <div className="player-research-headline-ranks">
            <ResearchMetric label="Overall" value={formatRank(player.overall_rank)} />
            <ResearchMetric label="Position" value={formatPositionRank(player.position, player.position_rank)} />
            <ResearchMetric label="Tier" value={formatNumber(player.tier, 0)} />
          </div>
        </header>

        <nav className="player-research-tabs" aria-label="Player research sections">
          {(["overview", "production", "data"] as ResearchTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "player-research-tab-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "data" ? "Data sources" : capitalize(tab)}
            </button>
          ))}
        </nav>

        <div className="player-research-content">
          {activeTab === "overview" ? (
            <>
              <section className="research-card research-card-wide">
                <div className="research-card-heading">
                  <div>
                    <p className="eyebrow">{releaseSeason} draft market</p>
                    <h3>UDK snapshot</h3>
                  </div>
                  <span className={`research-status research-status-${normalizeStatus(player.availability_status)}`}>
                    {player.availability_status ?? "Status unavailable"}
                  </span>
                </div>
                <div className="research-metric-grid">
                  <ResearchMetric label="ADP" value={formatNumber(player.adp, 1)} />
                  <ResearchMetric label="Projection" value={formatNumber(player.projected_points, 1)} />
                  <ResearchMetric label="Risk" value={formatNumber(player.risk_score, 1)} />
                  <ResearchMetric label="Upside" value={formatNumber(player.upside_score, 1)} />
                </div>
              </section>

              <section className="research-card">
                <p className="eyebrow">Market read</p>
                <h3>Draft-day interpretation</h3>
                <div className="research-insight-list">
                  <Insight label="Cost" text={buildCostInsight(player)} />
                  <Insight label="Profile" text={buildProfileInsight(player)} />
                  <Insight label="History" text={buildHistoryInsight(player, priorPpg)} />
                </div>
              </section>

              <section className="research-card">
                <p className="eyebrow">Prior season</p>
                <h3>{history === null ? "NFLverse match unavailable" : `${history.season} fantasy production`}</h3>
                {history === null ? (
                  <ResearchEmpty text="No matched NFLverse season history is attached to this player." />
                ) : (
                  <div className="research-metric-grid research-metric-grid-compact">
                    <ResearchMetric label="Games" value={String(history.games)} />
                    <ResearchMetric label="Fantasy pts" value={formatNumber(priorPoints, 1)} />
                    <ResearchMetric label="Pts/game" value={formatNumber(priorPpg, 1)} />
                    <ResearchMetric label="Weekly volatility" value={formatNumber(history.weekly_points_stddev_half_ppr, 1)} />
                  </div>
                )}
              </section>
            </>
          ) : null}

          {activeTab === "production" ? (
            history === null ? (
              <section className="research-card research-card-wide">
                <ResearchEmpty text="Production tables require a matched NFLverse player identity." />
              </section>
            ) : (
              <>
                <section className="research-card research-card-wide">
                  <p className="eyebrow">{history.season} usage and scoring</p>
                  <h3>Season production</h3>
                  <div className="research-stat-table">
                    <StatRow label="Games" value={history.games} />
                    <StatRow label="Fantasy points" value={priorPoints} decimals={1} />
                    <StatRow label="Points per game" value={priorPpg} decimals={1} />
                    <StatRow label="Weekly volatility (half PPR)" value={history.weekly_points_stddev_half_ppr} decimals={1} />
                    <StatRow label="Fumbles lost" value={history.fumbles_lost} />
                  </div>
                </section>
                <ProductionCard title="Passing" rows={[
                  ["Attempts", history.attempts],
                  ["Yards", history.passing_yards],
                  ["Touchdowns", history.passing_tds],
                  ["Interceptions", history.interceptions],
                ]} />
                <ProductionCard title="Rushing" rows={[
                  ["Carries", history.carries],
                  ["Yards", history.rushing_yards],
                  ["Touchdowns", history.rushing_tds],
                ]} />
                <ProductionCard title="Receiving" rows={[
                  ["Targets", history.targets],
                  ["Receptions", history.receptions],
                  ["Yards", history.receiving_yards],
                  ["Touchdowns", history.receiving_tds],
                ]} />
              </>
            )
          ) : null}

          {activeTab === "data" ? (
            <>
              <section className="research-card research-card-wide">
                <p className="eyebrow">Transparency</p>
                <h3>What this card can substantiate</h3>
                <p className="research-copy">
                  Rankings, ADP, tiers, projections, risk and upside come from the imported UDK release.
                  Prior-season totals come from the bundled or manually imported NFLverse history release.
                </p>
                <div className="research-source-list">
                  {sources.map((source) => <span key={source}>{source}</span>)}
                </div>
              </section>
              <section className="research-card">
                <p className="eyebrow">Identity</p>
                <h3>Match status</h3>
                <div className="research-stat-table">
                  <StatRow label="Canonical ID" value={player.canonical_player_id} />
                  <StatRow label="NFLverse ID" value={player.nflverse_player_id ?? "Not matched"} />
                  <StatRow label="Historical season" value={history?.season ?? "Not available"} />
                </div>
              </section>
              <section className="research-card">
                <p className="eyebrow">Not included yet</p>
                <h3>Requires another source</h3>
                <p className="research-copy">
                  Headshots, height, weight, college, current news, injury reporting, matchup grades,
                  schedules and depth-chart context are intentionally omitted until a reliable source is added.
                </p>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ResearchMetric({ label, value }: { label: string; value: string }) {
  return <div className="research-metric"><span>{label}</span><strong>{value}</strong></div>;
}

function Insight({ label, text }: { label: string; text: string }) {
  return <div className="research-insight"><span>{label}</span><p>{text}</p></div>;
}

function ResearchEmpty({ text }: { text: string }) {
  return <div className="research-empty"><strong>Data unavailable</strong><span>{text}</span></div>;
}

function StatRow({ label, value, decimals = 0 }: { label: string; value: string | number; decimals?: number }) {
  const formatted = typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) : value;
  return <div className="research-stat-row"><span>{label}</span><strong>{formatted}</strong></div>;
}

function ProductionCard({ title, rows }: { title: string; rows: [string, number][] }) {
  return <section className="research-card"><p className="eyebrow">NFLverse</p><h3>{title}</h3><div className="research-stat-table">{rows.map(([label, value]) => <StatRow key={label} label={label} value={value} />)}</div></section>;
}

function formatNumber(value: number | null | undefined, decimals: number): string {
  return value === null || value === undefined ? "—" : value.toFixed(decimals);
}

function formatRank(value: number | null): string {
  return value === null ? "—" : `#${Math.round(value)}`;
}

function formatPositionRank(position: string, value: number | null): string {
  return value === null ? "—" : `${position}${Math.round(value)}`;
}

function capitalize(value: string): string {
  return value[0]!.toUpperCase() + value.slice(1);
}

function normalizeStatus(value: string | null): string {
  const normalized = value?.toLowerCase() ?? "unknown";
  if (normalized.includes("out") || normalized.includes("injur")) return "warning";
  if (normalized.includes("active") || normalized.includes("available")) return "good";
  return "neutral";
}

function getScoringValue(
  history: PlayerDataRecord["prior_season_stats"],
  preset: ScoringPreset,
  unit: "season" | "game",
): number | null {
  if (history === null || history === undefined) return null;
  const resolvedPreset = preset === "custom" ? "half_ppr" : preset;
  if (unit === "season") {
    if (resolvedPreset === "standard") return history.fantasy_points_standard;
    if (resolvedPreset === "ppr") return history.fantasy_points_ppr;
    return history.fantasy_points_half_ppr;
  }
  if (resolvedPreset === "standard") return history.points_per_game_standard;
  if (resolvedPreset === "ppr") return history.points_per_game_ppr;
  return history.points_per_game_half_ppr;
}

function buildCostInsight(player: PlayerDataRecord): string {
  if (player.adp === null || player.overall_rank === null) return "The imported release does not contain enough market data to compare rank with ADP.";
  const difference = player.adp - player.overall_rank;
  if (difference >= 8) return `Ranked about ${Math.round(difference)} picks ahead of ADP, creating a potential value window.`;
  if (difference <= -8) return `ADP is about ${Math.abs(Math.round(difference))} picks earlier than rank, so the market is pricing in extra optimism.`;
  return "UDK rank and market ADP are closely aligned.";
}

function buildProfileInsight(player: PlayerDataRecord): string {
  if (player.risk_score === null && player.upside_score === null) return "Risk and upside scores are not present in this UDK record.";
  if ((player.upside_score ?? 0) - (player.risk_score ?? 0) >= 15) return "The imported profile leans toward upside relative to its risk score.";
  if ((player.risk_score ?? 0) - (player.upside_score ?? 0) >= 15) return "The imported profile carries more risk than upside.";
  return "Risk and upside are relatively balanced in the imported profile.";
}

function buildHistoryInsight(player: PlayerDataRecord, priorPpg: number | null): string {
  if (player.prior_season_stats === null || player.prior_season_stats === undefined || priorPpg === null) return "No matched prior-season production is available.";
  return `${player.prior_season_stats.games} games at ${priorPpg.toFixed(1)} fantasy points per game in the selected scoring format.`;
}
