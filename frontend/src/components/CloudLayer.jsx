import { useTheme } from "@/context/ThemeContext";

// Stars for dark mode
function Stars({ isDark }) {
  if (!isDark) return null;
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: 0.3 + (i % 6) * 0.3,
    delay: `${(i * 0.7) % 4}s`,
    dur: `${1.5 + (i % 5) * 0.6}s`,
    opacity: 0.2 + (i % 8) * 0.1,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 3 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:s.left, top:s.top,
          width:s.size+"px", height:s.size+"px", borderRadius:"50%",
          backgroundColor:"#fff", opacity:s.opacity,
          animation:`star-twinkle ${s.dur} ease-in-out ${s.delay} infinite alternate`,
          boxShadow:`0 0 ${s.size*4}px rgba(255,255,255,0.5)`,
        }} />
      ))}
    </div>
  );
}

// Realistic fluffy cloud using multiple radial gradients
function Cloud({ top, left, size = 1, speed = 1, delay = 0, dark = false }) {
  const w = 600 * size;
  const h = 200 * size;

  // Generate random cluster of cloud bubbles
  const bubbles = [
    { x: 10, y: 50, rx: 30, ry: 18 },
    { x: 25, y: 35, rx: 25, ry: 20 },
    { x: 40, y: 45, rx: 28, ry: 16 },
    { x: 55, y: 30, rx: 22, ry: 18 },
    { x: 70, y: 50, rx: 26, ry: 15 },
    { x: 85, y: 40, rx: 20, ry: 16 },
    { x: 15, y: 55, rx: 18, ry: 12 },
    { x: 50, y: 55, rx: 20, ry: 12 },
    { x: 80, y: 55, rx: 16, ry: 10 },
  ];

  const bgParts = bubbles.map((b, i) =>
    `radial-gradient(ellipse ${b.rx * size * 10}px ${b.ry * size * 10}px at ${b.x}% ${b.y}%, ${
      dark
        ? `rgba(60,65,85,${0.35 + i * 0.05}) 0%, rgba(35,38,55,${0.2 + i * 0.03}) 40%, transparent ${55 + i * 5}%`
        : `rgba(255,255,255,${0.4 + i * 0.06}) 0%, transparent ${50 + i * 5}%`
    })`
  ).join(",\n");

  return (
    <div
      style={{
        position: "absolute",
        top: top + "%",
        left: left + "%",
        width: w + "px",
        height: h + "px",
        background: bgParts,
        animation: `cloud-drift ${80 / speed}s linear ${delay}s infinite`,
        opacity: dark ? 0.35 : 0.75,
        willChange: "transform",
      }}
    />
  );
}

export default function CloudLayer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generate cloud positions spread across the sky
  const lightClouds = [
    { top: 5,  left: -10, size: 1.2, speed: 0.8, delay: 0 },
    { top: 12, left: 15,  size: 1.0, speed: 1.0, delay: -10 },
    { top: 8,  left: 40,  size: 1.3, speed: 0.7, delay: -20 },
    { top: 18, left: 60,  size: 1.1, speed: 0.9, delay: -15 },
    { top: 3,  left: 80,  size: 0.9, speed: 1.1, delay: -30 },
    { top: 22, left: -5,  size: 0.8, speed: 1.2, delay: -5 },
    { top: 10, left: 30,  size: 0.7, speed: 1.3, delay: -25 },
    { top: 15, left: 50,  size: 1.4, speed: 0.6, delay: -35 },
    { top: 6,  left: 70,  size: 0.6, speed: 1.4, delay: -8 },
    { top: 25, left: 85,  size: 1.0, speed: 0.9, delay: -12 },
    { top: 2,  left: 20,  size: 0.5, speed: 1.5, delay: -40 },
    { top: 20, left: 35,  size: 0.9, speed: 1.0, delay: -18 },
    { top: 14, left: 90,  size: 0.7, speed: 1.1, delay: -22 },
    { top: 8,  left: 55,  size: 1.1, speed: 0.8, delay: -28 },
    { top: 28, left: 10,  size: 0.6, speed: 1.3, delay: -14 },
  ];

  const darkClouds = [
    { top: 8,  left: -8,  size: 1.3, speed: 0.8, delay: 0 },
    { top: 15, left: 20,  size: 1.1, speed: 0.9, delay: -12 },
    { top: 5,  left: 45,  size: 1.4, speed: 0.7, delay: -25 },
    { top: 20, left: 65,  size: 1.0, speed: 1.0, delay: -18 },
    { top: 10, left: 85,  size: 1.2, speed: 0.8, delay: -30 },
    { top: 25, left: -3,  size: 0.9, speed: 1.1, delay: -8 },
    { top: 12, left: 35,  size: 1.0, speed: 0.9, delay: -20 },
    { top: 18, left: 55,  size: 1.1, speed: 0.8, delay: -15 },
    { top: 3,  left: 75,  size: 0.8, speed: 1.2, delay: -35 },
    { top: 28, left: 90,  size: 0.9, speed: 1.0, delay: -10 },
    { top: 7,  left: 10,  size: 0.7, speed: 1.2, delay: -22 },
    { top: 22, left: 40,  size: 1.2, speed: 0.7, delay: -28 },
  ];

  const clouds = isDark ? darkClouds : lightClouds;

  return (
    <div
      className="absolute left-0 right-0 top-0 pointer-events-none select-none"
      style={{ height: "100%", width: "100%", zIndex: 0, overflow: "hidden" }}
      aria-hidden
    >
      {/* Sky gradient - realistic photographic quality */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #02020a 0%, #050815 15%, #080c18 30%, #0c1020 50%, #101426 70%, #141830 100%)"
            : "linear-gradient(180deg, #3a7fc1 0%, #5a9fe0 12%, #78b8f0 25%, #96caf5 38%, #b2d8f8 50%, #cce4fa 62%, #e4eefc 75%, #f0f4ff 88%, #f8faff 100%)",
          transition: "background 1.5s ease",
        }}
      />

      {/* Render scattered clouds */}
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} dark={isDark} />
      ))}

      {/* Thin high-altitude wisps */}
      {!isDark && (
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "-10%",
            width: "120%",
            height: "40%",
            background: `
              radial-gradient(ellipse 800px 40px at 10% 30%, rgba(255,255,255,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 600px 30px at 40% 20%, rgba(255,255,255,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 700px 35px at 70% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)
            `,
            animation: "cloud-drift 150s linear -15s infinite",
            opacity: 0.7,
          }}
        />
      )}

      {/* Stars in dark mode */}
      <Stars isDark={isDark} />

      {/* Subtle moon glow in dark mode */}
      {isDark && (
        <div
          style={{
            position: "absolute",
            top: "6%",
            right: "18%",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,240,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Fade to page bg */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: "120px",
          background: "linear-gradient(transparent, var(--bg-primary))",
          transition: "background 0.5s ease",
        }}
      />
    </div>
  );
}