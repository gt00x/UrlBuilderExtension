/*  original code
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
*/

import React from "react";
import ReactDOM from "react-dom/client";
import UrlBuilder from "./pages/UrlBuilder";

// keep your existing global CSS import here, e.g.:
import "./index.css"; // or "./globals.css" or whatever you had before

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UrlBuilder />
  </React.StrictMode>
);