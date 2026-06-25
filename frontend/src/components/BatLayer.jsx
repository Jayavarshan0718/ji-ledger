import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

// Detailed realistic bat SVG with wing flap
function BatSVG({ size = 100, phase = 0 }) {
  const w = phase * 18; // wing vertical offset for flapping

  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2a0e40" />
          <stop offset="50%" stopColor="#12061e" />
          <stop offset="100%" stopColor="#04020c" />
        </radialGradient>
        <radialGradient id="eg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3300" stopOpacity="1" />
          <stop offset="55%" stopColor="#aa0000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#660000" stopOpacity="0" />
        </radialGradient>
        <filter id="ef" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* LEFT WING */}
      <path d={`M80,82 C60,${70 + w} 36,${50 + w} 10,${58 + w} C2,${62 + w} 0,${72 + w} 6,${80 + w} C14,${88 + w} 30,${85 + w} 44,${88 + w} C58,${92 + w} 70,94 76,92 Z`}
        fill="url(#wg)" />
      <path d={`M80,80 C62,${60 + w} 34,${38 + w} 4,${52 + w}`} stroke="#3a1a55" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d={`M80,80 C64,${65 + w} 40,${48 + w} 16,${60 + w}`} stroke="#3a1a55" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d={`M80,80 C68,${72 + w} 50,${64 + w} 32,${72 + w}`} stroke="#3a1a55" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d={`M4,${52 + w} C-4,${44 + w} -5,${32 + w} 4,${27 + w} C11,${22 + w} 20,${30 + w} 16,${43 + w}`} fill="#080312" />

      {/* RIGHT WING */}
      <path d={`M140,82 C160,${70 + w} 184,${50 + w} 210,${58 + w} C218,${62 + w} 220,${72 + w} 214,${80 + w} C206,${88 + w} 190,${85 + w} 176,${88 + w} C162,${92 + w} 150,94 144,92 Z`}
        fill="url(#wg)" />
      <path d={`M140,80 C158,${60 + w} 186,${38 + w} 216,${52 + w}`} stroke="#3a1a55" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d={`M140,80 C156,${65 + w} 180,${48 + w} 204,${60 + w}`} stroke="#3a1a55" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d={`M140,80 C152,${72 + w} 170,${64 + w} 188,${72 + w}`} stroke="#3a1a55" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d={`M216,${52 + w} C224,${44 + w} 225,${32 + w} 216,${27 + w} C209,${22 + w} 200,${30 + w} 204,${43 + w}`} fill="#080312" />

      {/* BODY */}
      <ellipse cx="110" cy="90" rx="11" ry="20" fill="#03010a" />
      {/* HEAD */}
      <ellipse cx="110" cy="68" rx="10.5" ry="10" fill="#03010a" />
      {/* EARS */}
      <path d="M101,62 C97,46 90,35 95,50 Z" fill="#03010a" />
      <path d="M119,62 C123,46 130,35 125,50 Z" fill="#03010a" />
      <path d="M101,62 C99,50 94,41 97,51 Z" fill="#1a052a" opacity="0.8" />
      <path d="M119,62 C121,50 126,41 123,51 Z" fill="#1a052a" opacity="0.8" />

      {/* EYES — glowing red */}
      <circle cx="104.5" cy="67" r="8" fill="url(#eg)" filter="url(#ef)" />
      <circle cx="115.5" cy="67" r="8" fill="url(#eg)" filter="url(#ef)" />
      <circle cx="104.5" cy="67" r="2.6" fill="#dd1100" />
      <circle cx="115.5" cy="67" r="2.6" fill="#dd1100" />
      <circle cx="104.5" cy="67" r="1.3" fill="#ff5500" />
      <circle cx="115.5" cy="67" r="1.3" fill="#ff5500" />
      <circle cx="103.8" cy="66.2" r="0.6" fill="white" opacity="0.9" />
      <circle cx="114.8" cy="66.2" r="0.6" fill="white" opacity="0.9" />

      {/* CLAWS */}
      <path d="M105,110 L102,119 M105,110 L105,120 M105,110 L108,119" stroke="#03010a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M115,110 L112,119 M115,110 L115,120 M115,110 L118,119" stroke="#03010a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Settled bat — hangs in place with gentle wing flap
