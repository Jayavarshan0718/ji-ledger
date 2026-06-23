import React from 'react';
import { DotsThreeOutlineVertical, Book, Bridge, Globe, Code } from '@phosphor-icons/react';

export default function MorePage() {
    const links = [
        { t: "Bridge", d: "Transfer assets across chains", icon: Bridge },
        { t: "API Docs", d: "Build on Ji Ledger", icon: Code },
        { t: "Status", d: "Real-time network monitoring", icon: Globe },
        { t: "Whitepaper", d: "Protocol specifications", icon: Book },
    ];

    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// ECOSYSTEM HUB</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500] flex items-center gap-4">
                <DotsThreeOutlineVertical size={48} weight="bold" /> More
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {links.map(link => (
                    <div key={link.t} className="panel p-8 bg-[var(--bg-panel)] group hover:bg-[var(--bg-panel)]/50 transition-all cursor-pointer border-[var(--border-color)] hover:border-[#FF4500]">
                        <link.icon size={40} className="text-[#FF4500] mb-6 group-hover:scale-110 transition-transform" /> {/* Added key for list rendering */}
                        <div className="font-display text-2xl uppercase mb-2">{link.t}</div>
                        <p className="text-zinc-500 text-xs leading-relaxed">{link.d}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 panel p-8 border-dashed flex flex-col items-center justify-center text-center">
                <div className="text-[#FF4500] font-display text-3xl mb-2 tracking-widest">BECOME A VALIDATOR</div>
                <p className="text-zinc-500 max-w-lg text-sm mb-6">
                    Join the decentralized backbone of Ji Ledger. Node registration opens in the next epoch.
                </p>
                <button className="btn-ghost">Read Requirements</button>
            </div>
        </div>
    );
}