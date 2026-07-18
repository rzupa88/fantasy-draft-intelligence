import { useRef, type ChangeEvent } from "react";
import { zipSync } from "fflate";
import type { UdkBuildReport } from "../udk-importer.js";

interface UdkImportCardProps {
  report: UdkBuildReport | null;
  filename: string | null;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export function UdkImportCard({ report, filename, onImport, onClear }: UdkImportCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 1 && /\.zip$/i.test(files[0]!.name)) {
      await onImport(files[0]!);
    } else if (files.length > 0) {
      const archive: Record<string, Uint8Array> = {};
      for (const file of files) {
        if (!/\.(csv|pdf)$/i.test(file.name)) {
          throw new TypeError(`${file.name} is not a supported UDK export.`);
        }
        const path = (file.webkitRelativePath || file.name).replaceAll("\\", "/");
        if (archive[path] !== undefined) {
          throw new TypeError(`Two selected UDK files used the same path: ${path}`);
        }
        archive[path] = new Uint8Array(await file.arrayBuffer());
      }
      const bundled = new File([zipSync(archive, { level: 0 })], `udk-${files.length}-files.zip`, {
        type: "application/zip",
      });
      await onImport(bundled);
    }
    event.target.value = "";
  }

  return (
    <section className="udk-import-card field-wide" aria-labelledby="udk-import-title">
      <div className="udk-import-heading">
        <div>
          <p className="eyebrow">Player data</p>
          <h3 id="udk-import-title">Fantasy Footballers UDK package</h3>
          <p>
            Choose the UDK ZIP, or select all exported CSV and PDF files together. The files are
            recognized locally, combined in memory when needed, and never sent to a server.
          </p>
        </div>
        <div className="udk-import-actions">
          <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>
            {report === null ? "Import UDK files" : "Replace UDK files"}
          </button>
          {report === null ? null : (
            <button className="ghost-button" type="button" onClick={onClear}>
              Use demo data
            </button>
          )}
          <input
            ref={inputRef}
            data-testid="udk-file-input"
            className="sr-only"
            type="file"
            accept="application/zip,.zip,text/csv,.csv,application/pdf,.pdf"
            multiple
            onChange={(event) => void handleImport(event)}
          />
        </div>
      </div>

      {report === null ? (
        <div className="udk-empty-state">
          <strong>Demo player data is active.</strong>
          <span>Import a ZIP or select the loose UDK exports to replace the fictional pool.</span>
        </div>
      ) : (
        <div className="udk-preview" role="status">
          <div className="udk-ready-row">
            <span className="udk-ready-badge">UDK {report.season} ready</span>
            <span>{filename}</span>
          </div>
          <div className="udk-metrics">
            <Metric label="Players" value={report.playerCount} />
            <Metric label="Projected" value={report.projectedPlayerCount} />
            <Metric label="All 3 analysts" value={report.allAnalystProjectionCount} />
            <Metric label="Selected ADP" value={report.selectedAdpPlayerCount} />
            <Metric label="Files recognized" value={report.recognizedFileCount} />
          </div>
          <p className="udk-preview-note">
            {report.adpPlayerCount} ranked players appeared in the ADP comparison. The selected
            market and league size below determine the ADP used by recommendations.
          </p>
          {report.warnings.length === 0 ? null : (
            <details className="udk-warning-list">
              <summary>{report.warnings.length} import note{report.warnings.length === 1 ? "" : "s"}</summary>
              <ul>
                {report.warnings.slice(0, 8).map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
