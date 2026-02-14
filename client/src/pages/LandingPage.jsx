/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, GraduationCap, ShieldCheck, QrCode, ArrowRight, Award } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans flex flex-col">
      
      {/* --- INSTITUTIONAL TOP BAR --- */}
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
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Digital Identity Portal</p>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="text-center mb-16 max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-xl border-t-4 border-red-700">
              <QrCode size={54} className="text-blue-900" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-800 uppercase tracking-tight leading-tight">
            Digital Identity & <br/> 
            <span className="text-red-700">Profile Management System</span>
          </h2>
          <div className="w-24 h-1 bg-red-700 mx-auto my-6"></div>
          <p className="text-slate-600 font-medium max-w-xl mx-auto italic text-sm">
            Providing secure, verified digital credentials for the esteemed faculty and students of the Vishwakarma family.
          </p>
        </div>

        {/* --- PORTAL SELECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* Faculty Card */}
          <button 
            onClick={() => navigate('/login')}
            className="group relative bg-white border-b-4 border-red-700 p-10 shadow-lg hover:shadow-2xl transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserCheck size={120} />
            </div>
            <UserCheck className="text-red-700 mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">Faculty Portal</h3>
            <p className="text-slate-500 text-sm mt-3 font-medium">
              Access your professional dashboard, update research publications, and manage your digital identity card.
            </p>
            <div className="mt-8 flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-widest">
              Authorized Login <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Student Card (Disabled/Placeholder) */}
          <div className="relative bg-white border-b-4 border-slate-300 p-10 shadow-md opacity-70 cursor-not-allowed">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 uppercase tracking-widest border border-slate-200">
              Under Development
            </div>
            <GraduationCap className="text-slate-400 mb-6" size={48} />
            <h3 className="text-2xl font-bold text-slate-400 uppercase tracking-tight">Student Portal</h3>
            <p className="text-slate-400 text-sm mt-3 font-medium">
              Self-service identity generation and academic credential management for students.
            </p>
            <div className="mt-8 flex items-center gap-2 text-slate-300 font-black text-xs uppercase tracking-widest">
              Access Restricted
            </div>
          </div>

        </div>

        {/* --- ADMINISTRATIVE ACCESS --- */}
        <div className="mt-16 group">
          <button 
            onClick={() => navigate('/admin/portal')}
            className="flex items-center gap-3 text-slate-400 hover:text-red-700 transition-all font-bold text-xs uppercase tracking-[0.2em]"
          >
            <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
            System Administration
          </button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <Award className="text-red-700" size={24} />
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
               © 2026 Bansilal Ramanath Agrawal Charitable Trust
             </p>
          </div>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase cursor-help hover:text-blue-900 transition-colors">Privacy Policy</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase cursor-help hover:text-blue-900 transition-colors">Usage Terms</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase cursor-help hover:text-blue-900 transition-colors">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;