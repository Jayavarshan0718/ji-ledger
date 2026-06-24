import { useTheme } from "@/context/ThemeContext";

// These are large billowing cloud shapes — multiple overlapping ellipse clusters
// positioned to fill the header background like a dramatic sky scene
const CLOUD_GROUPS = [
  // Far back layer — huge spans full width
  {
    bubbles: [
      { cx: 80,  cy: 90, rx: 90,  ry: 55 },
      { cx: 160, cy: 70, rx: 80,  ry: 65 },
      { cx: 240, cy: 85, rx: 85,  ry: 50 },
      { cx: 310, cy: 65, rx: 75,  ry: 60 },
      { cx: 380, cy: 80, rx: 80,  ry: 55 },
      { cx: 450, cy: 70, rx: 70,  ry: 60 },
      { cx: 510, cy: 88, rx: 65,  ry: 48 },
    ],
    dur: 90, delay: 0, startX: "-10%", depth: 0,
  },
  // Mid layer — left cluster
  {
    bubbles: [
      { cx: 60,  cy: 80, rx: 70,  ry: 52 },
      { cx: 130, cy: 58, rx: 65,  ry: 58 },
      { cx: 195, cy: 72, rx: 72,  ry: 50 },
      { cx: 260, cy: 55, rx: 68,  ry: 56 },
      { cx: 320, cy: 75, rx: 62,  ry: 48 },
    ],
    dur: 70, delay: -25, startX: "-5%", depth: 1,
  },
  // Mid layer — right cluster
  {
    bubbles: [
      { cx: 50,  cy: 72, rx: 65,  ry: 55 },
      { cx: 115, cy: 50, rx: 70,  ry: 60 },
      { cx: 185, cy: 68, rx: 68,  ry: 52 },
      { cx: 250, cy: 48, rx: 65,  ry: 58 },
      { cx: 310, cy: 70, rx: 60,  ry: 50 },
      { cx: 365, cy: 52, rx: 62,  ry: 55 },
    ],
    dur: 80, delay: -45, startX: "45%", depth: 1,
  },
  // Foreground — smaller sharp puffs left
  {
    bubbles: [
      { cx: 40,  cy: 85, rx: 50,  ry: 42 },
      { cx: 90,  cy: 62, rx: 55,  ry: 50 },
      { cx: 145, cy: 78, rx: 52,  ry: 44 },
      { cx: 195, cy: 58, rx: 50,  ry: 48 },
    ],
    dur: 55, delay: -15, startX: "-8%", depth: 2,
  },
  // Foreground — smaller puffs right
  {
    bubbles: [
      { cx: 40,  cy: 80, rx: 48,  ry: 40 },
      { cx: 88,  cy: 58, rx: 52,  ry: 48 },
      { cx: 140, cy: 74, rx: 50,  ry: 42 },
      { cx: 188, cy: 56, rx: 48,  ry: 46 },
      { cx: 235, cy: 72, rx: 45,  ry: 40 },
    ],
    dur: 60, delay: -35, startX: "60%", depth: 2,
  },
];

function CloudGroup({ group, isDark }) {
  const maxCx = Math.max(...group.bubbles.map(b => b.cx + b.rx));
  const maxCy = Math.max(...group.bubbles.map(b => b.cy + b.ry));

  // depth 0 = furthest back (most transparent, blurry)
  // depth 2 = closest (most opaque, sharp)
  const depthAlpha = [0.45, 0.62, 0.80][group.depth];
  const depthBlur  = [4, 2, 0.5][group.depth];

  let fill, shadow;
  if (isDark) {
    // Dark storm clouds: near-black with cold blue-grey tint, lighter on top edges
    const base = [12, 14, 22];
    const bright = [28, 32, 48];
    fill = `url(#dark-cloud-${group.depth})`;
    shadow = "rgba(0,0,10,0.7)";
  } else {
    // Light sky clouds: white to pale sky-blue
    fill = `url(#light-cloud-${group.depth})`;
    shadow = "rgba(150,200,255,0.3)";
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: group.startX,
        animation: `cloud-drift ${group.dur}s linear ${group.delay}s infinite`,
        willChange: "transform",
        filter: `blur(${depthBlur}px) drop-shadow(0 6px 20px ${shadow})`,
        opacity: depthAlpha,
      }}
    >
      <svg
        width={maxCx + 20}
        height={maxCy + 10}
        viewBox={`0 0 ${maxCx + 20} ${maxCy + 10}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Dark cloud gradient: lit top edge, dark body */}
          <radialGradient id={`dark-cloud-${group.depth}`} cx="50%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#3a3f5a" />
            <stop offset="40%"  stopColor="#1a1e30" />
            <stop offset="100%" stopColor="#080a14" />
          </radialGradient>
          {/* Light cloud gradient: bright white top, soft blue bottom */}
          <radialGradient id={`light-cloud-${group.depth}`} cx="50%" cy="25%" r="65%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="45%"  stopColor="#e8f3ff" />
            <stop offset="100%" stopColor="#c5dff8" />
          </radialGradient>
        </defs>
        {group.bubbles.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={isDark ? `url(#dark-cloud-${group.depth})` : `url(#light-cloud-${group.depth})`}
          />
        ))}
      </svg>
    </div>
  );
}

export default function CloudLayer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="absolute left-0 right-0 top-0 pointer-events-none select-none"
      style={{ height: "260px", zIndex: 1, overflow: "hidden" }}
      aria-hidden
    >
      {/* Sky tone behind clouds */}
      <div style={{
        position: "absolute", inset: 0,
        background: isDark
          ? "linear-gradient(180deg, #02020a 0%, #06080f 70%, transparent 100%)"
          : "linear-gradient(180deg, #a8ccf0 0%, #c8e2fa 65%, transparent 100%)",
        transition: "background 1s ease",
      }} />

      {CLOUD_GROUPS.map((g, i) => (
        <CloudGroup key={i} group={g} isDark={isDark} />
      ))}

      {/* Fade clouds into page at bottom */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "80px",
        background: isDark
          ? "linear-gradient(transparent, #050505)"
          : "linear-gradient(transparent, #f0f4ff)",
        transition: "background 1s ease",
      }} />
    </div>
  );
}
