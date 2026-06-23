import { Link } from "react-router-dom";
import CryptoBackground from "@/components/CryptoBackground";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <CryptoBackground density={15} variant="sprinkle" />
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <Link to="/" className="font-display text-xl tracking-wider text-[#FF4500]">/ JI LEDGER</Link>
        <h1 className="font-display text-5xl md:text-7xl uppercase mt-8 text-[#FF4500]">Privacy Policy</h1>
        <div className="panel mt-10 p-8 space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> June 2026</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">1. Information We Collect</h2>
          <p>When you register on Ji Ledger, we collect your email address, username, and optionally your phone number. Wallet addresses on our platform are generated locally and stored securely.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">2. How We Use Your Data</h2>
          <p>We use your data solely to provide and improve our platform — including authentication, transaction processing, and customer support. We never sell your personal data to third parties.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">3. Data Security</h2>
          <p>We implement industry-standard encryption and security practices to protect your information. All passwords are hashed using bcrypt. Blockchain transactions are immutable and publicly verifiable.</p>
          <h2 className="text-[#FF4500] font-display text-xl uppercase mt-6">4. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time via your profile settings. Contact us for any privacy-related concerns.</p>
        </div>
        <Link to="/" className="btn-ghost mt-8 inline-block">← Back Home</Link>
      </div>
    </div>
  );
}