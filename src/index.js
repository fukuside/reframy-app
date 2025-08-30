import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SoundProvider } from "./hooks/SoundProvider";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SoundProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SoundProvider>
  </React.StrictMode>
);
