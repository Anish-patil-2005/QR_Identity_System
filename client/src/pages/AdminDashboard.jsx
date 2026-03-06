/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { adminService } from '../services/adminService';
import { 
  UserPlus, QrCode, Key, CheckCircle, Loader2, 
  Building, LogOut, User, Mail, 
  Briefcase, Hash, Download, FileSpreadsheet, AlertCircle, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [bulkReport, setBulkReport] = useState(null); 
  const [lastCreatedEmpId, setLastCreatedEmpId] = useState(''); 
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    designation: '',
    department: 'ENTC'
  });

  // --- VALIDATION LOGIC ---
  // Returns true if any required field is an empty string
  const isFormInvalid = !formData.employee_id.trim() || 
                        !formData.name.trim() || 
                        !formData.email.trim() || 
                        !formData.designation.trim();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return; // Guard clause

    setLoading(true);
    setSuccessData(null);
    const currentId = formData.employee_id;

    try {
      const result = await adminService.createFaculty(formData);
      setSuccessData(result); 
      setLastCreatedEmpId(currentId);
      setFormData({ employee_id: '', name: '', email: '', designation: '', department: 'ENTC' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkLoading(true);
    try {
      const response = await adminService.bulkSyncFaculty(file);
      setBulkReport(response.summary);
    } catch (err) {
      alert(err.response?.data?.message || "Bulk synchronization failed");
    } finally {
      setBulkLoading(false);
      e.target.value = null; 
    }
  };

  const handleDownloadQR = () => {
    if (!successData?.qr_code) return;
    const link = document.createElement("a");
    link.href = successData.qr_code;
    link.download = `${lastCreatedEmpId || 'faculty_qr'}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans text-slate-800">
      
      {/* --- BULK SYNC REPORT MODAL (Kept same as before) --- */}
      {bulkReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md shadow-2xl border-t-4 border-blue-900">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Sync Report</h3>
                <button onClick={() => setBulkReport(null)} className="text-slate-400 hover:text-red-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                  <p className="text-xl font-black text-slate-700">{bulkReport.total}</p>
                </div>
                <div className="bg-green-50 p-3 border border-green-100">
                  <p className="text-[10px] font-bold text-green-600 uppercase">Success</p>
                  <p className="text-xl font-black text-green-700">{bulkReport.success}</p>
                </div>
                <div className="bg-red-50 p-3 border border-red-100">
                  <p className="text-[10px] font-bold text-red-600 uppercase">Failed</p>
                  <p className="text-xl font-black text-red-700">{bulkReport.failed}</p>
                </div>
              </div>
              {bulkReport.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto mb-4 border border-slate-100 bg-slate-50/50 p-2 text-[10px]">
                   {bulkReport.errors.map((err, i) => (
                     <div key={i} className="py-1 border-b last:border-0"><span className="font-bold text-red-600">{err.employee_id}:</span> {err.error}</div>
                   ))}
                </div>
              )}
              <button onClick={() => setBulkReport(null)} className="w-full bg-blue-900 text-white font-bold py-2 uppercase text-[10px]">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP BAR --- */}
      <div className="bg-white border-b-4 border-red-700 px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-red-700 text-white p-2 font-bold text-xl rounded">VI</div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-blue-900 leading-tight">Bansilal Ramanath Agrawal Charitable Trust</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Vishwakarma Institute of Technology</p>
          </div>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-slate-500 hover:text-red-700 transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-slate-200 pb-4 gap-4">
          <h2 className="text-2xl font-serif font-bold text-slate-800 uppercase">Faculty Registration Portal</h2>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            <button 
              onClick={handleBulkButtonClick}
              disabled={bulkLoading}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 text-[10px] font-bold uppercase hover:bg-black transition-all shadow-md disabled:opacity-50"
            >
              {bulkLoading ? <Loader2 className="animate-spin" size={14} /> : <><FileSpreadsheet size={14} /> Bulk Sync CSV</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-slate-50 px-6 py-3 border-b flex items-center gap-2">
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                    <div className="relative border-b-2 border-slate-100">
                      <Building className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <select name="department" value={formData.department} onChange={handleInputChange} className="w-full pl-6 py-2 bg-transparent text-sm outline-none font-bold appearance-none">
                        <option value="ENTC">E & TC</option>
                        <option value="CS">Computer Science</option>
                        <option value="IT">IT</option>
                        <option value="MECH">Mechanical</option>
                      </select>
                    </div>
                  </div>

                  {/* --- VALIDATION FEEDBACK --- */}
                  <div className="md:col-span-2 mt-4 space-y-3">
                    {isFormInvalid && (
                      <p className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 animate-pulse">
                        <AlertCircle size={12} /> Please fill all fields to enable registration
                      </p>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={loading || isFormInvalid} 
                      className={`w-full font-bold py-3 uppercase text-xs flex items-center justify-center gap-2 transition-all
                        ${isFormInvalid 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-4 border-slate-300' 
                          : 'bg-red-700 text-white hover:bg-red-800 shadow-lg border-b-4 border-red-900 active:translate-y-1 active:border-b-0'
                        }`}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={16} /> Finalize Registration</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            {successData ? (
              <div className="bg-white border-2 border-green-600 shadow-xl text-center overflow-hidden">
                <div className="bg-green-600 p-4 text-white">
                  <CheckCircle className="mx-auto mb-1" size={24} />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Registration Success</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-slate-50 border p-4 text-blue-900 font-mono text-xl font-black tracking-widest">
                    {successData.initial_password}
                  </div>
                  <div className="p-4 border-2 border-dashed border-slate-200 inline-block">
                    <img src={successData.qr_code} alt="QR" className="w-40 h-40 mx-auto" />
                    <p className="mt-2 text-[10px] font-bold text-slate-400">{lastCreatedEmpId}</p>
                  </div>
                  <button onClick={handleDownloadQR} className="w-full bg-slate-900 text-white py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2">
                    <Download size={14} /> Save QR Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 bg-white/50 grayscale opacity-50">
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

const AdminInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <div className="relative border-b-2 border-slate-100 focus-within:border-red-700 transition-colors">
      <Icon className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
      <input {...props} className="w-full pl-6 py-2 bg-transparent text-sm outline-none font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-200" />
    </div>
  </div>
);

export default AdminDashboard;