import { NavLink, useNavigate } from "react-router-dom";
import {
  Cube,
  Coins,
  Image,
  Package,
  Scales,
  Wallet,
  SignOut,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/app", label: "Console", end: true },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/tokens", label: "Tokens", icon: Coins },
  { to: "/app/nft", label: "NFT Studio", icon: Image },
  { to: "/app/voting", label: "DAO", icon: Scales },
  { to: "/app/supply", label: "Supply", icon: Package },
  { to: "/app/sepolia", label: "Sepolia", icon: GlobeHemisphereWest },
  { to: "/app/explorer", label: "Explorer", icon: Cube },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[#27272A] bg-[#0A0A0A]">
      <div className="p-6 border-b border-[#27272A]">
        <NavLink to="/" className="font-display text-2xl tracking-wider">
          / JI LEDGER
        </NavLink>
        {user && (
          <div className="mt-4 text-xs text-zinc-400 truncate">{user.username}</div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm uppercase tracking-wider border ${
                isActive
                  ? "border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500]"
                  : "border-transparent hover:border-[#27272A]"
              }`
            }
          >
            {link.icon && <link.icon size={18} />}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="m-4 btn-ghost flex items-center justify-center gap-2"
      >
        <SignOut size={16} /> Sign Out
      </button>
    </aside>
  );
}
