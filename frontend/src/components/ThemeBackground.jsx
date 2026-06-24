import { useEffect, useState } from "react";

// Realistic bat SVG path (anatomically accurate bat with wings spread)
function RealisticBat({ size = 80, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 200 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      {/* Body */}
      <ellipse cx="100" cy="62" rx="12" ry="18" fill="#1a1a2e" />
      {/* Head */}
      <ellipse cx="100" cy="44" rx="9" ry="10" fill="#1a1a2e" />
      {/* Ears */}
      <polygon points="93,36 88,20 97,34" fill="#1a1a2e" />
      <polygon points="107,36 112,20 103,34" fill="#1a1a2e" />
      {/* Eyes */}
      <circle cx="96" cy="43" r="2.5" fill="#ff2200" />
      <circle cx="104" cy="43" r="2.5" fill="#ff2200" />
      <circle cx="96.8" cy="42.5" r="0.8" fill="#ff6644" />
      <circle cx="104.8" cy="42.5" r="0.8" fill="#ff6644" />
      {/* Left wing — main membrane */}
      <path
        d="M92,60 C80,55 55,40 30,20 C15,10 5,15 2,25 C8,22 18,28 28,38 C10,32 2,42 5,52 C12,46 25,50 38,58 C22,56 15,66 20,75 C28,68 42,68 55,72 C45,74 42,82 48,88 C55,80 65,76 75,76 L88,72 Z"
        fill="#1a1a2e"
        stroke="#2d2d4e"
        strokeWidth="0.5"
      />
      {/* Left wing finger bones */}
      <line x1="92" y1="60" x2="30" y2="20" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="90" y1="63" x2="5" y2="52" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="88" y1="68" x2="20" y2="75" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="88" y1="72" x2="48" y2="88" stroke="#2d2d4e" strokeWidth="1" />
      {/* Right wing — main membrane */}
      <path
        d="M108,60 C120,55 145,40 170,20 C185,10 195,15 198,25 C192,22 182,28 172,38 C190,32 198,42 195,52 C188,46 175,50 162,58 C178,56 185,66 180,75 C172,68 158,68 145,72 C155,74 158,82 152,88 C145,80 135,76 125,76 L112,72 Z"
        fill="#1a1a2e"
        stroke="#2d2d4e"
        strokeWidth="0.5"
      />
      {/* Right wing finger bones */}
      <line x1="108" y1="60" x2="170" y2="20" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="110" y1="63" x2="195" y2="52" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="112" y1="68" x2="180" y2="75" stroke="#2d2d4e" strokeWidth="1" />
      <line x1="112" y1="72" x2="152" y2="88" stroke="#2d2d4e" strokeWidth="1" />
      {/* Legs / tail membrane */}
      <path d="M96,80 C94,90 90,100 88,106 L100,95 L112,106 C110,100 106,90 104,80 Z" fill="#1a1a2e" />
    </svg>
  );
}

const BATS = [
  { id: 1, top: "8%",  size: 90,  duration: "14s", delay: "0s",    swoop: -12, amplitude: 18 },
  { id: 2, top: "22%", size: 65,  duration: "18s", delay: "3s",    swoop:  8,  amplitude: 22 },
  { id: 3, top: "15%", size: 110, duration: "11s", delay: "6s",    swoop: -18, amplitude: 14 },
  { id: 4, top: "40%", size: 55,  duration: "22s", delay: "1.5s",  swoop:  14, amplitude: 26 },
  { id: 5, top: "60%", size: 80,  duration: "16s", delay: "9s",    swoop: -10, amplitude: 20 },
  { id: 6, top: "30%", size: 45,  duration: "25s", delay: "4s",    swoop:  20, amplitude: 30 },
  { id: 7, top: "70%", size: 70,  duration: "13s", delay: "7s",    swoop: -22, amplitude: 16 },
  { id: 8, top: "50%", size: 95,  duration: "19s", delay: "11s",   swoop:  6,  amplitude: 24 },
];

