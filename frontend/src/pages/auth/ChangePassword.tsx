import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import axios from "axios";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ current_password: "", new_password: "", new_password_confirmation: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/change-password", form);
      alert("Password changed successfully!");
      navigate(-1); // Go back
    } catch (err) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-3xl font-black text-white mb-8 uppercase italic">Security <span className="text-cyan-400">Update</span></h1>
      <form onSubmit={handleSubmit} className="glass-card p-8 neon-border flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Password</label>
          <input type="password" value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Password</label>
          <input type="password" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Confirm New Password</label>
          <input type="password" value={form.new_password_confirmation} onChange={e => setForm({...form, new_password_confirmation: e.target.value})} required />
        </div>
        <button type="submit" disabled={loading} className="primary py-4 mt-2">
          {loading ? "UPDATING..." : "SAVE NEW PASSWORD"}
        </button>
      </form>
    </div>
  );
}