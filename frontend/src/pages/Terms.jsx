import { Link } from "react-router-dom";
import CryptoBackground from "@/components/CryptoBackground";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <CryptoBackground density={15} variant="sprinkle" />
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <Link to="/" className="font-display text-xl tracking-wider text-[#FF4500]">/ JI LEDGER</Link>
        <h1 className="font-display text-5xl md:text-7xl uppercase mt-8 text-[#FF4500]">Terms & Conditions</h1>
        <div className="panel mt-10 p-8 space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> June 2026</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">1. Acceptance of Terms</h2>
          <p>By using Ji Ledger, you agree to these Terms & Conditions. If you do not agree, please do not use our platform.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">2. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to use the platform for any illegal or unauthorized purpose.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">3. Platform Usage</h2>
          <p>Ji Ledger provides a blockchain-based platform for token creation, NFT minting, trading, and decentralized applications. All transactions on the blockchain are final and irreversible.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">4. Limitation of Liability</h2>
          <p>Ji Ledger is provided "as is" without warranties of any kind. We are not liable for any losses resulting from the use of our platform, including but not limited to trading losses, data loss, or service interruptions.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">5. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notice.</p>
        </div>
        <Link to="/" className="btn-ghost mt-8 inline-block">← Back Home</Link>
      </div>
    </div>
  );
}