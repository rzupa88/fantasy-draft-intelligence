import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";
import "./recovery.css";
import "./roster-config.css";
import "./udk-import.css";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Draft room root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
