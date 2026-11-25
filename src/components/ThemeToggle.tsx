// Light / dark switch. The theme is the data-theme attribute on <html>, which swaps the color
// tokens in index.css, so nothing else in the UI needs to know about it.

import { useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(currentTheme);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
        localStorage.setItem("theme", next);
        } catch {
        // storage can be blocked; the switch still works for this visit
        }
        setTheme(next);
    };

    return (
        <button type="button" onClick={toggle} aria-pressed={theme === "dark"} className="btn">
        {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
    );
}