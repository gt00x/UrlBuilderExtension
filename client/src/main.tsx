import React from "react";
import ReactDOM from "react-dom/client";
import UrlBuilder from "./pages/UrlBuilder";
import "./index.css"; // keep whatever global CSS you had (index.css / globals.css / etc.)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UrlBuilder />
  </React.StrictMode>
);
