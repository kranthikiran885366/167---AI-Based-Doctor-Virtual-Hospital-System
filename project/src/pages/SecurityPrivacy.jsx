import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Smartphone, Monitor, Globe, AlertTriangle, CheckCircle, Bell, Trash2, Clock, LogOut, Key, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SESSIONS = [
  { id: 1, device: 'Chrome · Windows 10', location: 'New York, NY', ip: '192.168.1.100', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'Safari · iPhone 15', location: 'New York, NY', ip: '10.0.0.5', lastActive: '3 hours ago', current: false },
  { id: 3, device: 'Firefox · macOS', location: 'New Jersey, NJ', ip: '172.16.0.8', lastActive: '2 days ago', current: false },
];

const ACTIVITY_LOG = [
  { event: 'Successful login', time: '2026-04-07 09:00', icon: CheckCircle, color: 'text-green-500', device: 'Chrome · Windows' },
  { event: 'Password changed', time: '2026-04-05 14:30', icon: Key, color: 'text-blue-500', device: 'Chrome · Windows' },
  { event: 'Failed login attempt', time: '2026-04-04 23:15', icon: AlertTriangle, color: 'text-red-500', device: 'Unknown device' },
  { event: '2FA enabled', time: '2026-04-03 11:00', icon: Shield, color: 'text-green-500', device: 'Chrome · Windows' },
];

function PasswordStrengthBar({ password }) {
  const criteria = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { test: /[0-9]/.test(password), label: 'One number' },
    { test: /[^A-Za-z0-9]/.test(password), label: 'One special character' },
  ];
  const score = criteria.filter(c => c.test).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-amber-400', 'bg-green-400', 'bg-green-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : 'bg-[#E2E8F0]'}`} />)}
      </div>
      {password && <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {criteria.map((c, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-[10px] ${c.test ? 'text-green-600' : 'text-[#94A3B8]'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${c.test ? 'bg-green-500' : 'bg-[#CBD5E1]'}`} />{c.label}
            </div>
          ))}
        </div>
        {score > 0 && <span className={`text-xs font-medium ${colors[score].replace('bg-', 'text-')}`}>{labels[score]}</span>}
      </div>}
    </div>
  );
}

export default function SecurityPrivacy() {
  const [tab, setTab] = useState('password');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoFA, setTwoFA] = useState(true);
  const [sessions, setSessions] = useState(SESSIONS);
  const [changingPw, setChangingPw] = useState(false);

  const changePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { toast.error('Fill all fields'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password too short'); return; }
    setChangingPw(true);
    await new Promise(r => setTimeout(r, 1500));
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setChangingPw(false);
    toast.success('Password changed successfully');
  };

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Session revoked');
  };

  const tabs = [
    { id: 'password', label: 'Password' },
    { id: 'two_fa', label: '2FA' },
    { id: 'sessions', label: 'Sessions', count: sessions.length },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Account</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Security</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Security & Privacy</h1>
        <p className="text-[#64748B] mt-1 text-sm">Manage your account security settings and active sessions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Password Strength', value: 'Strong', icon: Lock, cls: 'text-green-600', bg: 'bg-green-50' },
          { label: '2FA Status', value: twoFA ? 'Enabled' : 'Disabled', icon: Smartphone, cls: twoFA ? 'text-green-600' : 'text-red-600', bg: twoFA ? 'bg-green-50' : 'bg-red-50' },
          { label: 'Active Sessions', value: sessions.length, icon: Monitor, cls: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
          { label: 'Security Score', value: '87/100', icon: Shield, cls: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.cls}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>
            {t.label}
            {t.count && <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'password' && (
        <div className="card max-w-md">
          <h2 className="font-semibold text-[#0F172A] mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#64748B] mb-1">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} className="input pr-10" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
                <button onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#64748B] mb-1">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} className="input pr-10" value={newPw} onChange={e => setNewPw(e.target.value)} />
                <button onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
              <PasswordStrengthBar password={newPw} />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] mb-1">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} className={`input pr-10 ${confirmPw && newPw !== confirmPw ? 'border-red-400' : ''}`} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                <button onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
              {confirmPw && newPw !== confirmPw && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>
          </div>
          <button onClick={changePassword} disabled={changingPw} className="btn-primary mt-6 w-full flex items-center justify-center gap-2">
            {changingPw ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing...</> : <><Lock className="w-4 h-4" />Change Password</>}
          </button>
        </div>
      )}

      {tab === 'two_fa' && (
        <div className="card max-w-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${twoFA ? 'bg-green-100' : 'bg-red-100'}`}>
              <Smartphone className={`w-6 h-6 ${twoFA ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F172A]">Two-Factor Authentication</h2>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium border ${twoFA ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{twoFA ? 'Enabled' : 'Disabled'}</span>
              </div>
              <p className="text-sm text-[#64748B] mt-1">Add an extra layer of security to your account with two-factor authentication.</p>
            </div>
          </div>
          {twoFA ? (
            <div className="space-y-3">
              {[
                { method: 'Authenticator App', desc: 'Use Google Authenticator or similar', active: true },
                { method: 'SMS Verification', desc: 'Text message to +1 (555) ***-1234', active: false },
                { method: 'Email OTP', desc: 'One-time code to your email', active: false },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${m.active ? 'bg-green-500' : 'bg-[#CBD5E1]'}`} />
                  <div className="flex-1"><div className="text-sm font-medium text-[#0F172A]">{m.method}</div><div className="text-xs text-[#64748B]">{m.desc}</div></div>
                  <button onClick={() => toast.info(`Configuring ${m.method}...`)} className="text-xs text-[#1E40AF] font-medium">{m.active ? 'Manage' : 'Enable'}</button>
                </div>
              ))}
              <button onClick={() => { setTwoFA(false); toast.info('2FA disabled'); }} className="btn-secondary text-red-600 border-red-200 mt-4 w-full">Disable 2FA</button>
            </div>
          ) : (
            <button onClick={() => { setTwoFA(true); toast.success('2FA enabled'); }} className="btn-primary w-full flex items-center justify-center gap-2"><Shield className="w-4 h-4" />Enable 2FA</button>
          )}
        </div>
      )}

      {tab === 'sessions' && (
        <div className="space-y-3 max-w-2xl">
          {sessions.map(session => (
            <div key={session.id} className={`card ${session.current ? 'border-[#1E40AF]' : ''}`}>
              <div className="flex items-start gap-3">
                <Monitor className={`w-5 h-5 flex-shrink-0 mt-0.5 ${session.current ? 'text-[#1E40AF]' : 'text-[#64748B]'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#0F172A] text-sm">{session.device}</span>
                    {session.current && <span className="text-[10px] px-1.5 py-0.5 bg-[#EFF6FF] text-[#1E40AF] border border-blue-200 rounded">Current</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
                    <span>{session.location}</span>
                    <span>·</span>
                    <span>{session.ip}</span>
                    <span>·</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
                {!session.current && (
                  <button onClick={() => revokeSession(session.id)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-2 py-1.5 rounded-lg"><LogOut className="w-3.5 h-3.5" />Revoke</button>
                )}
              </div>
            </div>
          ))}
          {sessions.length > 1 && (
            <button onClick={() => { setSessions(prev => prev.filter(s => s.current)); toast.success('All other sessions revoked'); }} className="btn-secondary text-red-600 border-red-200 w-full">Revoke All Other Sessions</button>
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="space-y-3 max-w-2xl">
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} className="card flex items-start gap-4">
              <log.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${log.color}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#0F172A]">{log.event}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]"><Clock className="w-3 h-3" />{log.time}<span>·</span><span>{log.device}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
