// src/main.tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Nie znaleziono #root w index.html");

ReactDOM.createRoot(rootEl).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
);
