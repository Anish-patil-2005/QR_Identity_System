/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/facultyService';
import { 
  User, QrCode, Globe, Linkedin, Phone, Save, Loader2, 
  Download, LogOut, ShieldCheck, MessageCircle, 
  GraduationCap, Edit3, BookOpen, Microscope, Camera, Building, 
  UserCircle2, Mail, ExternalLink, Hash, Plus, Trash2, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await facultyService.getMyProfile();
      if (!data.research || !Array.isArray(data.research)) {
        data.research = [];
      }
      setProfile(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      await facultyService.updateProfile(profile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed. Check backend JSONB configuration.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-900" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans text-slate-800">
      
      {/* --- INSTITUTIONAL TOP BAR --- */}
      <div className="bg-white border-b-4 border-red-700 px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Placeholder for Logo */}
          <div className="bg-red-700 text-white p-2 font-bold text-xl rounded">VI</div>
          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-blue-900 leading-tight">Vishwakarma Institute of Technology</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Bansilal Ramnath Agarwal Charitable Trust</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-6">
          <div className="text-right border-r pr-6 border-slate-200 hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Logged in as</p>
            <p className="text-sm font-bold text-blue-900">Faculty | {profile.name}</p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-slate-500 hover:text-red-700 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* --- MAIN HEADER --- */}
        <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 uppercase tracking-tight">Faculty Information Management System</h2>
            <p className="text-slate-500 text-sm">Update your academic records and digital presence.</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 text-sm font-bold rounded shadow-md hover:bg-blue-800 transition-all">
                <Edit3 size={16} /> EDIT RECORDS
              </button>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-bold border border-slate-300 rounded hover:bg-slate-50">CANCEL</button>
                <button onClick={handleSave} disabled={updating} className="flex items-center gap-2 bg-green-700 text-white px-5 py-2 text-sm font-bold rounded shadow-md hover:bg-green-800 disabled:opacity-50">
                  {updating ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> COMMIT CHANGES</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* --- LEFT: TRADITIONAL PROFILE CARD --- */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 shadow-sm p-6 sticky top-28">
              <div className="w-full aspect-square bg-slate-100 border-2 border-slate-200 mb-4 overflow-hidden relative group">
                {profile.profile_photo_url ? (
                  <img src={profile.profile_photo_url} className="w-full h-full object-cover" alt="Faculty" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300"><UserCircle2 size={80} /></div>
                )}
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-blue-900 leading-tight">{profile.name}</h3>
                <p className="text-xs font-bold text-red-700 uppercase mt-1">{profile.designation}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{profile.department}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>Emp ID:</span>
                  <span className="text-slate-800 font-bold">{profile.employee_id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Status:</span>
                  <span className="text-green-700 font-bold">ACTIVE</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Digital ID Card (QR)</p>
                <div className="bg-slate-50 p-4 border border-slate-200 inline-block">
                  <img src={profile.qr_code} className="w-24 h-24" alt="QR" />
                </div>
                <button onClick={() => {/* handle download */}} className="mt-3 flex items-center gap-2 mx-auto text-[10px] font-bold text-blue-900 hover:underline">
                  <Download size={12}/> DOWNLOAD OFFICIAL QR
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT: FORM SECTIONS --- */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* SECTION 1: CONTACT */}
            <Section title="Communication Details" icon={Phone}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <TraditionalInput label="Official Email Address" value={profile.email} disabled icon={Mail} />
                <TraditionalInput label="Primary Phone Number" value={profile.phone} isEditing={isEditing} icon={Phone}
                  onChange={(v) => setProfile({...profile, phone: v})} />
                <TraditionalInput label="WhatsApp/Mobile" value={profile.whatsapp} isEditing={isEditing} icon={MessageCircle}
                  onChange={(v) => setProfile({...profile, whatsapp: v})} />
                <TraditionalInput label="Personal Website / Portfolio" value={profile.website} isEditing={isEditing} icon={Globe}
                  onChange={(v) => setProfile({...profile, website: v})} />
              </div>
            </Section>

            {/* SECTION 2: PROFESSIONAL */}
            <Section title="Professional & Academic Profiles" icon={GraduationCap}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <TraditionalInput label="LinkedIn Profile URL" value={profile.linkedin} isEditing={isEditing} icon={Linkedin}
                  onChange={(v) => setProfile({...profile, linkedin: v})} />
                <TraditionalInput label="Google Scholar ID" value={profile.google_scholar} isEditing={isEditing} icon={Microscope}
                  onChange={(v) => setProfile({...profile, google_scholar: v})} />
                <TraditionalInput label="Current Designation" value={profile.designation} isEditing={isEditing} icon={GraduationCap}
                  onChange={(v) => setProfile({...profile, designation: v})} />
                <TraditionalInput label="Profile Image URL" value={profile.profile_photo_url} isEditing={isEditing} icon={Camera}
                  onChange={(v) => setProfile({...profile, profile_photo_url: v})} />
              </div>
            </Section>

            {/* SECTION 3: RESEARCH PAPERS */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <h4 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-2">
                  <BookOpen size={14} className="text-red-700" /> Research & Publications
                </h4>
                {isEditing && (
                  <button onClick={() => setProfile({...profile, research: [...profile.research, {title: '', link: ''}]})}
                    className="text-[10px] font-bold bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800">
                    + ADD RECORD
                  </button>
                )}
              </div>
              <div className="p-6">
                {profile.research.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No publications listed in the official record.</p>
                ) : (
                  <div className="space-y-0 border-l border-r border-t border-slate-200">
                    {profile.research.map((paper, index) => (
                      <div key={index} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-center">
                        <span className="text-xs font-bold text-slate-400 w-8">{index + 1}.</span>
                        {isEditing ? (
                          <>
                            <input className="flex-1 text-sm border p-2 rounded" placeholder="Publication Title" value={paper.title} 
                              onChange={(e) => {
                                const papers = [...profile.research];
                                papers[index].title = e.target.value;
                                setProfile({...profile, research: papers});
                              }} 
                            />
                            <input className="flex-1 text-sm border p-2 rounded" placeholder="URL/Link" value={paper.link} 
                              onChange={(e) => {
                                const papers = [...profile.research];
                                papers[index].link = e.target.value;
                                setProfile({...profile, research: papers});
                              }} 
                            />
                            <button onClick={() => setProfile({...profile, research: profile.research.filter((_, i) => i !== index)})}
                              className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                          </>
                        ) : (
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700">{paper.title || "Untitled Record"}</p>
                            {paper.link && <a href={paper.link} target="_blank" rel="noreferrer" className="text-blue-700 text-[10px] font-bold hover:underline flex items-center gap-1 mt-1">LINK TO PUBLICATION <ExternalLink size={10}/></a>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// UI Components
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
      <h4 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-2">
        <Icon size={14} className="text-red-700" /> {title}
      </h4>
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const TraditionalInput = ({ label, value, isEditing, onChange, disabled, icon: Icon }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <div className="relative border-b-2 border-slate-100 focus-within:border-blue-900 transition-colors">
      <Icon className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
      <input 
        disabled={disabled || !isEditing}
        className={`w-full pl-6 py-2 bg-transparent text-sm outline-none ${disabled ? 'text-slate-400 italic' : 'text-slate-800 font-semibold'}`}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  </div>
);

export default FacultyDashboard;