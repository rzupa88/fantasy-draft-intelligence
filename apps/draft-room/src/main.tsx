import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";
import "./recovery.css";
import "./roster-config.css";
import "./udk-import.css";
import "./nflverse-history.css";
import "./draft-board.css";
import "./player-research.css";
import "./roster-lineup.css";
import "./mobile-draft-drawer.css";
import "./desktop-draft-drawer.css";
import "./draft-room-redesign.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Draft room root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
