import React from "react";
import { createRoot } from "react-dom/client";
import { initAnalytics } from "./analytics.js";
import { App } from "./App.jsx";
import "./styles.css";

initAnalytics();
createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
