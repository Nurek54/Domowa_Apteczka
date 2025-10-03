import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; msg?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(err: unknown): State {
        const msg =
            err instanceof Error
                ? err.message
                : typeof err === "string"
                    ? err
                    : "Nieznany błąd";
        return { hasError: true, msg };
    }

    componentDidCatch(err: unknown, info: React.ErrorInfo) {
        console.error("App crashed:", err, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                        Wystąpił błąd w aplikacji
                    </h1>
                    <p style={{ color: "#ef4444" }}>{this.state.msg}</p>
                    <button
                        onClick={() => location.reload()}
                        style={{ marginTop: 12, padding: "8px 12px" }}
                    >
                        Odśwież stronę
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
