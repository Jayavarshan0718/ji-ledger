import { CurrencyDollar, CurrencyBtc, CurrencyEth } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const ICONS = [CurrencyDollar, CurrencyBtc, CurrencyEth];
const COLORS = ["#22c55e", "#FF4500", "#3b82f6", "#eab308", "#a855f7"];
const SYMBOLS = ["$", "₿", "Ξ", "◎", "◈"];

// Light mode uses different symbols/colors
const LIGHT_ICONS = [CurrencyDollar, CurrencyBtc, CurrencyEth];
const LIGHT_COLORS = ["#059669", "#dc2626", "#2563eb", "#ca8a04", "#9333ea"];
const LIGHT_SYMBOLS = ["◈", "◆", "◇", "○", "◎"];

export default function CryptoBackground({ density = 24, variant = "app" }) {
  const isHero = variant === "hero";
  const isSprinkle = variant === "sprinkle";
  const isConsole = variant === "console";
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const isLightMode = theme === "light";

  // Watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const t = localStorage.getItem("theme") || "dark";
      setTheme(t);
    };
    window.addEventListener("storage", checkTheme);
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains("light-mode");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("storage", checkTheme);
      observer.disconnect();
    };
  }, []);

  const activeIcons = isLightMode ? LIGHT_ICONS : ICONS;
  const activeColors = isLightMode ? LIGHT_COLORS : COLORS;
  const activeSymbols = isLightMode ? LIGHT_SYMBOLS : SYMBOLS;

  let items;
  let extraItems = null;

  if (isSprinkle) {
    // Sprinkle burst effect — particles burst from center and fade
    items = Array.from({ length: density }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 11) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      delay: `${(i * 0.3) % 3}s`,
      duration: `${1.5 + (i % 4) * 0.8}s`,
      size: 16 + (i % 4) * 12,
      color: activeColors[i % activeColors.length],
      Icon: activeIcons[i % activeIcons.length],
      symbol: activeSymbols[i % activeSymbols.length],
      useSymbol: i % 3 === 0,
      distance: 40 + (i % 6) * 30,
      angle: (i * 45) % 360,
    }));
  } else if (isConsole) {
    // Console page: running symbols on left side
    items = Array.from({ length: density }, (_, i) => ({
      id: i,
      top: `${(i * 37 + 5) % 100}%`,
      delay: `${(i * 1.5) % 20}s`,
      duration: `${8 + (i % 6) * 3}s`,
      size: 20 + (i % 3) * 16,
      color: activeColors[i % activeColors.length],
      Icon: activeIcons[i % activeIcons.length],
      symbol: activeSymbols[i % activeSymbols.length],
      useSymbol: i % 2 === 0,
    }));
  } else {
    items = Array.from({ length: density }, (_, i) => ({
      id: i,
      top: `${(i * 37 + 11) % 100}%`,
      delay: `${(i * 2.3) % 25}s`,
      duration: `${12 + (i % 8) * 2}s`,
      size: isHero ? 40 + (i % 5) * 18 : 28 + (i % 4) * 12,
      color: activeColors[i % activeColors.length],
      Icon: activeIcons[i % activeIcons.length],
      symbol: activeSymbols[i % activeSymbols.length],
      useSymbol: i % 3 === 0,
    }));
  }

  // Extra items for denser effect
  if (isConsole) {
    extraItems = Array.from({ length: Math.floor(density / 2) }, (_, i) => ({
      id: `extra-${i}`,
      top: `${(i * 47 + 23) % 100}%`,
      delay: `${(i * 2 + 1) % 15}s`,
      duration: `${10 + (i % 5) * 4}s`,
      size: 14 + (i % 4) * 10,
      color: activeColors[(i + 3) % activeColors.length],
      Icon: activeIcons[(i + 2) % activeIcons.length],
      symbol: activeSymbols[(i + 1) % activeSymbols.length],
      useSymbol: i % 3 === 1,
    }));
  }

  const getAnimationClass = () => {
    if (isSprinkle) return "animate-sprinkle";
    if (isConsole) return "animate-console-run";
    return "animate-crypto-run";
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden>
      {/* Gradient overlay - different for light/dark mode */}
      {isHero && (
        <div className={`absolute inset-0 ${isLightMode ? "bg-gradient-to-br from-[#FF4500]/5 via-white/10 to-green-500/5" : "bg-gradient-to-br from-[#FF4500]/10 via-black/30 to-green-500/10"}`} />
      )}
      {!isHero && !isSprinkle && !isConsole && (
        <div className={`absolute inset-0 ${isLightMode ? "bg-gradient-to-br from-[#FF4500]/3 via-transparent to-green-500/3" : "bg-gradient-to-br from-[#FF4500]/5 via-transparent to-green-500/5"}`} />
      )}
      
      {/* Grid pattern - different opacity for light/dark mode */}
      <div className={`absolute inset-0 ${isLightMode ? "crypto-grid-light" : "crypto-grid"} ${isHero ? "opacity-[0.2]" : "opacity-[0.12]"}`} />
      
      {/* Console page gets extra vertical line on left */}
      {isConsole && (
        <div className={`absolute left-0 top-0 bottom-0 w-px ${isLightMode ? "bg-[#FF4500]/10" : "bg-[#FF4500]/20"}`} />
      )}
      
      {/* Animated items */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute ${getAnimationClass()}`}
          style={{
            top: isSprinkle ? "50%" : item.top,
            left: isSprinkle ? "50%" : isConsole ? "-8%" : "-12%",
            animationDelay: item.delay,
            animationDuration: item.duration,
            '--travel-x': isSprinkle ? `${Math.cos((item.angle * Math.PI) / 180) * item.distance}px` : "0",
            '--travel-y': isSprinkle ? `${Math.sin((item.angle * Math.PI) / 180) * item.distance}px` : "0",
          }}
        >
          {item.useSymbol ? (
            <span
              className="font-display"
              style={{
                fontSize: item.size,
                color: item.color,
                opacity: isLightMode ? 0.2 : isHero ? 0.25 : isConsole ? 0.3 : 0.25,
              }}
            >
              {item.symbol}
            </span>
          ) : (
            <item.Icon
              size={item.size}
              weight={item.id % 2 === 0 ? "fill" : "thin"}
              color={item.color}
              className={isLightMode ? "opacity-[0.15]" : isHero ? "opacity-20" : isConsole ? "opacity-25" : "opacity-25"}
            />
          )}
        </div>
      ))}

      {/* Extra items for console */}
      {extraItems && extraItems.map((item) => (
        <div
          key={item.id}
          className="absolute animate-console-run"
          style={{
            top: item.top,
            left: "-12%",
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.useSymbol ? (
            <span
              className="font-display"
              style={{ fontSize: item.size, color: item.color, opacity: isLightMode ? 0.15 : 0.25 }}
            >
              {item.symbol}
            </span>
          ) : (
            <item.Icon
              size={item.size}
              weight={item.id % 2 === 0 ? "fill" : "thin"}
              color={item.color}
              className={isLightMode ? "opacity-[0.12]" : "opacity-20"}
            />
          )}
        </div>
      ))}
    </div>
  );
}