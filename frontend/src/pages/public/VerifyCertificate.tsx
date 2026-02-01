import { useState } from "react";
import api from "../../api/api";

interface VerificationResult {
  user: { name: string };
  course: { title: string };
  generated_at: string;
}

export default function VerifyCertificate() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<VerificationResult | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError(false);
    setData(null);
    setLoading(true);
    try {
      const res = await api.get(`/certificates/verify/${code}`);
      setData(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg glass-card p-12 neon-border text-center">
        <h1 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">VERIFY <span className="text-cyan-400">CREDENTIAL</span></h1>
        <p className="text-zinc-500 text-sm mb-10">Input the unique verification code from your PDF.</p>
        
        <div className="flex flex-col gap-4">
          <input 
            className="text-center text-xl uppercase tracking-[0.3em] font-mono border-2 border-zinc-800" 
            placeholder="XXXX-XXXX" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
          />
          <button 
            onClick={handleVerify} 
            disabled={loading}
            className="primary w-full py-5"
          >
            {loading ? "VALIDATING..." : "VALIDATE CODE"}
          </button>
        </div>

        {data && (
          <div className="mt-10 p-8 bg-green-500/5 border border-green-500/20 rounded-[2rem] animate-in zoom-in-95 duration-300">
            <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-4">✓ Verified Authentic</p>
            <div className="space-y-1">
                <p className="text-white font-bold text-2xl tracking-tight">{data.user.name}</p>
                <p className="text-zinc-500 text-sm italic">{data.course.title}</p>
            </div>
            <p className="text-[9px] text-zinc-700 font-bold uppercase mt-6">Issued on {new Date(data.generated_at).toLocaleDateString()}</p>
          </div>
        )}

        {error && (
            <div className="mt-10 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-500 font-bold uppercase text-xs">Invalid or Expired Certificate Code</p>
            </div>
        )}
      </div>
    </div>
  );
}