import React from 'react';

export default function FinancialModule({ title, icon: Icon }) {
    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// FINANCIAL ENGINE</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 flex items-center gap-4">
                <Icon size={48} className="text-[#FF4500]" /> {title}
            </h1>
            <div className="panel mt-10 h-64 flex flex-col items-center justify-center border-dashed">
                <div className="text-zinc-500 font-mono animate-pulse">ESTABLISHING SECURE CONNECTION TO LIQUIDITY POOLS...</div>
            </div>
        </div>
    );
}