import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { DraftLab } from "./components/DraftLab.js";
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
import "./draft-room-redesign-e2e-fix.css";
import "./draft-room-readability.css";
import "./draft-room-usability.css";
import "./draft-drawer-resize.css";
import "./setup-simplify.css";
import "./draft-lab.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Draft room root element was not found.");
}

const isDraftLab = new URLSearchParams(window.location.search).get("lab") === "1";

document.documentElement.classList.toggle("draft-lab-mode", isDraftLab);
document.body.classList.toggle("draft-lab-mode", isDraftLab);

createRoot(rootElement).render(
  <StrictMode>{isDraftLab ? <DraftLab /> : <App />}</StrictMode>,
);
