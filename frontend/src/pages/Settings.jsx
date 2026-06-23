import { useState, useEffect } from "react";
import { Moon, Sun, Palette, Bell, ShieldCheck, Globe, Key } from "@phosphor-icons/react";

export default function SettingsPage() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "light") {
            root.classList.add("light-mode");
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-panel', '#f4f4f5');
            root.style.setProperty('--text-primary', '#000000');
            document.body.style.backgroundColor = "#ffffff";
            document.body.style.color = "#000000";
        } else {
            root.classList.remove("light-mode");
            root.style.setProperty('--bg-primary', '#050505');
            root.style.setProperty('--bg-panel', '#0A0A0A');
            root.style.setProperty('--text-primary', '#ffffff');
            document.body.style.backgroundColor = "#050505";
            document.body.style.color = "#ffffff";
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// CONFIGURATION</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Settings</h1>

            <div className="mt-10 max-w-2xl space-y-6">
                <div className="panel flex items-center justify-between text-[var(--text-primary)]">
                    <div className="flex items-center gap-4">
                        <Palette size={24} className="text-[#FF4500]" />
                        <div>
                            <div className="font-bold uppercase tracking-wider">Appearance</div>
                            <div className="text-xs text-zinc-500">Toggle between Dark and Light protocol UI</div>
                        </div>
                    </div>
                    <div className="flex bg-[var(--bg-primary)]/10 p-1 rounded-md border border-[var(--border-color)]">
                        <button
                            onClick={() => setTheme("dark")}
                            className={`p-2 rounded ${theme === "dark" ? "bg-[#FF4500] text-black" : "text-zinc-500"}`}
                        >
                            <Moon size={20} />
                        </button>
                        <button
                            onClick={() => setTheme("light")}
                            className={`p-2 rounded ${theme === "light" ? "bg-[#FF4500] text-black" : "text-zinc-500"}`}
                        >
                            <Sun size={20} />
                        </button>
                    </div>
                </div>

                <div className="panel flex items-center justify-between text-[var(--text-primary)]">
                    <div className="flex items-center gap-4">
                        <Globe size={24} className="text-[#FF4500]" />
                        <div>
                            <div className="font-bold uppercase tracking-wider">Network RPC</div>
                            <div className="text-xs text-zinc-500">Ji Ledger Mainnet (Local Node)</div>
                        </div>
                    </div>
                    <div className="text-green-500 font-mono text-xs">CONNECTED</div>
                </div>

                <div className="panel flex items-center gap-4 group cursor-pointer hover:border-[#FF4500] transition-colors text-[var(--text-primary)]">
                    <Key size={24} className="text-zinc-500 group-hover:text-[#FF4500]" />
                    <div>
                        <div className="font-bold uppercase tracking-wider">API Access</div>
                        <div className="text-xs text-zinc-500">Generate keys to integrate with external dApps</div>
                    </div>
                </div>

                <div className="panel flex items-center gap-4 opacity-50 border-dashed text-[var(--text-primary)]">
                    <ShieldCheck size={24} className="text-green-500" />
                    <div>
                        <div className="font-bold uppercase tracking-wider">Security</div>
                        <div className="text-xs text-zinc-500">Wallet signing is currently active via MetaMask</div>
                    </div>
                </div>
            </div>
        </div>
    );
}