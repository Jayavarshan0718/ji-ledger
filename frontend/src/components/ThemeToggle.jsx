import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-panel)] hover:border-[#FF4500] transition-all text-[#FF4500]"
      title="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
    </button>
  );
}
