import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { hasMetaMask, siweLogin } from "@/lib/web3";

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const [loginType, setLoginType] = useState("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [siweLoading, setSiweLoading] = useState(false);
  const { login, register, siwe } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const identifier = loginType === "email" ? email : phone;
        await login(identifier, password);
      } else {
        await register(email, username, password, phone);
      }
      toast.success("Welcome aboard the chain.");
      navigate("/app");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onMetaMask = async () => {
    if (!hasMetaMask()) {
      toast.error("MetaMask not detected. Install it at metamask.io");
      return;
    }
    setSiweLoading(true);
    try {
      const { token, user } = await siweLogin();
      siwe(token, user);
      toast.success(`Signed in as ${user.username}`);
      navigate("/app");
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || "MetaMask sign-in failed");
    } finally {
      setSiweLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <aside className="hidden md:flex flex-col justify-between p-12 border-r border-[var(--border-color)] scanline">
        <Link to="/" className="font-display text-2xl tracking-wider">
          / JI LEDGER
        </Link>
        <div>
          <h1 className="font-display text-5xl uppercase leading-none">
            Forge your on-chain identity.
          </h1>
          <p className="mt-6 text-zinc-400">
            Every account is auto-issued a primary 0x wallet seeded with 1000 JI.
          </p>
        </div>
      </aside>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-md space-y-4">
          <h2 className="font-display text-4xl uppercase text-[#FF4500]">{mode === "login" ? "Sign In" : "Register"}</h2>

          {mode === "login" && (
            <div className="flex bg-[var(--bg-primary)]/10 p-1 border border-[var(--border-color)] rounded mb-4">
              <button
                type="button"
                className={`flex-1 py-1 text-[10px] uppercase font-bold tracking-widest transition-colors ${loginType === 'email' ? 'bg-[#FF4500] text-black' : 'text-zinc-500'}`}
                onClick={() => setLoginType("email")}
              >Email</button>
              <button
                type="button"
                className={`flex-1 py-1 text-[10px] uppercase font-bold tracking-widest transition-colors ${loginType === 'phone' ? 'bg-[#FF4500] text-black' : 'text-zinc-500'}`}
                onClick={() => setLoginType("phone")}
              >Phone</button>
            </div>
          )}

          {mode === "login" ? (
            loginType === "email" ? (
              <input
                className="input-field"
                type="email"
                placeholder="you@chain.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <input
                className="input-field"
                type="tel"
                placeholder="Mobile Number (+1...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            )
          ) : (
            <>
              <input
                className="input-field"
                type="email"
                placeholder="you@chain.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input-field"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="input-field"
                placeholder="Mobile Number (+1...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            className="input-field"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <button type="button" className="btn-ghost w-full" onClick={onMetaMask} disabled={siweLoading}>
            {siweLoading ? "Awaiting signature…" : "Sign in with MetaMask"}
          </button>
          <button
            type="button"
            className="text-sm text-zinc-400 hover:text-white flex items-center gap-2"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Sign In"} <ArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
