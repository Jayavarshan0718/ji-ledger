import { useTheme } from "@/context/ThemeContext";

/**
 * Full-screen home-page background that mimics emergent.sh:
 *  - Light mode: bright blue sky with soft drifting white clouds
 *  - Dark mode : dark misty/smoky animated atmosphere
 *
 * Mounted only inside <Landing/> so it never appears on other pages.
 * Sits behind all content (fixed inset:0, z:0) and is pointer-events:none.
 */
export default function EmergentHomeBackground() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <div
            aria-hidden
            data-testid="emergent-home-bg"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            {/* ─── LIGHT MODE: blue sky + white clouds ─── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: isLight ? 1 : 0,
                    transition: "opacity 1s ease",
                }}
            >
                {/* Sky gradient */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, #4a9fe0 0%, #6cb3ed 18%, #8cc6f3 38%, #b3dbf8 60%, #d6ecfc 82%, #eef7ff 100%)",
                    }}
                />

                {/* Soft sun glow top-right */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-8%",
                        width: "55vw",
                        height: "55vw",
                        background:
                            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 35%, transparent 70%)",
                        filter: "blur(8px)",
                    }}
                />

                {/* Drifting cloud layers */}
                <div className="emg-clouds-light emg-cloud-layer-1" />
                <div className="emg-clouds-light emg-cloud-layer-2" />
                <div className="emg-clouds-light emg-cloud-layer-3" />

                {/* Bottom soft white horizon */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "30%",
                        background:
                            "linear-gradient(to top, rgba(255,255,255,0.55) 0%, transparent 100%)",
                    }}
                />
            </div>

            {/* ─── DARK MODE: dark smoky / misty atmosphere ─── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: isLight ? 0 : 1,
                    transition: "opacity 1s ease",
                }}
            >
                {/* Deep dark base */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at 50% 40%, #14141a 0%, #0a0a10 40%, #050507 75%, #020203 100%)",
                    }}
                />

                {/* Animated dark smoky layers */}
                <div className="emg-smoke emg-smoke-1" />
                <div className="emg-smoke emg-smoke-2" />
                <div className="emg-smoke emg-smoke-3" />

                {/* Subtle vignette */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
                    }}
                />

                {/* Faint star/particle dust */}
                {Array.from({ length: 40 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${(i * 137 + 23) % 100}%`,
                            top: `${(i * 83 + 11) % 100}%`,
                            width: i % 7 === 0 ? 2 : 1.2,
                            height: i % 7 === 0 ? 2 : 1.2,
                            borderRadius: "50%",
                            background: "#ffffff",
                            opacity: 0.15 + (i % 5) * 0.05,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}