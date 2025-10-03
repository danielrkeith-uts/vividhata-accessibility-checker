import React, { createContext, useContext, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const lightVars: Record<string, string> = {
  "--bg": "#ede5d9",
  "--panel": "#ffffff",
  "--panel-border": "#e5e7eb",
  "--text": "#1f2937",
  "--muted": "#6b7280",
  "--brand": "#4A5568",
  "--accent": "#22c55e",
  "--warn": "#f97316",
  "--danger": "#ef4444",
};

const darkVars: Record<string, string> = {
  "--bg": "#0f172a",
  "--panel": "#111827",
  "--panel-border": "#374151",
  "--text": "#e5e7eb",
  "--muted": "#9ca3af",
  "--brand": "#60a5fa",
  "--accent": "#34d399",
  "--warn": "#fb923c",
  "--danger": "#f87171",
};

function applyCssVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useMemo(() => {
    applyCssVars(mode === "light" ? lightVars : darkVars);
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