function SettledBat({ size, top, left, rotate, opacity, delay = 0, zIndex = 22 }) {
  const [phase, setPhase] = useState(0);
  const raf = useRef(null);
  const t = useRef(delay);

  useEffect(() => {
    const loop = () => {
      t.current += 0.08;
      setPhase(Math.sin(t.current));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top,
      left,
      transform: `rotate(${rotate}deg)`,
      opacity,
      zIndex,
      pointerEvents: "none",
      filter: "drop-shadow(0 0 14px rgba(220,0,0,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.95))",
    }}>
      <BatSVG size={size} phase={phase} />
    </div>
  );
}

// Flying bat - arcs across screen from right to left with swooping motion
function FlyingBat({ top, size, dur, delay, startRight = "-150px", endLeft = "0px" }) {
  const [phase, setPhase] = useState(0);
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const loop = () => {
      t.current += 0.25;
      setPhase(Math.sin(t.current));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top,
      right: startRight,
      zIndex: 9999,
      pointerEvents: "none",
      animation: `bat-swoop-in ${dur}s cubic-bezier(0.25,0.8,0.45,1) ${delay}s forwards`,
      filter: "drop-shadow(0 0 18px rgba(220,0,0,0.55)) drop-shadow(0 0 6px rgba(0,0,0,1))",
    }}>
      <div style={{ transform: "scaleX(-1)" }}>
        <BatSVG size={size} phase={phase} />
      </div>
    </div>
  );
}

// Flying bat - exits scene flying from left back to right (for light mode switch)
function ExitBat({ top, size, dur, delay, startLeft = "0px" }) {
  const [phase, setPhase] = useState(0);
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const loop = () => {
      t.current += 0.25;
      setPhase(Math.sin(t.current));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top,
      left: startLeft,
      zIndex: 9999,
      pointerEvents: "none",
      animation: `bat-swoop-out ${dur}s cubic-bezier(0.4,0,0.6,1) ${delay}s forwards`,
      filter: "drop-shadow(0 0 18px rgba(220,0,0,0.55)) drop-shadow(0 0 6px rgba(0,0,0,1))",
    }}>
      <div style={{ transform: "scaleX(1)" }}>
        <BatSVG size={size} phase={phase} />
      </div>
    </div>
  );
}

export default function BatLayer() {
  const { theme } = useTheme();
  const prev = useRef(theme);
  const [flyingIn, setFlyingIn] = useState(false);
  const [flyingOut, setFlyingOut] = useState(false);
  const [settled, setSettled] = useState(theme === "dark");

  useEffect(() => {
    const from = prev.current;
    prev.current = theme;

    if (from === "light" && theme === "dark") {
      // light → dark: bats fly in from right and settle near "JI LEDGER"
      setSettled(false);
      setFlyingOut(false);
      setFlyingIn(true);
      setTimeout(() => {
        setFlyingIn(false);
        setSettled(true);
      }, 3500);
    }

    if (from === "dark" && theme === "light") {
      // dark → light: bats fly out back to right
      setSettled(false);
      setFlyingIn(false);
      setFlyingOut(true);
      setTimeout(() => {
        setFlyingOut(false);
      }, 2500);
    }
  }, [theme]);

  // Initial settle on dark mode
  useEffect(() => {
    if (theme === "dark") {
      setSettled(true);
    }
  }, []);

  return (
    <>
      {/* Bats flying IN from right (light → dark transition) */}
      {flyingIn && (
        <>
          <FlyingBat top="6%"  size={100} dur={2.8} delay={0} />
          <FlyingBat top="14%" size={78}  dur={3.2} delay={0.35} />
        </>
      )}

      {/* Bats flying OUT to right (dark → light transition) */}
      {flyingOut && (
        <>
          <ExitBat top="6%"  size={100} dur={2.0} delay={0} />
          <ExitBat top="14%" size={78}  dur={2.3} delay={0.2} />
        </>
      )}

      {/* Settled bats — hanging near "JI LEDGER" logo on dark mode */}
      {settled && theme === "dark" && (
        <>
          {/* Bat 1 — larger, positioned near right side of "JI LEDGER" text */}
          <SettledBat
            size={95}
            top="10px"
            left="calc(50% + 80px)"
            rotate={-18}
            opacity={0.92}
            delay={0}
            zIndex={22}
          />
          {/* Bat 2 — smaller, slightly lower and to the left */}
          <SettledBat
            size={70}
            top="50px"
            left="calc(50% + 180px)"
            rotate={12}
            opacity={0.75}
            delay={1.8}
            zIndex={21}
          />
        </>
      )}
    </>
  );
}