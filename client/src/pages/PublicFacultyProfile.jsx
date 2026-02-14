/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Globe,
  Linkedin,
  Mail,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Building,
  UserCircle2,
  MessageCircle,
  Phone,
  Award,
  Save,
  GraduationCap,
} from "lucide-react";
import { publicService } from "../services/publicService";

/**
 * Ensures links are treated as external by the browser.
 * Prevents http://localhost:5173/profile/linkedin.com/... issues.
 */
const formatExternalLink = (url) => {
  if (!url) return "#";
  const trimmedUrl = url.trim();
  return trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;
};

const PublicFacultyProfile = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await publicService.getProfile(slug);
        setData(result);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [slug]);

  const handleSaveContact = () => {
    if (!data?.profile) return;
    const { profile } = data;

    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      `ORG:Vishwakarma Institute of Technology;${profile.department}`,
      `TITLE:${profile.designation || "Faculty"}`,
      `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
      profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
      profile.website
        ? `URL:${formatExternalLink(profile.website)}`
        : "URL:https://www.vit.edu",
      "END:VCARD",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.name.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
          Bansilal Ramanath Agrawal Charitable Trust
          <br />
          <span className="text-red-700 tracking-normal">
            Verifying Digital Identity...
          </span>
        </p>
      </div>
    );

  if (error || !data)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-center p-6">
        <ShieldCheck size={48} className="text-slate-200 mb-4" />
        <h2 className="text-slate-400 font-bold uppercase tracking-widest">
          Record Not Found
        </h2>
      </div>
    );

  const { profile } = data;

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans pb-12 text-slate-800">
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="bg-white border-b-2 border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-700 text-white p-1.5 rounded font-bold text-sm">
            VI
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-blue-900 uppercase leading-none tracking-tight">
              Bansilal Ramanath Agrawal Charitable Trust
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
              Vishwakarma Institute of Technology
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 border border-green-200 rounded-full">
          <ShieldCheck size={14} className="text-green-600" />
          <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">
            Verified Profile
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-10">
        {/* --- MAIN IDENTITY CARD --- */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-none flex flex-col md:flex-row overflow-hidden">
          {/* Left Side: Photo & Identity */}
          <div className="w-full md:w-80 bg-white border-r border-slate-100 p-8 flex flex-col items-center text-center">
            <div className="w-40 h-40 bg-white p-1 rounded-none border-4 border-red-700 mb-6 shadow-md overflow-hidden">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  className="w-full h-full object-cover"
                  alt="Faculty"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <UserCircle2 size={80} className="text-slate-200" />
                </div>
              )}
            </div>
            <h2 className="text-blue-900 font-serif font-bold text-xl uppercase leading-tight mb-2">
              {profile.name}
            </h2>
            <div className="inline-block px-3 py-1 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {profile.designation || "Faculty Member"}
            </div>

            <div className="mt-8 w-full">
              <button
                onClick={handleSaveContact}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 text-[10px] font-bold uppercase hover:bg-red-700 transition-all shadow-lg"
              >
                <Save size={14} /> Save Contact (.vcf)
              </button>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
              <DetailItem
                icon={Mail}
                label="Institutional Email"
                value={profile.email}
              />
              <DetailItem
                icon={Building}
                label="Employee ID"
                value={profile.employee_id}
              />
              <DetailItem
                icon={MessageCircle}
                label="Department"
                value={profile.department}
              />
              {profile.phone && (
                <DetailItem
                  icon={Phone}
                  label="Contact Number"
                  value={profile.phone}
                />
              )}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Professional Network
              </h4>
              <div className="flex flex-wrap gap-4">
                <SocialLink
                  icon={Linkedin}
                  label="LinkedIn"
                  href={formatExternalLink(profile.linkedin)}
                  active={!!profile.linkedin}
                />
                <SocialLink
                  icon={Globe}
                  label="Personal Website"
                  href={formatExternalLink(profile.website)}
                  active={!!profile.website}
                />
                <SocialLink
                  icon={GraduationCap}
                  label="Google Scholar"
                  href={formatExternalLink(profile.google_scholar)}
                  active={!!profile.google_scholar}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- RESEARCH SECTION --- */}
        <div className="mt-8 bg-white border border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center gap-3">
            <BookOpen size={18} className="text-red-700" />
            <h3 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.15em]">
              Academic Publications
            </h3>
          </div>
          <div className="p-8">
            {!profile.research || Object.keys(profile.research).length === 0 ? (
              <p className="text-slate-400 italic text-sm text-center py-4">
                No public research records available on this profile.
              </p>
            ) : (
              <div className="grid gap-6">
                {Object.values(profile.research).map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex gap-4 border-l-4 border-slate-100 hover:border-red-700 pl-6 py-2 transition-all"
                  >
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-800 group-hover:text-blue-900 leading-snug">
                        {item.title}
                      </h5>
                      {item.link && (
                        <a
                          href={formatExternalLink(item.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 uppercase mt-2 hover:underline cursor-pointer"
                        >
                          Access Publication <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Award size={12} className="text-red-700" /> Digital Certificate of
            Identity
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      <Icon size={14} />
      <span className="text-[9px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-sm font-bold text-slate-700 tracking-tight">
      {value || "Not Provided"}
    </p>
  </div>
);

const SocialLink = ({ icon: Icon, label, href, active }) => (
  <a
    href={active ? href : "#"}
    target={active ? "_blank" : "_self"}
    rel="noopener noreferrer"
    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider border transition-all ${
      active
        ? "border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm cursor-pointer"
        : "border-slate-100 text-slate-300 cursor-not-allowed pointer-events-none opacity-60"
    }`}
    onClick={(e) => !active && e.preventDefault()}
  >
    <Icon size={14} />
    {label}
  </a>
);

export default PublicFacultyProfile;
