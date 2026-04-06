import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Award, BookOpen, Users, Video, Phone, MessageSquare, Calendar, Heart, ChevronRight, Check, Stethoscope, Globe, DollarSign, Edit, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const CERTIFICATIONS = ['ABIM Board Certified', 'ACLS Certified', 'BLS Certified', 'Telemedicine Certified'];
const EDUCATION = [
  { degree: 'MD — Doctor of Medicine', school: 'Harvard Medical School', year: '2010' },
  { degree: 'Residency — Internal Medicine', school: 'Johns Hopkins Hospital', year: '2013' },
  { degree: 'Fellowship — Cardiology', school: 'Cleveland Clinic', year: '2015' },
];

export default function DoctorProfile() {
  const { user, professionalProfile, consultationFees, availability } = useUser();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('profile');
  const [fees, setFees] = useState(consultationFees || { video: 200, audio: 150, chat: 100 });
  const [avail, setAvail] = useState(availability || { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false });

  const profile = professionalProfile || {
    specialty: 'Internal Medicine',
    subSpecialty: 'Cardiology',
    licenseNumber: 'MD-NY-123456',
    yearsOfExperience: 12,
    hospital: 'City Medical Center',
    languages: ['English', 'Spanish'],
    bio: 'Board-certified internist with over 12 years of experience specializing in cardiovascular health and preventive medicine. Committed to patient-centered care and evidence-based practice.',
    consultationCount: 2847,
    rating: 4.9,
    reviewCount: 312,
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'schedule', label: 'Availability' },
    { id: 'fees', label: 'Consultation Fees' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Account</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Professional Profile</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Doctor Profile</h1>
        <p className="text-[#64748B] mt-1 text-sm">Manage your professional profile and public listing</p>
      </div>

      {/* Hero Card */}
      <div className="card mb-6">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="relative">
            <div className="w-24 h-24 bg-[#1E40AF] rounded-2xl flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{(user?.name || 'D')[0]}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center hover:border-[#1E40AF]">
              <Camera className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0F172A]">{user?.name || 'Dr. User'}</h2>
                <div className="text-[#64748B] text-sm mt-0.5">{profile.specialty} · {profile.subSpecialty}</div>
                <div className="flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-[#94A3B8]" /><span className="text-xs text-[#64748B]">{profile.hospital}</span></div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-[#0F172A]">{profile.rating}</span>
                    <span className="text-xs text-[#94A3B8]">({profile.reviewCount} reviews)</span>
                  </div>
                  <span className="text-xs text-[#64748B]">{profile.consultationCount.toLocaleString()} consultations</span>
                  <span className="text-xs text-[#64748B]">{profile.yearsOfExperience}yr experience</span>
                </div>
              </div>
              <button onClick={() => setEditing(!editing)} className="btn-secondary flex items-center gap-2"><Edit className="w-4 h-4" />{editing ? 'Cancel' : 'Edit Profile'}</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {CERTIFICATIONS.map(cert => (
                <span key={cert} className="flex items-center gap-1 px-2 py-1 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded-lg border border-blue-200"><Check className="w-3 h-3" />{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>{t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-3">About</h2>
              {editing ? <textarea className="input h-32 resize-none text-sm" defaultValue={profile.bio} /> : <p className="text-sm text-[#374151] leading-relaxed">{profile.bio}</p>}
            </div>
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Education & Training</h2>
              <div className="space-y-4">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-[#1E40AF]" /></div>
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm">{edu.degree}</div>
                      <div className="text-xs text-[#64748B]">{edu.school} · {edu.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-3 text-sm">Quick Stats</h2>
              {[
                { label: 'Response Time', value: '< 2 hours', icon: Clock },
                { label: 'Patients Treated', value: profile.consultationCount.toLocaleString(), icon: Users },
                { label: 'Languages', value: profile.languages.join(', '), icon: Globe },
                { label: 'License', value: profile.licenseNumber, icon: Award },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F1F5F9] last:border-0">
                  <stat.icon className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">{stat.label}</div>
                    <div className="text-xs font-medium text-[#0F172A]">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-3 text-sm">Consultation Modes</h2>
              {[
                { mode: 'Video', icon: Video, available: true },
                { mode: 'Audio Call', icon: Phone, available: true },
                { mode: 'Chat', icon: MessageSquare, available: true },
                { mode: 'In-person', icon: MapPin, available: false },
              ].map(m => (
                <div key={m.mode} className="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0">
                  <m.icon className={`w-4 h-4 ${m.available ? 'text-[#1E40AF]' : 'text-[#CBD5E1]'}`} />
                  <span className="text-xs text-[#374151] flex-1">{m.mode}</span>
                  <div className={`w-2 h-2 rounded-full ${m.available ? 'bg-green-500' : 'bg-[#CBD5E1]'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'schedule' && (
        <div className="card max-w-lg">
          <h2 className="font-semibold text-[#0F172A] mb-4">Weekly Availability</h2>
          <div className="space-y-3">
            {Object.entries(avail).map(([day, isAvailable]) => (
              <div key={day} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                <span className="text-sm text-[#374151] capitalize font-medium">{day}</span>
                <div className="flex items-center gap-3">
                  {isAvailable && <span className="text-xs text-[#64748B]">9:00 AM — 5:00 PM</span>}
                  <button onClick={() => setAvail(prev => ({ ...prev, [day]: !prev[day] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${isAvailable ? 'bg-[#1E40AF]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => toast.success('Availability saved')} className="btn-primary mt-4">Save Availability</button>
        </div>
      )}

      {tab === 'fees' && (
        <div className="card max-w-md">
          <h2 className="font-semibold text-[#0F172A] mb-4">Consultation Fees</h2>
          <div className="space-y-4">
            {[
              { key: 'video', label: 'Video Consultation', icon: Video },
              { key: 'audio', label: 'Audio Consultation', icon: Phone },
              { key: 'chat', label: 'Chat Consultation', icon: MessageSquare },
            ].map(fee => (
              <div key={fee.key} className="flex items-center gap-4 p-3 border border-[#E2E8F0] rounded-lg">
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center"><fee.icon className="w-4 h-4 text-[#1E40AF]" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#0F172A]">{fee.label}</div>
                  <div className="text-xs text-[#64748B]">Per session</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[#64748B]">$</span>
                  <input type="number" className="input w-20 text-right py-1.5 text-sm font-bold" value={fees[fee.key]} onChange={e => setFees(f => ({ ...f, [fee.key]: +e.target.value }))} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => toast.success('Fees updated')} className="btn-primary mt-4">Update Fees</button>
        </div>
      )}

      {editing && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => { setEditing(false); toast.success('Profile saved'); }} className="btn-primary shadow-lg flex items-center gap-2 px-6 py-3">
            <Check className="w-4 h-4" />Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
