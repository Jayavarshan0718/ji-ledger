import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

function BatSVG({ size = 100, phase = 0 }) {
  const w = phase * 20; // wing vertical offset
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e0a30" />
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
      <path d={`M80,82 C60,${70+w} 36,${50+w} 10,${58+w} C2,${62+w} 0,${72+w} 6,${80+w} C14,${88+w} 30,${85+w} 44,${88+w} C58,${92+w} 70,94 76,92 Z`}
        fill="url(#wg)" />
      <path d={`M80,80 C62,${60+w} 34,${38+w} 4,${52+w}`} stroke="#2a0e40" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path d={`M80,80 C64,${65+w} 40,${48+w} 16,${60+w}`} stroke="#2a0e40" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d={`M80,80 C68,${72+w} 50,${64+w} 32,${72+w}`} stroke="#2a0e40" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* left tip claw */}
      <path d={`M4,${52+w} C-4,${44+w} -5,${32+w} 4,${27+w} C11,${22+w} 20,${30+w} 16,${43+w}`} fill="#080312" />

      {/* RIGHT WING */}
      <path d={`M140,82 C160,${70+w} 184,${50+w} 210,${58+w} C218,${62+w} 220,${72+w} 214,${80+w} C206,${88+w} 190,${85+w} 176,${88+w} C162,${92+w} 150,94 144,92 Z`}
        fill="url(#wg)" />
      <path d={`M140,80 C158,${60+w} 186,${38+w} 216,${52+w}`} stroke="#2a0e40" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path d={`M140,80 C156,${65+w} 180,${48+w} 204,${60+w}`} stroke="#2a0e40" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d={`M140,80 C152,${72+w} 170,${64+w} 188,${72+w}`} stroke="#2a0e40" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* right tip claw */}
      <path d={`M216,${52+w} C224,${44+w} 225,${32+w} 216,${27+w} C209,${22+w} 200,${30+w} 204,${43+w}`} fill="#080312" />

      {/* BODY */}
      <ellipse cx="110" cy="90" rx="11" ry="20" fill="#03010a" />
      {/* HEAD */}
      <ellipse cx="110" cy="68" rx="10.5" ry="10" fill="#03010a" />
      {/* EARS */}
      <path d="M101,62 C97,46 90,35 95,50 Z" fill="#03010a" />
      <path d="M119,62 C123,46 130,35 125,50 Z" fill="#03010a" />
      <path d="M101,62 C99,50 94,41 97,51 Z" fill="#1a052a" opacity="0.8" />
      <path d="M119,62 C121,50 126,41 123,51 Z" fill="#1a052a" opacity="0.8" />

      {/* EYES — glowing red halo + bright center */}
      <circle cx="104.5" cy="67" r="8" fill="url(#eg)" filter="url(#ef)" />
      <circle cx="115.5" cy="67" r="8" fill="url(#eg)" filter="url(#ef)" />
      <circle cx="104.5" cy="67" r="2.6" fill="#dd1100" />
      <circle cx="115.5" cy="67" r="2.6" fill="#dd1100" />
      <circle cx="104.5" cy="67" r="1.3" fill="#ff5500" />
      <circle cx="115.5" cy="67" r="1.3" fill="#ff5500" />
      <circle cx="103.8" cy="66.2" r="0.6" fill="white" opacity="0.9" />
      <circle cx="114.8" cy="66.2" r="0.6" fill="white" opacity="0.9" />

      {/* CLAWS */}
      <path d="M105,110 L102,119 M105,110 L105,120 M105,110 L108,119" stroke="#03010a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M115,110 L112,119 M115,110 L115,120 M115,110 L118,119" stroke="#03010a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Settled bat with live wing flap
function SettledBat({ size, top, left, rotate, opacity, delay = 0 }) {
  const [phase, setPhase] = useState(0);
  const raf = useRef(null);
  const t = useRef(delay);

  useEffect(() => {
    const loop = () => {
      t.current += 0.13;
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
      zIndex: 22,
      pointerEvents: "none",
      filter: "drop-shadow(0 0 14px rgba(220,0,0,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.95))",
    }}>
      <BatSVG size={size} phase={phase} />
    </div>
  );
}

// Flying bat — swoops from right across to left
function FlyingBat({ top, size, dur, delay }) {
  const [phase, setPhase] = useState(0);
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const loop = () => { t.current += 0.2; setPhase(Math.sin(t.current)); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top,
      right: "-150px",
      zIndex: 9999,
      pointerEvents: "none",
      animation: `bat-swoop-in ${dur}s cubic-bezier(0.3,0.8,0.5,1) ${delay}s forwards`,
      filter: "drop-shadow(0 0 18px rgba(220,0,0,0.55)) drop-shadow(0 0 6px rgba(0,0,0,1))",
    }}>
      <div style={{ transform: "scaleX(-1)" }}>
        <BatSVG size={size} phase={phase} />
      </div>
    </div>
  );
}

export default function BatLayer() {
  const { theme } = useTheme();
  const prev = useRef(theme);
  const [flying, setFlying] = useState(false);
  const [settled, setSettled] = useState(theme === "dark");

  useEffect(() => {
    const from = prev.current;
    prev.current = theme;

    if (from === "light" && theme === "dark") {
      // light → dark: bats fly in then settle
      setSettled(false);
      setFlying(true);
      setTimeout(() => { setFlying(false); setSettled(true); }, 4000);
    }
    if (from === "dark" && theme === "light") {
      // dark → light: bats disappear
      setFlying(false);
      setSettled(false);
    }
  }, [theme]);

  return (
    <>
      {flying && (
        <>
          <FlyingBat top="7%"  size={96} dur={2.8} delay={0}   />
          <FlyingBat top="16%" size={74} dur={3.1} delay={0.28} />
        </>
      )}
      {settled && theme === "dark" && (
        <>
          {/* Bat 1 — larger, right side of logo text */}
          <SettledBat size={90}  top="12px" left="220px" rotate={-15} opacity={0.93} delay={0} />
          {/* Bat 2 — smaller, slightly behind/below */}
          <SettledBat size={66}  top="44px" left="298px" rotate={14}  opacity={0.78} delay={1.5} />
        </>
      )}
    </>
  );
}