const CLOUDS = [
  { id: 1, top: "8%",  width: 260, duration: "28s", delay: "0s",   opacity: 0.92 },
  { id: 2, top: "18%", width: 180, duration: "38s", delay: "5s",   opacity: 0.85 },
  { id: 3, top: "5%",  width: 320, duration: "22s", delay: "10s",  opacity: 0.88 },
  { id: 4, top: "28%", width: 200, duration: "45s", delay: "2s",   opacity: 0.80 },
  { id: 5, top: "35%", width: 150, duration: "32s", delay: "15s",  opacity: 0.90 },
  { id: 6, top: "12%", width: 280, duration: "26s", delay: "8s",   opacity: 0.87 },
];

function Cloud({ top, width, duration, delay, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "-320px",
        width,
        animation: `cloud-move ${duration} linear ${delay} infinite`,
        opacity,
        filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.4))",
      }}
    >
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" width={width}>
        <ellipse cx="100" cy="58" rx="90" ry="26" fill="white" />
        <ellipse cx="70"  cy="46" rx="50" ry="34" fill="white" />
        <ellipse cx="130" cy="48" rx="44" ry="30" fill="white" />
        <ellipse cx="100" cy="38" rx="36" ry="30" fill="white" />
        <ellipse cx="80"  cy="32" rx="28" ry="22" fill="white" />
        <ellipse cx="118" cy="30" rx="24" ry="20" fill="white" />
        {/* Cloud shadow/depth */}
        <ellipse cx="100" cy="62" rx="85" ry="14" fill="rgba(200,215,255,0.5)" />
      </svg>
    </div>
  );
}

export default function ThemeBackground() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("light-mode") ? "light" : "dark"
      : "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("light-mode") ? "light" : "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === "light";

  return (
    <>
      <style>{`
        @keyframes cloud-move {
          0%   { transform: translateX(0); }
          100% { transform: translateX(110vw); }
        }
        @keyframes bat-fly {
          0%   { transform: translateX(110vw) translateY(0px) scaleX(1); }
          25%  { transform: translateX(75vw)  translateY(var(--swoop-up)) scaleX(1); }
          50%  { transform: translateX(50vw)  translateY(0px) scaleX(1); }
          75%  { transform: translateX(25vw)  translateY(var(--swoop-down)) scaleX(1); }
          100% { transform: translateX(-15vw) translateY(0px) scaleX(1); }
        }
        @keyframes bat-wing-flap {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.7); }
        }
        @keyframes theme-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── LIGHT MODE: Blue sky + white clouds ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: isLight ? 1 : 0,
          transition: "opacity 0.8s ease",
          overflow: "hidden",
        }}
      >
        {/* Real background image — right half */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/bg-light.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.45,
          }}
        />
        {/* Blue sky gradient — left half */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #87CEEB 0%, #b0d8f0 30%, #d4eeff 55%, rgba(212,238,255,0) 100%)",
            opacity: 0.75,
          }}
        />
        {/* Animated white clouds */}
        {CLOUDS.map((c) => (
          <Cloud key={c.id} {...c} />
        ))}
        {/* Sun glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(255,230,100,0.55) 0%, rgba(255,200,50,0.2) 50%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── DARK MODE: Dark sky + realistic bats ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: isLight ? 0 : 1,
          transition: "opacity 0.8s ease",
          overflow: "hidden",
        }}
      >
        {/* Real dark background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/bg-dark.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
        {/* Dark sky gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #050510 100%)",
            opacity: 0.6,
          }}
        />
        {/* Moon glow */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "10%",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(220,220,180,0.3) 0%, rgba(180,180,140,0.12) 50%, transparent 70%)",
            borderRadius: "50%",
            boxShadow: "0 0 60px 20px rgba(220,220,180,0.08)",
          }}
        />
        {/* Realistic flying bats */}
        {BATS.map((bat) => (
          <div
            key={bat.id}
            style={{
              position: "absolute",
              top: bat.top,
              right: 0,
              "--swoop-up":   `${-bat.amplitude}px`,
              "--swoop-down": `${bat.amplitude}px`,
              animation: `bat-fly ${bat.duration} linear ${bat.delay} infinite`,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
            }}
          >
            <div
              style={{
                animation: `bat-wing-flap ${parseFloat(bat.duration) * 0.08}s ease-in-out infinite`,
              }}
            >
              <RealisticBat size={bat.size} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
