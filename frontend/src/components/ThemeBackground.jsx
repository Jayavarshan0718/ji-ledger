import { useEffect, useRef, useState } from "react";
import { CurrencyBtc, CurrencyEth, CurrencyDollar } from "@phosphor-icons/react";

/* ─── Mouse-follow crypto icons ─── */
const CURSOR_ICONS = [
  { Icon: CurrencyBtc,    color: "#f7931a", size: 28, offset: { x: -180, y: -100 }, lag: 0.06 },
  { Icon: CurrencyEth,    color: "#8c8cff", size: 22, offset: { x:  160, y: -140 }, lag: 0.09 },
  { Icon: CurrencyDollar, color: "#22c55e", size: 26, offset: { x:  200, y:   80 }, lag: 0.07 },
  { symbol: "₿",          color: "#f7931a", size: 18, offset: { x:  -60, y:  200 }, lag: 0.08 },
  { symbol: "Ξ",          color: "#8c8cff", size: 20, offset: { x: -240, y:   20 }, lag: 0.05 },
  { Icon: CurrencyBtc,    color: "#ff6b35", size: 18, offset: { x:  240, y:  -60 }, lag: 0.10 },
  { symbol: "◈",          color: "#FF4500", size: 16, offset: { x: -160, y:  140 }, lag: 0.04 },
  { Icon: CurrencyDollar, color: "#34d399", size: 20, offset: { x:  120, y: -260 }, lag: 0.07 },
];

