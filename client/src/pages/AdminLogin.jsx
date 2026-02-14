/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.role === 'admin') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', 'admin');
        navigate('/admin/dashboard');
      } else {
        alert("Access Denied: You are not an admin.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans flex flex-col">
      
      {/* --- REUSABLE INSTITUTIONAL HEADER --- */}
      <div className="bg-white border-b-4 border-red-700 px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="bg-red-700 text-white p-2 font-bold text-xl rounded shadow-sm">VI</div>
          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-blue-900 leading-tight">
              Bansilal Ramanath Agrawal Charitable Trust
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">
              Vishwakarma Institute of Technology
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-500 hover:text-red-700 font-bold text-xs uppercase transition-colors"
          >
            <ArrowLeft size={16} /> Back to Portal
          </button>
        </div>
      </div>

      {/* --- LOGIN SECTION --- */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl overflow-hidden rounded-none">
          
          {/* Header Section */}
          <div className="bg-slate-900 p-8 text-center border-b-4 border-red-700">
            <ShieldCheck className="mx-auto text-red-600 mb-3" size={50} />
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-widest">Administrative Login</h2>
            <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">
              Secure Gateway &bull; Authorized Personnel
            </p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleAdminLogin} className="p-10 space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email Address</label>
              <div className="relative border-b-2 border-slate-100 focus-within:border-red-700 transition-colors py-1">
                <Mail className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email" 
                  className="w-full pl-8 py-2 bg-transparent text-sm outline-none font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300"
                  placeholder="admin@vit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Credentials</label>
              <div className="relative border-b-2 border-slate-100 focus-within:border-red-700 transition-colors py-1">
                <Lock className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password" 
                  className="w-full pl-8 py-2 bg-transparent text-sm outline-none font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white font-bold py-4 uppercase tracking-[0.15em] text-xs shadow-lg shadow-red-900/20 hover:bg-red-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Verify Identity"
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[9px] text-slate-400 uppercase font-bold leading-relaxed">
                Notice: Unauthorized access attempts are logged and reported to the system administrator. 
                By logging in, you agree to the trust security policy.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-4 text-center border-t border-slate-200 bg-white">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          &copy; 2026 Bansilal Ramanath Agrawal Charitable Trust &bull; IT Support Desk
        </p>
      </div>
    </div>
  );
};

// Simple Loader2 fallback if not imported correctly
const Loader2 = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default AdminLogin;