import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, Shield, Settings, Bell, Database, TrendingUp, AlertTriangle, CheckCircle, Clock, Search, Filter, Plus, Edit, Trash2, Eye, Download, Globe, Lock, Star, BarChart3, Zap, UserCheck, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', status: 'active', patients: 234, rating: 4.9, revenue: '$48,200', joined: '2022-03-15' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', status: 'active', patients: 189, rating: 4.8, revenue: '$39,600', joined: '2021-08-20' },
  { id: 3, name: 'Dr. Emily Park', specialty: 'Pediatrics', status: 'inactive', patients: 156, rating: 4.7, revenue: '$28,900', joined: '2023-01-10' },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', status: 'pending', patients: 0, rating: 0, revenue: '$0', joined: '2026-04-01' },
];

const SYSTEM_ALERTS = [
  { type: 'warning', message: 'High server load detected (78%)', time: '5 min ago' },
  { type: 'info', message: 'New doctor registration pending review', time: '20 min ago' },
  { type: 'error', message: 'Payment gateway timeout — 3 failed transactions', time: '1 hour ago' },
  { type: 'success', message: 'Database backup completed', time: '2 hours ago' },
];

const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: { size: 11 } } }, x: { grid: { display: false }, ticks: { color: '#64748B' } } } };

export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState(DOCTORS);

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
    { label: 'Active Doctors', value: '124', change: '+5%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Monthly Revenue', value: '$284K', change: '+18%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Open Tickets', value: '7', change: '-3', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const usageData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [420, 580, 490, 620, 710, 340, 280], backgroundColor: '#1E40AF', borderRadius: 6 }] };
  const revenueData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ data: [220, 248, 232, 270, 258, 284], borderColor: '#1E40AF', backgroundColor: 'rgba(30,64,175,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#1E40AF', pointRadius: 4 }] };

  const toggleDoctorStatus = (id) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d));
    toast.success('Doctor status updated');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'system', label: 'System' },
  ];

  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Administration</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Control Panel</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Admin Panel</h1>
            <p className="text-[#64748B] mt-1 text-sm">System management, analytics, and user administration</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">All Systems Operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
                <div className="text-xs text-green-600 mt-0.5 font-medium">{s.change}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-[#0F172A]">Daily Usage</h2><span className="text-xs text-[#94A3B8]">Consultations this week</span></div>
              <Bar data={usageData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} height={160} />
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-[#0F172A]">Revenue ($K)</h2><span className="text-xs text-[#94A3B8]">Last 6 months</span></div>
              <Line data={revenueData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } }, elements: { line: { tension: 0.4 } } }} height={160} />
            </div>

            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">System Alerts</h2>
              <div className="space-y-3">
                {SYSTEM_ALERTS.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.type === 'error' ? 'bg-red-50 border-red-200' : alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 text-sm text-[#374151]">{alert.message}</div>
                    <span className="text-xs text-[#94A3B8] flex-shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Quick Stats</h2>
              <div className="space-y-3">
                {[
                  { label: 'Uptime', value: '99.97%', status: 'healthy' },
                  { label: 'API Response Time', value: '142ms', status: 'healthy' },
                  { label: 'Database Usage', value: '42.3 GB / 100 GB', status: 'healthy' },
                  { label: 'Active Sessions', value: '847', status: 'healthy' },
                  { label: 'Cache Hit Rate', value: '94.2%', status: 'healthy' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border border-[#E2E8F0] rounded-lg">
                    <span className="text-sm text-[#374151]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#0F172A] text-sm">{item.value}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'doctors' && (
          <motion.div key="doctors" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button onClick={() => toast.info('Add doctor form...')} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Doctor</button>
            </div>
            <div className="space-y-3">
              {filtered.map(doctor => (
                <div key={doctor.id} className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-[#1E40AF] text-sm">{doctor.name.split(' ').slice(-1)[0][0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#0F172A] text-sm">{doctor.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize ${doctor.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : doctor.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{doctor.status}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-xs text-[#64748B]">{doctor.specialty}</span>
                        <span className="text-xs text-[#94A3B8]">{doctor.patients} patients</span>
                        {doctor.rating > 0 && <span className="flex items-center gap-0.5 text-xs text-[#94A3B8]"><Star className="w-3 h-3 text-amber-400" />{doctor.rating}</span>}
                        <span className="text-xs text-[#94A3B8]">{doctor.revenue} revenue</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleDoctorStatus(doctor.id)} className={`btn-secondary text-xs py-1.5 px-3 ${doctor.status === 'active' ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
                        {doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => toast.info(`Viewing ${doctor.name}`)} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setDoctors(prev => prev.filter(d => d.id !== doctor.id)); toast.success('Doctor removed'); }} className="p-1.5 text-[#64748B] hover:text-red-500 border border-[#E2E8F0] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'system' && (
          <motion.div key="system" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">System Configuration</h2>
              <div className="space-y-3">
                {[
                  { label: 'Maintenance Mode', desc: 'Temporarily disable access for maintenance', enabled: false, key: 'maintenance' },
                  { label: 'New Registrations', desc: 'Allow new doctor registrations', enabled: true, key: 'registrations' },
                  { label: 'AI Features', desc: 'Enable AI-powered diagnostic features', enabled: true, key: 'ai' },
                  { label: 'Email Notifications', desc: 'Send automated email notifications', enabled: true, key: 'email' },
                  { label: 'Analytics Collection', desc: 'Collect anonymized usage analytics', enabled: false, key: 'analytics' },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm">{setting.label}</div>
                      <div className="text-xs text-[#64748B]">{setting.desc}</div>
                    </div>
                    <button onClick={() => toast.success(`${setting.label} toggled`)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${setting.enabled ? 'bg-[#1E40AF]' : 'bg-[#CBD5E1]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Clear Cache', icon: RefreshCw, action: () => toast.success('Cache cleared') },
                  { label: 'Backup Database', icon: Database, action: () => toast.success('Backup started') },
                  { label: 'Export Logs', icon: Download, action: () => toast.info('Exporting logs...') },
                  { label: 'Send Notification', icon: Bell, action: () => toast.info('Notification sent') },
                ].map((action, i) => (
                  <button key={i} onClick={action.action} className="btn-secondary flex items-center gap-2 justify-center">
                    <action.icon className="w-4 h-4" />{action.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
