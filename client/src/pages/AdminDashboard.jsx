/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { 
  UserPlus, QrCode, Key, CheckCircle, Loader2, 
  Building, LogOut, User, Mail, 
  Briefcase, Hash, Printer, Download 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [lastCreatedEmpId, setLastCreatedEmpId] = useState(''); // To track filename
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    designation: '',
    department: 'ENTC'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessData(null);
    const currentId = formData.employee_id;

    try {
      const result = await adminService.createFaculty(formData);
      setSuccessData(result); 
      setLastCreatedEmpId(currentId); // Store for filename
      setFormData({ employee_id: '', name: '', email: '', designation: '', department: 'ENTC' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create faculty");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW DOWNLOAD FUNCTION ---
  const handleDownloadQR = () => {
    if (!successData?.qr_code) return;
    
    const link = document.createElement("a");
    link.href = successData.qr_code;
    // Sets the filename to the Employee ID (e.g., EMP101.png)
    link.download = `${lastCreatedEmpId || 'faculty_qr'}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans text-slate-800">
      
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b-4 border-red-700 px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-red-700 text-white p-2 font-bold text-xl rounded">VI</div>
          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-blue-900 leading-tight">Bansilal Ramanath Agrawal Charitable Trust</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Vishwakarma Institute of Technology</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-6">
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-slate-500 hover:text-red-700 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-serif font-bold text-slate-800 uppercase">Faculty Registration Portal</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FORM SECTION */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 shadow-sm rounded-none">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
                <UserPlus size={18} className="text-red-700" />
                <h3 className="text-xs font-bold text-blue-900 uppercase">New Faculty Entry</h3>
              </div>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <AdminInput label="Employee ID" name="employee_id" icon={Hash} value={formData.employee_id} onChange={handleInputChange} placeholder="EMP101" />
                  <AdminInput label="Full Name" name="name" icon={User} value={formData.name} onChange={handleInputChange} placeholder="Dr. John Doe" />
                  <div className="md:col-span-2">
                    <AdminInput label="Official Email" name="email" type="email" icon={Mail} value={formData.email} onChange={handleInputChange} placeholder="john.doe@vit.edu" />
                  </div>
                  <AdminInput label="Designation" name="designation" icon={Briefcase} value={formData.designation} onChange={handleInputChange} placeholder="Assistant Professor" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Department</label>
                    <div className="relative border-b-2 border-slate-100 focus-within:border-red-700">
                      <Building className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <select name="department" value={formData.department} onChange={handleInputChange} className="w-full pl-6 py-2 bg-transparent text-sm outline-none font-bold appearance-none">
                        <option value="ENTC">E & TC</option>
                        <option value="CS">Computer Science</option>
                        <option value="IT">IT</option>
                        <option value="MECH">Mechanical</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="md:col-span-2 mt-4 bg-red-700 text-white font-bold py-3 uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-800 transition-all shadow-lg shadow-red-900/10">
                    {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={16} /> Finalize Registration</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* RESULT SECTION */}
          <div className="lg:col-span-4">
            {successData ? (
              <div className="bg-white border-2 border-green-600 shadow-xl overflow-hidden text-center">
                <div className="bg-green-600 p-4">
                  <CheckCircle className="text-white mx-auto mb-1" size={24} />
                  <h3 className="text-xs font-bold text-white uppercase">Registration Success</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-slate-50 border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Initial Credentials</p>
                    <div className="flex items-center justify-center gap-2">
                      <Key size={14} className="text-red-700" />
                      <span className="text-xl font-mono font-black text-blue-900 tracking-wider">{successData.initial_password}</span>
                    </div>
                  </div>
                  <div className="inline-block p-4 border-2 border-dashed border-slate-200">
                    <img src={successData.qr_code} alt="QR" className="w-40 h-40" />
                    <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase">{lastCreatedEmpId}</p>
                  </div>
                  {/* --- UPDATED BUTTON --- */}
                  <button 
                    onClick={handleDownloadQR} 
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 text-[10px] font-bold uppercase hover:bg-black transition-all"
                  >
                    <Download size={14} /> Save QR Image ({lastCreatedEmpId}.png)
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center bg-white/50">
                <QrCode size={48} className="text-slate-200 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Submission</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper Components
const AdminInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <div className="relative border-b-2 border-slate-100 focus-within:border-red-700 transition-colors">
      <Icon className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
      <input {...props} className="w-full pl-6 py-2 bg-transparent text-sm outline-none font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300" />
    </div>
  </div>
);

export default AdminDashboard;