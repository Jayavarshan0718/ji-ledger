import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeBackground from "@/components/ThemeBackground";
import Shell from "@/components/layout/Shell";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import WalletPage from "@/pages/Wallet";
import TokensPage from "@/pages/Tokens";
import NFTPage from "@/pages/NFT";
import VotingPage from "@/pages/Voting";
import SupplyPage from "@/pages/SupplyChain";
import ExplorerPage from "@/pages/Explorer";
import MarketsPage from "@/pages/Markets";
import TradePage from "@/pages/Trade";
import FuturesPage from "@/pages/Futures";
import EarnPage from "@/pages/Earn";
import MorePage from "@/pages/More";
import SettingsPage from "@/pages/Settings";
import ProfilePage from "@/pages/Profile";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PrivacyPage from "@/pages/Privacy";
import TermsPage from "@/pages/Terms";
import SepoliaPage from "@/pages/Sepolia";
import PublicProduct from "@/pages/PublicProduct";
import PortfolioPage from "@/pages/Portfolio";
import SIPPage from "@/pages/SIP";
import WatchlistPage from "@/pages/Watchlist";
import StocksPage from "@/pages/Stocks";
import AIAdvisorPage from "@/pages/AIAdvisor";
import StakePage from "@/pages/Stake";
import TokenLaunchpadPage from "@/pages/TokenLaunchpad";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono">
        <span className="label-mini">
          // loading runtime<span className="blink">_</span>
        </span>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <ThemeBackground />
        <Toaster position="bottom-right" theme="dark" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/p/:id" element={<PublicProduct />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/app"
            element={
              <Protected>
                <Shell />
              </Protected>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="futures" element={<FuturesPage />} />
            <Route path="earn" element={<EarnPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="tokens" element={<TokensPage />} />
            <Route path="nft" element={<NFTPage />} />
            <Route path="voting" element={<VotingPage />} />
            <Route path="supply" element={<SupplyPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="explorer" element={<ExplorerPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="sip" element={<SIPPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="stocks" element={<StocksPage />} />
            <Route path="ai-advisor" element={<AIAdvisorPage />} />
            <Route path="stake" element={<StakePage />} />
            <Route path="launchpad" element={<TokenLaunchpadPage />} />
            <Route path="more" element={<MorePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="sepolia" element={<SepoliaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}