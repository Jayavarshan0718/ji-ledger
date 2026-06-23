import { useState, useEffect } from "react";
import { Wallet, CheckCircle } from "@phosphor-icons/react";
import { hasMetaMask } from "@/lib/web3";
import { toast } from "sonner";

export default function ConnectWallet() {
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (hasMetaMask()) {
            window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
                if (accounts.length > 0) setAddress(accounts[0]);
            });

            window.ethereum.on("accountsChanged", (accounts) => {
                setAddress(accounts[0] || "");
            });
        }
    }, []);

    const connect = async () => {
        if (!hasMetaMask()) {
            toast.error("MetaMask not detected. Install it at metamask.io");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAddress(accounts[0]);
        } catch (err) {
            toast.error("Connection failed");
        }
    };

    return (
        <button
            onClick={connect}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[10px] border transition-colors ${address ? "bg-[var(--bg-panel)] border-[var(--border-color)] text-green-400" : "bg-[var(--bg-panel)] border-[var(--border-color)] hover:bg-[var(--bg-panel)]/50 text-[var(--text-primary)] hover:text-[#FF4500]"}`}
        >
            {address ? <CheckCircle size={14} weight="fill" /> : <Wallet size={14} />}
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect MetaMask"}
        </button>
    );
}