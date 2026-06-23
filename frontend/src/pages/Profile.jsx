import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, IdentificationBadge, Wallet, Briefcase, Crown, ShieldCheck, Envelope, Phone } from "@phosphor-icons/react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [kycStatus, setKycStatus] = useState("unverified");

  useEffect(() => {
    if (!user) return;
    api.get("/wallet/me")
      .then(({ data }) => setWallets(data.wallets || []))
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 md:p-12">
        <div className="label-mini">// PROFILE</div>
        <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Profile</h1>
        <div className="mt-8 panel p-8 text-center">
          <p className="text-zinc-500">Sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="label-mini">// MY PROFILE</div>
      <h1 className="font-display text-3xl md:text-5xl uppercase mt-2 text-[#FF4500] flex items-center gap-3">
        <User size={40} weight="bold" /> Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Personal Info */}
        <div className="panel lg:col-span-2">
          <div className="label-mini mb-6 flex items-center gap-2">
            <IdentificationBadge size={16} className="text-[#FF4500]" /> Account Details
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded">
              <div className="w-14 h-14 rounded-full bg-[#FF4500]/20 flex items-center justify-center text-[#FF4500] font-display text-2xl">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-display text-2xl">{user.username}</div>
                <div className="text-xs text-zinc-500 font-mono">Member since {new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-primary)] rounded">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <Envelope size={14} /> Email
                </div>
                <div className="font-mono text-sm">{user.email}</div>
              </div>
              <div className="p-4 bg-[var(--bg-primary)] rounded">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <Phone size={14} /> Phone
                </div>
                <div className="font-mono text-sm">{user.phone || "Not provided"}</div>
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-primary)] rounded">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <Wallet size={14} /> Wallet Address
              </div>
              <div className="font-mono text-sm text-[#FF4500] break-all">{user.wallet_address}</div>
            </div>
          </div>
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* KYC Status */}
          <div className="panel">
            <div className="label-mini mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FF4500]" /> KYC Status
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                kycStatus === "verified" ? "bg-green-500/20 text-green-400" :
                kycStatus === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-zinc-500/20 text-zinc-400"
              }`}>
                <ShieldCheck size={22} weight="fill" />
              </div>
              <div>
                <div className="font-display text-lg capitalize">{kycStatus}</div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {kycStatus === "verified" ? "Identity Confirmed" :
                   kycStatus === "pending" ? "Under Review" :
                   "Not Submitted"}
                </div>
              </div>
            </div>
            {kycStatus !== "verified" && (
              <button className="btn-primary w-full mt-4 text-xs py-2"
                onClick={() => setKycStatus("pending")}>
                Submit KYC
              </button>
            )}
          </div>

          {/* Subscription */}
          <div className="panel">
            <div className="label-mini mb-4 flex items-center gap-2">
              <Crown size={16} className="text-[#FF4500]" /> Subscription
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-500/20 flex items-center justify-center text-zinc-400">
                <Crown size={22} />
              </div>
              <div>
                <div className="font-display text-lg">Free Tier</div>
                <div className="text-[10px] text-zinc-500 font-mono">Basic features</div>
              </div>
            </div>
            <button className="btn-primary w-full mt-4 text-xs py-2">
              Upgrade to Premium — ₹99/mo
            </button>
          </div>

          {/* Wallets Summary */}
          <div className="panel">
            <div className="label-mini mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-[#FF4500]" /> Wallets
            </div>
            <div className="space-y-2">
              {wallets.map((w) => (
                <div key={w.id} className="flex justify-between items-center p-2 bg-[var(--bg-primary)] rounded">
                  <div className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">{w.address?.slice(0, 10)}...</div>
                  <div className="font-mono text-sm">{w.balance?.toFixed(2)} <span className="text-[10px] text-zinc-500">JI</span></div>
                </div>
              ))}
              {wallets.length === 0 && (
                <div className="text-xs text-zinc-500 font-mono">No wallets found</div>
              )}
            </div>
          </div>

          {/* Logout */}
          <button onClick={logout} className="w-full py-3 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 border border-red-500/30 rounded transition-all">
            Disconnect Wallet & Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}