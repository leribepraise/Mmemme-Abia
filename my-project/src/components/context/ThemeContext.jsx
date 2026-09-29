import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const readTheme = () => {
  try {
    const value = localStorage.getItem("mmemme-theme");
    if (value === "dark" || value === "light") return value;
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111b16" : "#48782E");
  }, [theme]);
  useEffect(() => {
    const sync = (event) => {
      if (!event.key || event.key === "mmemme-theme") setTheme(readTheme());
    };
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const system = () => setTheme(readTheme());
    window.addEventListener("storage", sync);
    media.addEventListener("change", system);
    return () => {
      window.removeEventListener("storage", sync);
      media.removeEventListener("change", system);
    };
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("mmemme-theme", next);
    } catch {
      /* The selection still applies for this visit. */
    }
    setTheme(next);
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
