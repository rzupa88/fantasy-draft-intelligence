export type DraftEngineErrorCode =
  | "INVALID_SETTINGS"
  | "INVALID_PLAYER_POOL"
  | "DRAFT_COMPLETE"
  | "PLAYER_UNAVAILABLE"
  | "NO_PICKS_TO_UNDO"
  | "PICK_NOT_FOUND";

export class DraftEngineError extends Error {
  readonly code: DraftEngineErrorCode;

  constructor(code: DraftEngineErrorCode, message: string) {
    super(message);
    this.name = "DraftEngineError";
    this.code = code;
  }
}