function MouseIcons() {
  const posRef    = useRef(CURSOR_ICONS.map(() => ({ x: -400, y: -400 })));
  const targetRef = useRef({ x: -400, y: -400 });
  const rafRef    = useRef(null);
  const [pos, setPos] = useState(CURSOR_ICONS.map(() => ({ x: -400, y: -400 })));

  useEffect(() => {
    const onMove = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      let dirty = false;
      CURSOR_ICONS.forEach((item, i) => {
        const tx = targetRef.current.x + item.offset.x;
        const ty = targetRef.current.y + item.offset.y;
        const nx = posRef.current[i].x + (tx - posRef.current[i].x) * item.lag;
        const ny = posRef.current[i].y + (ty - posRef.current[i].y) * item.lag;
        if (Math.abs(nx - posRef.current[i].x) > 0.05 || Math.abs(ny - posRef.current[i].y) > 0.05) {
          posRef.current[i] = { x: nx, y: ny };
          dirty = true;
        }
      });
      if (dirty) setPos([...posRef.current]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {CURSOR_ICONS.map((item, i) => (
        <div key={i} style={{
          position: "fixed", left: pos[i].x, top: pos[i].y,
          transform: "translate(-50%,-50%)", willChange: "transform",
        }}>
          {item.Icon
            ? <item.Icon size={item.size} weight="fill" color={item.color}
                style={{ opacity: 0.75, filter: `drop-shadow(0 0 6px ${item.color}99)` }} />
            : <span style={{ fontSize: item.size, color: item.color, opacity: 0.75,
                textShadow: `0 0 8px ${item.color}99`, fontFamily: "monospace", fontWeight: "bold" }}>
                {item.symbol}
              </span>
          }
        </div>
      ))}
    </div>
  );
}

export default function ThemeBackground() {
  const [isLight, setIsLight] = useState(
    typeof window !== "undefined" && document.documentElement.classList.contains("light-mode")
  );

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains("light-mode"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <MouseIcons />

      {/* 
        This fills only the RIGHT half of the viewport — fixed, behind everything.
        Left half stays as the dark/light panel color from CSS variables.
        Exactly like Emergent.sh hero split.
      */}

      {/* ══ LIGHT MODE right-half sky ══ */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: "55%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: isLight ? 1 : 0,
        transition: "opacity 0.9s ease",
        overflow: "hidden",
      }}>
        {/* Sky gradient — bright blue top to white bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, #1565c0 0%, #1976d2 8%, #2196f3 18%, #42a5f5 30%, #64b5f6 44%, #90caf9 58%, #bbdefb 72%, #e3f2fd 86%, #f5fbff 100%)",
        }} />

        {/* Blend edge on the LEFT so it merges seamlessly with the dark panel */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: "120px", height: "100%",
          background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)",
          zIndex: 3,
        }} />

        {/* Sun — top right */}
        <div style={{
          position: "absolute", top: "5%", right: "8%",
          width: 100, height: 100,
          background: "radial-gradient(circle, rgba(255,240,80,0.9) 0%, rgba(255,220,50,0.6) 35%, rgba(255,200,30,0.2) 65%, transparent 100%)",
          borderRadius: "50%",
          boxShadow: "0 0 60px 30px rgba(255,230,80,0.22)",
          zIndex: 2,
        }} />

        {/* Large cloud blob — upper area */}
        <div style={{
          position: "absolute", top: "6%", left: "5%",
          width: "70%", height: "34%",
          background: "radial-gradient(ellipse at 45% 42%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 28%, rgba(220,238,255,0.55) 58%, transparent 100%)",
          borderRadius: "50%",
          filter: "blur(18px)",
          zIndex: 2,
        }} />

        {/* Medium cloud — middle right */}
        <div style={{
          position: "absolute", top: "26%", right: "2%",
          width: "55%", height: "28%",
          background: "radial-gradient(ellipse at 55% 38%, rgba(255,255,255,0.95) 0%, rgba(240,250,255,0.70) 40%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(16px)",
          zIndex: 2,
        }} />

        {/* Small cloud — center */}
        <div style={{
          position: "absolute", top: "18%", left: "30%",
          width: "42%", height: "22%",
          background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.90) 0%, rgba(230,245,255,0.55) 50%, transparent 85%)",
          borderRadius: "50%",
          filter: "blur(14px)",
          zIndex: 2,
        }} />

        {/* Bottom cloud haze */}
        <div style={{
          position: "absolute", bottom: "8%", left: "10%",
          width: "80%", height: "26%",
          background: "radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.80) 0%, rgba(220,240,255,0.45) 50%, transparent 85%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          zIndex: 2,
        }} />

        {/* Horizon fade to white at bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
          background: "linear-gradient(to top, rgba(245,251,255,0.85) 0%, transparent 100%)",
          zIndex: 3,
        }} />
      </div>

      {/* ══ DARK MODE right-half night sky ══ */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: "55%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: isLight ? 0 : 1,
        transition: "opacity 0.9s ease",
        overflow: "hidden",
      }}>
        {/* Deep night sky gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, #010204 0%, #02040a 10%, #030712 22%, #040a1a 36%, #060d20 52%, #080f24 68%, #0a1228 84%, #0c1530 100%)",
        }} />

        {/* Blend edge on the LEFT */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: "120px", height: "100%",
          background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)",
          zIndex: 3,
        }} />

        {/* Stars */}
        {Array.from({ length: 70 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left:  `${(i * 137 + 23) % 100}%`,
            top:   `${(i * 83  + 11) % 70}%`,
            width:  i % 7 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
            height: i % 7 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
            borderRadius: "50%",
            background: i % 9 === 0 ? "#fffde7" : i % 5 === 0 ? "#ddeeff" : "#ffffff",
            opacity: 0.35 + (i % 6) * 0.12,
            zIndex: 1,
          }} />
        ))}

        {/* Moon */}
        <div style={{
          position: "absolute", top: "5%", right: "9%",
          width: 70, height: 70,
          background: "radial-gradient(circle at 38% 38%, #fffde7 0%, #fff9c4 50%, #f5e680 100%)",
          borderRadius: "50%",
          boxShadow: "0 0 35px 14px rgba(255,245,140,0.18), 0 0 80px 40px rgba(255,235,80,0.07)",
          zIndex: 2,
        }} />
        {/* Crescent shadow */}
        <div style={{
          position: "absolute", top: "4.4%", right: "8.1%",
          width: 70, height: 70,
          background: "radial-gradient(circle at 64% 38%, #020408 0%, #020408 42%, transparent 60%)",
          borderRadius: "50%",
          zIndex: 2,
        }} />

        {/* Dark cloud blob — upper left of sky panel */}
        <div style={{
          position: "absolute", top: "4%", left: "2%",
          width: "68%", height: "36%",
          background: "radial-gradient(ellipse at 42% 40%, rgba(16,22,48,0.92) 0%, rgba(10,14,36,0.72) 38%, transparent 75%)",
          borderRadius: "50%",
          filter: "blur(22px)",
          zIndex: 2,
        }} />

        {/* Dark cloud — middle */}
        <div style={{
          position: "absolute", top: "30%", right: "4%",
          width: "55%", height: "28%",
          background: "radial-gradient(ellipse at 55% 45%, rgba(14,18,44,0.88) 0%, rgba(8,12,30,0.58) 45%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(18px)",
          zIndex: 2,
        }} />

        {/* Dark cloud — lower */}
        <div style={{
          position: "absolute", bottom: "10%", left: "8%",
          width: "72%", height: "30%",
          background: "radial-gradient(ellipse at 48% 55%, rgba(12,16,40,0.85) 0%, rgba(6,10,26,0.55) 50%, transparent 85%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          zIndex: 2,
        }} />

        {/* Subtle blue nebula glow */}
        <div style={{
          position: "absolute", top: "25%", left: "25%",
          width: "50%", height: "40%",
          background: "radial-gradient(ellipse, rgba(30,50,120,0.10) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(35px)",
          zIndex: 1,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "22%",
          background: "linear-gradient(to top, rgba(2,4,8,0.90) 0%, transparent 100%)",
          zIndex: 3,
        }} />
      </div>
    </>
  );
}
