import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2,Loader2 } from 'lucide-react';
import api from '../services/api';

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isInitial = searchParams.get('mode') === 'initial';

  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return alert("New passwords do not match!");

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      alert("Password updated! Welcome to your dashboard.");
      navigate('/faculty/profile');
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div className={`p-6 text-white flex items-center gap-3 ${isInitial ? 'bg-amber-500' : 'bg-indigo-600'}`}>
          {isInitial ? <AlertCircle size={32} /> : <ShieldCheck size={32} />}
          <div>
            <h2 className="text-xl font-bold">{isInitial ? "First-Time Security Setup" : "Update Password"}</h2>
            <p className="text-xs opacity-90">{isInitial ? "Please change your temporary password to proceed." : "Keep your account secure."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Current (Temporary) Password</label>
            <input 
              type="password" required
              className="w-full mt-1 p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setForm({...form, oldPassword: e.target.value})}
            />
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-slate-700">New Secure Password</label>
            <input 
              type="password" required minLength={6}
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setForm({...form, newPassword: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Confirm New Password</label>
            <input 
              type="password" required
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Activate Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;