export type DraftEngineErrorCode =
  | "INVALID_SETTINGS"
  | "INVALID_PLAYER_POOL"
  | "DRAFT_COMPLETE"
  | "PLAYER_UNAVAILABLE"
  | "ROSTER_INVALID"
  | "NO_PICKS_TO_UNDO"
  | "PICK_NOT_FOUND"
  | "INVALID_DRAFT_EXPORT"
  | "UNSUPPORTED_SCHEMA_VERSION";

export class DraftEngineError extends Error {
  readonly code: DraftEngineErrorCode;

  constructor(code: DraftEngineErrorCode, message: string) {
    super(message);
    this.name = "DraftEngineError";
    this.code = code;
  }
}
