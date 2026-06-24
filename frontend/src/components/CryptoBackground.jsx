import { CurrencyDollar, CurrencyBtc, CurrencyEth } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";

const ICONS = [CurrencyDollar, CurrencyBtc, CurrencyEth];
const COLORS = ["#22c55e", "#FF4500", "#3b82f6", "#eab308", "#a855f7"];
const SYMBOLS = ["$", "₿", "Ξ", "◎", "◈"];
const LIGHT_ICONS = [CurrencyDollar, CurrencyBtc, CurrencyEth];
const LIGHT_COLORS = ["#059669", "#dc2626", "#2563eb", "#ca8a04", "#9333ea"];
const LIGHT_SYMBOLS = ["◈", "◆", "◇", "○", "◎"];

const CURSOR_ICONS = [
  { Icon: CurrencyBtc,    color: "#f7931a", size: 32, offset: { x: -220, y: -120 }, lag: 0.06 },
  { Icon: CurrencyEth,    color: "#8c8cff", size: 26, offset: { x:  200, y: -160 }, lag: 0.09 },
  { Icon: CurrencyDollar, color: "#22c55e", size: 30, offset: { x:  240, y:  100 }, lag: 0.07 },
  { symbol: "◈",          color: "#FF4500", size: 22, offset: { x: -200, y:  160 }, lag: 0.05 },
  { symbol: "₿",          color: "#eab308", size: 20, offset: { x:   60, y:  220 }, lag: 0.08 },
  { Icon: CurrencyBtc,    color: "#ff6b35", size: 20, offset: { x: -280, y:   30 }, lag: 0.04 },
  { Icon: CurrencyEth,    color: "#a78bfa", size: 22, offset: { x:  270, y:  -60 }, lag: 0.10 },
  { symbol: "Ξ",          color: "#3b82f6", size: 24, offset: { x:  -80, y: -250 }, lag: 0.05 },
  { symbol: "◎",          color: "#ec4899", size: 18, offset: { x:  260, y:  190 }, lag: 0.11 },
  { Icon: CurrencyDollar, color: "#34d399", size: 22, offset: { x: -260, y: -200 }, lag: 0.07 },
  { symbol: "$",          color: "#facc15", size: 26, offset: { x:   30, y: -280 }, lag: 0.06 },
  { symbol: "◆",          color: "#f43f5e", size: 16, offset: { x: -300, y:  120 }, lag: 0.04 },
  { Icon: CurrencyBtc,    color: "#fb923c", size: 18, offset: { x:  300, y: -130 }, lag: 0.09 },
  { symbol: "✦",          color: "#FF4500", size: 20, offset: { x:  -60, y:  300 }, lag: 0.06 },
  { Icon: CurrencyEth,    color: "#60a5fa", size: 16, offset: { x:  180, y:  270 }, lag: 0.08 },
  { symbol: "◇",          color: "#c084fc", size: 18, offset: { x: -320, y:  -80 }, lag: 0.05 },
  { Icon: CurrencyDollar, color: "#f97316", size: 20, offset: { x:  320, y:   50 }, lag: 0.07 },
  { symbol: "₿",          color: "#86efac", size: 16, offset: { x: -150, y:  310 }, lag: 0.09 },
  { Icon: CurrencyBtc,    color: "#fbbf24", size: 24, offset: { x:  130, y: -310 }, lag: 0.05 },
  { symbol: "Ξ",          color: "#f472b6", size: 20, offset: { x: -340, y: -160 }, lag: 0.06 },
  { symbol: "◈",          color: "#38bdf8", size: 16, offset: { x:  340, y:  200 }, lag: 0.10 },
  { Icon: CurrencyEth,    color: "#4ade80", size: 18, offset: { x: -100, y: -340 }, lag: 0.07 },
  { symbol: "$",          color: "#fb7185", size: 22, offset: { x:  280, y: -240 }, lag: 0.04 },
  { Icon: CurrencyDollar, color: "#818cf8", size: 16, offset: { x: -280, y:  270 }, lag: 0.08 },
];

function MouseFollowLayer() {
  const posRef = useRef(CURSOR_ICONS.map(() => ({ x: -200, y: -200 })));
  const targetRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);
  const [positions, setPositions] = useState(CURSOR_ICONS.map(() => ({ x: -200, y: -200 })));

  useEffect(() => {
    const onMove = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      let changed = false;
      CURSOR_ICONS.forEach((item, i) => {
        const tx = targetRef.current.x + item.offset.x;
        const ty = targetRef.current.y + item.offset.y;
        const cx = posRef.current[i].x;
        const cy = posRef.current[i].y;
        const nx = cx + (tx - cx) * item.lag;
        const ny = cy + (ty - cy) * item.lag;
        if (Math.abs(nx - cx) > 0.1 || Math.abs(ny - cy) > 0.1) {
          posRef.current[i] = { x: nx, y: ny };
          changed = true;
        }
      });
      if (changed) setPositions([...posRef.current]);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[5]" aria-hidden>
      {CURSOR_ICONS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: positions[i].x,
            top: positions[i].y,
            transform: "translate(-50%, -50%)",
            transition: "none",
            willChange: "transform",
          }}
        >
          {item.Icon ? (
            <item.Icon size={item.size} weight="fill" color={item.color} style={{ opacity: 0.75, filter: `drop-shadow(0 0 6px ${item.color}88)` }} />
          ) : (
            <span style={{ fontSize: item.size, color: item.color, opacity: 0.75, textShadow: `0 0 8px ${item.color}88`, fontFamily: "monospace" }}>{item.symbol}</span>
          )}
        </div>
      ))}
    </div>
  );
}

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
      {isHero && <MouseFollowLayer />}
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