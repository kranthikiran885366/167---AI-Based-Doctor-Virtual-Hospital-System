import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Edit, Save, X, Shield, Bell, Globe, Heart, Activity, Pill, FileText, Download, Trash2, Settings, Star, Award, Clock, CheckCircle, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ar', label: 'العربية' },
];

export default function Profile() {
  const { user, medicalHistory, prescriptions, language, setLanguage } = useUser();
  const [tab, setTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. User',
    email: user?.email || 'user@example.com',
    phone: '+1 (555) 000-0000',
    specialty: 'General Medicine',
    license: 'MD-123456',
    address: '123 Medical Center Dr, New York, NY',
    bio: 'Experienced physician committed to patient-centered care with over 10 years in clinical practice.',
    photo: null,
  });
  const [notifications, setNotifications] = useState({
    email: true, sms: true, push: true, appointments: true, results: true, messages: true, updates: false,
  });

  const save = () => {
    setEditing(false);
    toast.success('Profile updated');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'medical', label: 'Medical Records', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Account</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Profile</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">My Profile</h1>
        <p className="text-[#64748B] mt-1 text-sm">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card text-center">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-[#1E40AF] flex items-center justify-center mx-auto">
                {profile.photo ? <img src={profile.photo} alt={profile.name} className="w-20 h-20 rounded-full object-cover" /> : <span className="text-3xl font-bold text-white">{profile.name[0]}</span>}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center hover:border-[#1E40AF] transition-colors">
                <Camera className="w-3 h-3 text-[#64748B]" />
              </button>
            </div>
            <div className="font-semibold text-[#0F172A]">{profile.name}</div>
            <div className="text-xs text-[#64748B]">{profile.specialty}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs text-green-600">Online</span>
            </div>
          </div>

          <div className="card p-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  tab === t.id ? 'bg-[#EFF6FF] text-[#1E40AF] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}>
                <t.icon className="w-4 h-4 flex-shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* PERSONAL INFO */}
            {tab === 'personal' && (
              <motion.div key="personal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-[#0F172A]">Personal Information</h2>
                  {editing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1"><X className="w-4 h-4" />Cancel</button>
                      <button onClick={save} className="btn-primary flex items-center gap-1"><Save className="w-4 h-4" />Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-1"><Edit className="w-4 h-4" />Edit</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name' },
                    { key: 'email', label: 'Email Address', type: 'email' },
                    { key: 'phone', label: 'Phone Number', type: 'tel' },
                    { key: 'specialty', label: 'Specialty' },
                    { key: 'license', label: 'License Number' },
                    { key: 'address', label: 'Address', span: 2 },
                    { key: 'bio', label: 'Bio', span: 2, multiline: true },
                  ].map(f => (
                    <div key={f.key} className={f.span === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs text-[#64748B] mb-1">{f.label}</label>
                      {editing ? (
                        f.multiline ? (
                          <textarea className="input resize-none h-20" value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                        ) : (
                          <input type={f.type || 'text'} className="input" value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                        )
                      ) : (
                        <div className={`text-sm text-[#0F172A] ${f.multiline ? 'text-[#374151]' : 'font-medium'}`}>{profile[f.key] || '—'}</div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MEDICAL RECORDS */}
            {tab === 'medical' && (
              <motion.div key="medical" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#0F172A]">Medical History</h2>
                    <span className="text-xs text-[#94A3B8]">{medicalHistory.length} records</span>
                  </div>
                  {medicalHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                      <p className="text-sm text-[#64748B]">No medical records yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {medicalHistory.slice(0, 5).map((record, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                          <FileText className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#0F172A]">{record.type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                            <div className="text-xs text-[#94A3B8]">{new Date(record.timestamp).toLocaleDateString()}</div>
                          </div>
                          <button className="text-[#64748B] hover:text-[#1E40AF]"><Eye className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#0F172A]">Prescriptions</h2>
                    <span className="text-xs text-[#94A3B8]">{prescriptions.length} records</span>
                  </div>
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                      <p className="text-sm text-[#64748B]">No prescriptions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {prescriptions.slice(0, 5).map((rx, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                          <Pill className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#0F172A]">{rx.rxNumber || `RX-${i + 1}`}</div>
                            <div className="text-xs text-[#94A3B8]">{new Date(rx.timestamp).toLocaleDateString()}</div>
                          </div>
                          <button onClick={() => toast.info('Downloading...')}><Download className="w-4 h-4 text-[#64748B]" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <motion.div key="notif" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card">
                <h2 className="font-semibold text-[#0F172A] mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser and app push notifications' },
                    { key: 'appointments', label: 'Appointment Reminders', desc: 'Reminders 24h before appointments' },
                    { key: 'results', label: 'Lab Results', desc: 'Notifications when lab results are ready' },
                    { key: 'messages', label: 'Messages', desc: 'Notifications for new messages' },
                    { key: 'updates', label: 'Platform Updates', desc: 'Feature updates and announcements' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{n.label}</div>
                        <div className="text-xs text-[#64748B]">{n.desc}</div>
                      </div>
                      <button onClick={() => { setNotifications(p => ({ ...p, [n.key]: !p[n.key] })); toast.success('Preference updated'); }}
                        className={`w-11 h-6 rounded-full transition-colors relative ${notifications[n.key] ? 'bg-[#1E40AF]' : 'bg-[#CBD5E1]'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications[n.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success('Preferences saved')} className="btn-primary mt-6">Save Preferences</button>
              </motion.div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Change Password</h2>
                  <div className="space-y-3 max-w-sm">
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Current Password</label>
                      <div className="relative"><input type={showPassword ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" /><button onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                    </div>
                    <div><label className="block text-xs text-[#64748B] mb-1">New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
                    <div><label className="block text-xs text-[#64748B] mb-1">Confirm New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
                    <button onClick={() => toast.success('Password updated')} className="btn-primary">Update Password</button>
                  </div>
                </div>
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Two-Factor Authentication</h2>
                  <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm">Authenticator App</div>
                      <div className="text-xs text-[#64748B]">Use Google Authenticator or similar</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-red-500">Not enabled</span>
                      <button onClick={() => toast.info('2FA setup flow...')} className="btn-secondary text-sm py-1.5 px-3">Enable</button>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome — Windows 11', location: 'New York, US', time: 'Active now', current: true },
                      { device: 'Safari — iPhone 14', location: 'New York, US', time: '2 hours ago', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                        <div>
                          <div className="font-medium text-[#0F172A] text-sm">{session.device}</div>
                          <div className="text-xs text-[#64748B]">{session.location} · {session.time}</div>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-green-600 font-medium">Current</span>
                        ) : (
                          <button onClick={() => toast.info('Session revoked')} className="text-xs text-red-500 hover:text-red-700">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PREFERENCES */}
            {tab === 'preferences' && (
              <motion.div key="prefs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Language</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                      <button key={lang.code} onClick={() => { setLanguage(lang.code); toast.success(`Language set to ${lang.label}`); }}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${language === lang.code ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#E2E8F0] text-[#374151] hover:border-[#1E40AF]'}`}>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Data & Privacy</h2>
                  <div className="space-y-3">
                    <button onClick={() => toast.info('Downloading data...')} className="w-full text-left flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] transition-colors">
                      <Download className="w-4 h-4 text-[#1E40AF]" />
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">Download My Data</div>
                        <div className="text-xs text-[#64748B]">Export all your data in JSON format</div>
                      </div>
                    </button>
                    <button onClick={() => toast.error('Account deletion requires email confirmation')} className="w-full text-left flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <div>
                        <div className="font-medium text-red-600 text-sm">Delete Account</div>
                        <div className="text-xs text-red-400">Permanently delete your account and data</div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
