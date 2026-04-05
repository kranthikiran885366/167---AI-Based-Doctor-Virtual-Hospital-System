import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Key, AlertTriangle, CheckCircle, Smartphone, Globe, Users, FileText, Bell, Download, Trash2, Clock, Activity, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SecurityPrivacy() {
  const [tab, setTab] = useState('security');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });

  const calcStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const ACTIVITY_LOG = [
    { action: 'Login', location: 'New York, US', device: 'Chrome · Windows', time: 'Just now', success: true },
    { action: 'Password changed', location: 'New York, US', device: 'Chrome · Windows', time: '3 days ago', success: true },
    { action: 'Failed login attempt', location: 'Unknown', device: 'Unknown browser', time: '5 days ago', success: false },
    { action: 'Profile updated', location: 'New York, US', device: 'Safari · iPhone', time: '1 week ago', success: true },
    { action: 'Data export', location: 'New York, US', device: 'Chrome · Windows', time: '2 weeks ago', success: true },
  ];

  const PRIVACY_SETTINGS = [
    { key: 'profileVisible', label: 'Profile Visibility', desc: 'Allow other doctors to find and view your profile', enabled: true },
    { key: 'activityStatus', label: 'Activity Status', desc: 'Show when you are online to patients', enabled: true },
    { key: 'analyticsSharing', label: 'Analytics Sharing', desc: 'Share anonymized usage data to improve the platform', enabled: false },
    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive product updates and newsletters', enabled: false },
  ];

  const [privacy, setPrivacy] = useState(PRIVACY_SETTINGS.reduce((acc, s) => ({ ...acc, [s.key]: s.enabled }), {}));

  const updatePassword = () => {
    if (!passwords.current || !passwords.newPw || !passwords.confirm) { toast.error('All fields required'); return; }
    if (passwords.newPw !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwordStrength < 3) { toast.error('Password too weak'); return; }
    toast.success('Password updated successfully');
    setPasswords({ current: '', newPw: '', confirm: '' });
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Account</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Security & Privacy</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Security & Privacy</h1>
        <p className="text-[#64748B] mt-1 text-sm">Manage your account security, privacy settings, and access logs</p>
      </div>

      {/* Security Score */}
      <div className="card mb-6 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80 mb-1">Security Score</div>
            <div className="text-4xl font-bold">72 / 100</div>
            <div className="text-sm opacity-80 mt-1">Good — enable 2FA to improve</div>
          </div>
          <Shield className="w-16 h-16 opacity-20" />
        </div>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '72%' }} />
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
            }`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'security' && (
        <div className="space-y-6">
          {/* Password */}
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs text-[#64748B] mb-1">Current Password</label>
                <div className="relative">
                  <input type={showCurrentPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                  <button onClick={() => setShowCurrentPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#64748B] mb-1">New Password</label>
                <div className="relative">
                  <input type={showNewPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={passwords.newPw} onChange={e => { setPasswords(p => ({ ...p, newPw: e.target.value })); setPasswordStrength(calcStrength(e.target.value)); }} />
                  <button onClick={() => setShowNewPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                {passwords.newPw && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-[#E2E8F0]'}`} />)}
                    </div>
                    <div className="text-xs text-[#64748B]">{strengthLabel[passwordStrength]}</div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-[#64748B] mb-1">Confirm New Password</label>
                <input type="password" className="input" placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                {passwords.confirm && passwords.newPw !== passwords.confirm && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
              </div>
              <button onClick={updatePassword} className="btn-primary">Update Password</button>
            </div>
          </div>

          {/* 2FA */}
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Two-Factor Authentication</h2>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-[#1E40AF]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#0F172A]">Authenticator App</div>
                <div className="text-sm text-[#64748B]">Use Google Authenticator, Authy, or similar app for 2FA</div>
                <div className={`text-xs mt-1 font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-amber-600'}`}>{twoFactorEnabled ? '✓ Enabled' : 'Not enabled — recommended'}</div>
              </div>
              <button onClick={() => { setTwoFactorEnabled(e => !e); toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled'); }}
                className={`btn-secondary text-sm ${twoFactorEnabled ? 'text-red-600 border-red-200' : ''}`}>
                {twoFactorEnabled ? 'Disable' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          {/* Sessions */}
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {[
                { device: 'Chrome — Windows 11', location: 'New York, US', time: 'Active now', current: true },
                { device: 'Safari — iPhone 14', location: 'New York, US', time: '2 hours ago', current: false },
                { device: 'Firefox — MacOS', location: 'Boston, US', time: '3 days ago', current: false },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#64748B]" />
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm">{session.device}</div>
                      <div className="text-xs text-[#64748B]">{session.location} · {session.time}</div>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Current</span>
                  ) : (
                    <button onClick={() => toast.success('Session revoked')} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X className="w-3 h-3" />Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Privacy Settings</h2>
            <div className="space-y-3">
              {PRIVACY_SETTINGS.map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                  <div>
                    <div className="font-medium text-[#0F172A] text-sm">{setting.label}</div>
                    <div className="text-xs text-[#64748B]">{setting.desc}</div>
                  </div>
                  <button onClick={() => { setPrivacy(p => ({ ...p, [setting.key]: !p[setting.key] })); toast.success('Setting updated'); }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${privacy[setting.key] ? 'bg-[#1E40AF]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${privacy[setting.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Data Rights</h2>
            <div className="space-y-3">
              <button onClick={() => toast.info('Preparing data export...')} className="w-full text-left flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] transition-colors">
                <Download className="w-4 h-4 text-[#1E40AF]" />
                <div><div className="font-medium text-[#0F172A] text-sm">Download My Data</div><div className="text-xs text-[#64748B]">Export all data as JSON</div></div>
              </button>
              <button onClick={() => toast.error('Account deletion requires email verification')} className="w-full text-left flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
                <div><div className="font-medium text-red-600 text-sm">Delete Account</div><div className="text-xs text-red-400">Irreversible — all data will be deleted</div></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card">
          <h2 className="font-semibold text-[#0F172A] mb-4">Security Activity Log</h2>
          <div className="space-y-3">
            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border border-[#E2E8F0] rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${entry.success ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#0F172A] text-sm">{entry.action}</span>
                    {!entry.success && <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded">Failed</span>}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">{entry.location} · {entry.device}</div>
                </div>
                <span className="text-xs text-[#94A3B8] flex-shrink-0">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
