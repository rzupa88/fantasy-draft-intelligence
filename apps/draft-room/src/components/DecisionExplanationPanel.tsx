import type { DraftDecisionExplanation } from "../decision-explanation.js";

interface DecisionExplanationPanelProps {
  explanation: DraftDecisionExplanation;
  compact?: boolean;
}

export function DecisionExplanationPanel({
  explanation,
  compact = false,
}: DecisionExplanationPanelProps) {
  const visibleSignals = compact ? explanation.signals.slice(0, 3) : explanation.signals;

  return (
    <section className={`decision-explanation ${compact ? "decision-explanation-compact" : ""}`}>
      <div className="decision-explanation-heading">
        <div>
          <p className="eyebrow">Why FDI likes this player</p>
          <h3>{explanation.summary}</h3>
        </div>
        {explanation.alternative === null ? null : (
          <span className="decision-alternative-chip">
            Alt: {explanation.alternative.displayName}
          </span>
        )}
      </div>
      <div className="decision-signal-grid">
        {visibleSignals.map((signal) => (
          <article
            className={`decision-signal decision-signal-${signal.tone}`}
            key={signal.key}
          >
            <span>{signal.label}</span>
            <strong>{signal.headline}</strong>
            {compact ? null : <p>{signal.detail}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
