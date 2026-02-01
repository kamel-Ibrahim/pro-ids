import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" as "student" | "instructor" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate(form.role === "instructor" ? "/instructor" : "/student");
    } catch {
      alert("Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black">
      <div className="w-full max-w-md glass-card p-8 neon-border">
        <h1 className="text-3xl font-black text-center mb-8">JOIN <span className="text-cyan-400">PRO•IDS</span></h1>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input placeholder="Full Name" onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
          
          <div className="flex gap-2 p-1 bg-black rounded-xl border border-zinc-800">
            {(['student', 'instructor'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({...form, role: r})}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${form.role === r ? 'bg-cyan-500 text-black' : 'text-zinc-500'}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button type="submit" className="primary mt-4" disabled={loading}>{loading ? "CREATING ACCOUNT..." : "REGISTER"}</button>
        </form>

        <p className="text-center mt-6 text-zinc-500 text-sm">
          Already a member? <Link to="/login" className="text-cyan-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}