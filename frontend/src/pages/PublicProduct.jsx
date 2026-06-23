import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";

export default function PublicProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/supply/public/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError("Product not found"));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-mono">
        // loading<span className="blink">_</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-12 text-[var(--text-primary)] transition-colors duration-300">
      <div className="label-mini">// PUBLIC TRACE</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">{product.name}</h1>
      <div className="text-zinc-500 mt-2">SKU: {product.sku} · {product.category}</div>
      <p className="mt-4 text-zinc-400 max-w-2xl">{product.description}</p>

      <div className="panel mt-10 max-w-2xl">
        <div className="label-mini mb-4">Checkpoint Trail</div>
        <div className="space-y-4">
          {(product.checkpoints || []).map((cp, i) => (
            <div key={i} className="border-l-2 border-[#FF4500] pl-4">
              <div className="font-bold">{cp.status}</div>
              <div className="text-sm text-zinc-500">{cp.location} · {cp.handler}</div>
              <div className="text-xs text-zinc-600 mt-1">{new Date(cp.created_at).toLocaleString()}</div>
              {cp.notes && <div className="text-sm mt-1">{cp.notes}</div>}
            </div>
          ))}
          {!product.checkpoints?.length && <div className="text-zinc-500">No checkpoints recorded</div>}
        </div>
      </div>
    </div>
  );
}
