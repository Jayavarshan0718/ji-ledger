import { useState, useEffect } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "light") {
            root.classList.add("light-mode");
            document.body.style.backgroundColor = "var(--bg-primary)";
        } else {
            root.classList.remove("light-mode");
            document.body.style.backgroundColor = "var(--bg-primary)";
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-panel)] hover:bg-[var(--bg-panel)]/50 transition-colors text-[#FF4500]"
            title="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
        </button>
    );
}