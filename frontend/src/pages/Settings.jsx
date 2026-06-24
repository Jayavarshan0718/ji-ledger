import { useState, useEffect } from "react";
import { Moon, Sun, Palette, ShieldCheck, Globe, Key, Copy, ArrowClockwise, Eye, EyeSlash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

function generateKey() {
    return 'ji_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}

function ApiAccess() {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('ji_api_key') || '');
    const [visible, setVisible] = useState(false);

    const generate = () => {
        const key = generateKey();
        setApiKey(key);
        localStorage.setItem('ji_api_key', key);
        toast.success('New API key generated');
    };

    const copy = () => {
        navigator.clipboard.writeText(apiKey);
        toast.success('API key copied to clipboard');
    };

    return (
        <div className="panel p-6 space-y-4 text-[var(--text-primary)]">
            <div className="flex items-center gap-4">
                <Key size={24} className="text-[#FF4500]" />
                <div>
                    <div className="font-bold uppercase tracking-wider">API Access</div>
                    <div className="text-xs text-zinc-500">Generate keys to integrate with external dApps</div>
                </div>
            </div>

            {apiKey ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-2 font-mono text-xs">
                        <span className="flex-1 truncate text-[#FF4500]">
                            {visible ? apiKey : apiKey.slice(0, 6) + '••••••••••••••••••••••••••••••••••••••••'}
                        </span>
                        <button onClick={() => setVisible(!visible)} className="text-zinc-500 hover:text-white">
                            {visible ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={copy} className="text-zinc-500 hover:text-[#FF4500]">
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className="text-xs text-zinc-600 font-mono">Base URL: <span className="text-zinc-400">http://127.0.0.1:8000</span></div>
                    <div className="text-xs text-zinc-600 font-mono">Usage: <span className="text-zinc-400">Authorization: Bearer {visible ? apiKey : '••••••'}</span></div>
                    <button onClick={generate} className="btn-ghost text-xs flex items-center gap-2">
                        <ArrowClockwise size={14} /> Regenerate Key
                    </button>
                </div>
            ) : (
                <button onClick={generate} className="btn-primary w-full">Generate API Key</button>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

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

                <ApiAccess />

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