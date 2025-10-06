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
  "--brand": "#8B5CF6",
  "--accent": "#22c55e",
  "--warn": "#f97316",
  "--danger": "#ef4444",
  "--success": "#10B981",
  "--info": "#3B82F6",
  "--focus-outline": "#8B5CF6",
  "--focus-outline-offset": "2px",
  "--link-color": "#8B5CF6",
  "--link-hover": "#7C3AED",
  "--button-text": "#FFFFFF",
  "--button-bg": "#8B5CF6",
  "--button-hover": "#7C3AED",
};

const darkVars: Record<string, string> = {
  "--bg": "#0f172a",
  "--panel": "#111827",
  "--panel-border": "#374151",
  "--text": "#e5e7eb",
  "--muted": "#9ca3af",
  "--brand": "#A78BFA",
  "--accent": "#34d399",
  "--warn": "#fb923c",
  "--danger": "#f87171",
  "--success": "#34D399",
  "--info": "#60A5FA",
  "--focus-outline": "#A78BFA",
  "--focus-outline-offset": "2px",
  "--link-color": "#A78BFA",
  "--link-hover": "#8B5CF6",
  "--button-text": "#FFFFFF",
  "--button-bg": "#A78BFA",
  "--button-hover": "#8B5CF6",
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


