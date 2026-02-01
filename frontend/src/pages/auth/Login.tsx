import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "instructor" ? "/instructor" : "/student", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black">
      <div className="w-full max-w-md glass-card p-8 neon-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">WELCOME <span className="text-cyan-400">BACK</span></h1>
          <p className="text-zinc-500 mt-2">Enter your details to access your dashboard</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary mt-2" disabled={loading}>{loading ? "AUTHENTICATING..." : "LOGIN"}</button>
        </form>

        <p className="text-center mt-6 text-zinc-500 text-sm">
          Don't have an account? <Link to="/register" className="text-cyan-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}