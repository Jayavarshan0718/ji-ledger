import { useEffect, useState } from "react";
import { CheckCircle, Plus, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function VotingPage() {
  const [proposals, setProposals] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    options: ["YES", "NO"],
    duration_hours: 72,
  });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data } = await api.get("/voting/proposals");
    setProposals(data.proposals);
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/voting/proposals", {
        ...form,
        duration_hours: parseInt(form.duration_hours, 10),
      });
      toast.success("Proposal posted");
      setCreateOpen(false);
      setForm({ title: "", description: "", options: ["YES", "NO"], duration_hours: 72 });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const vote = async (pid, option) => {
    try {
      await api.post("/voting/vote", { proposal_id: pid, option });
      toast.success(`Voted ${option}`);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Vote failed");
    }
  };

  const updateOption = (i, v) => {
    const arr = [...form.options];
    arr[i] = v;
    setForm({ ...form, options: arr });
  };

  return (
    <div className="p-6 md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-4 text-[#FF4500]">
        <div>
          <div className="label-mini">// MODULE 04</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">DAO Governance</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> New Proposal
        </button>
      </div>

      <div className="mt-10 space-y-4">
        {proposals.map((p) => (
          <div key={p.id} className="panel">
            <div className="font-display text-2xl uppercase">{p.title}</div>
            <p className="text-zinc-400 mt-2 text-sm">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.options.map((opt) => (
                <button key={opt} className="btn-ghost inline-flex items-center gap-2" onClick={() => vote(p.id, opt)}>
                  <CheckCircle size={14} /> {opt}
                </button>
              ))}
            </div>
            <div className="text-xs text-zinc-500 mt-4">
              Votes: {Object.keys(p.votes || {}).length} · Expires {new Date(p.expires_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {createOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={create} className="panel w-full max-w-lg space-y-3">
            <div className="flex justify-between items-center">
              <div className="font-display text-2xl uppercase">Create Proposal</div>
              <button type="button" onClick={() => setCreateOpen(false)}><X size={20} /></button>
            </div>
            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="input-field min-h-[80px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {form.options.map((opt, i) => (
              <input key={i} className="input-field" value={opt} onChange={(e) => updateOption(i, e.target.value)} />
            ))}
            <input className="input-field" type="number" placeholder="Duration (hours)" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} />
            <button className="btn-primary w-full" disabled={busy}>Post Proposal</button>
          </form>
        </div>
      )}
    </div>
  );
}
