import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Nie znaleziono #root w index.html");

// Awaryjny reset storage po wejściu na #reset
if (location.hash === "#reset") {
    try {
        localStorage.removeItem("domowa-apteczka");
        sessionStorage.clear();
    } catch (e) {
        console.warn("Nie udało się wyczyścić storage:", e);
    }
}

ReactDOM.createRoot(rootEl).render(
    // UWAGA: StrictMode off na czas diagnozy pętli
    <ErrorBoundary>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ErrorBoundary>
);
