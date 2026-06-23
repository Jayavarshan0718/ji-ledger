import { useState } from "react";
import { Link } from "react-router-dom";
import { Envelope, Phone, MapPin } from "@phosphor-icons/react";
import CryptoBackground from "@/components/CryptoBackground";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <CryptoBackground density={18} variant="sprinkle" />
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <Link to="/" className="font-display text-xl tracking-wider text-[#FF4500]">/ JI LEDGER</Link>
        <h1 className="font-display text-5xl md:text-7xl uppercase mt-8 text-[#FF4500]">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="panel p-8">
            <div className="label-mini mb-6">// GET IN TOUCH</div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500]"><Envelope size={20} /></div>
                <div><div className="font-mono text-sm">jayavarshan@jiledger.io</div><div className="text-[10px] text-zinc-500">Email</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500]"><Phone size={20} /></div>
                <div><div className="font-mono text-sm">+91 98765 43210</div><div className="text-[10px] text-zinc-500">Phone</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500]"><MapPin size={20} /></div>
                <div><div className="font-mono text-sm">India</div><div className="text-[10px] text-zinc-500">Location</div></div>
              </div>
            </div>
          </div>

          <div className="panel p-8">
            <div className="label-mini mb-6">// SEND A MESSAGE</div>
            {sent ? (
              <div className="text-center py-10">
                <div className="text-2xl text-green-400 font-display">Message Sent!</div>
                <p className="text-zinc-500 text-sm mt-2">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <input className="input-field" placeholder="Name" required />
                <input className="input-field" type="email" placeholder="Email" required />
                <textarea className="input-field" rows={4} placeholder="Message" required />
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </div>
        </div>

        <Link to="/" className="btn-ghost mt-8 inline-block">← Back Home</Link>
      </div>
    </div>
  );
}