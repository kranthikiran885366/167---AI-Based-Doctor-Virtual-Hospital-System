import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Globe, Settings, Filter, Search, ChevronLeft, ChevronRight, Video, Phone, MessageSquare, MapPin, Bell, User, Stethoscope, Star, DollarSign, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9am - 5pm

const INITIAL_APPOINTMENTS = [
  { id: 1, patientName: 'John Smith', patientPhoto: 'https://i.pravatar.cc/100?img=1', date: '2026-04-07', time: '09:00', duration: 30, type: 'consultation', mode: 'video', status: 'confirmed', reason: 'Chest pain follow-up', fee: 200, priority: 'urgent' },
  { id: 2, patientName: 'Maria Garcia', patientPhoto: 'https://i.pravatar.cc/100?img=5', date: '2026-04-07', time: '10:00', duration: 45, type: 'follow-up', mode: 'in-person', status: 'confirmed', reason: 'Diabetes management', fee: 150, priority: 'normal' },
  { id: 3, patientName: 'Robert Chen', patientPhoto: 'https://i.pravatar.cc/100?img=3', date: '2026-04-08', time: '11:00', duration: 60, type: 'new-patient', mode: 'video', status: 'pending', reason: 'General checkup', fee: 250, priority: 'normal' },
  { id: 4, patientName: 'Sarah Johnson', patientPhoto: 'https://i.pravatar.cc/100?img=9', date: '2026-04-09', time: '14:00', duration: 30, type: 'follow-up', mode: 'phone', status: 'confirmed', reason: 'Post-op review', fee: 100, priority: 'normal' },
  { id: 5, patientName: 'Michael Brown', patientPhoto: 'https://i.pravatar.cc/100?img=7', date: '2026-04-10', time: '15:00', duration: 45, type: 'emergency', mode: 'in-person', status: 'confirmed', reason: 'Acute pain', fee: 300, priority: 'urgent' },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700 border-red-200' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const MODE_ICONS = { video: Video, 'in-person': User, phone: Phone };

export default function SchedulingManagement() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 7)); // April 7 2026
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tab, setTab] = useState('calendar');

  const [newAppt, setNewAppt] = useState({ patientName: '', date: '', time: '09:00', duration: 30, mode: 'video', reason: '', fee: 200, type: 'consultation' });

  const getWeekDates = () => {
    const day = currentDate.getDay();
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  };

  const weekDates = getWeekDates();

  const getAppointmentsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(a => a.date === dateStr);
  };

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };

  const saveNewAppt = () => {
    if (!newAppt.patientName || !newAppt.date) { toast.error('Fill in required fields'); return; }
    const appt = { id: Date.now(), ...newAppt, patientPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(newAppt.patientName)}&background=1E40AF&color=fff`, status: 'pending', priority: 'normal' };
    setAppointments(prev => [...prev, appt]);
    setShowNew(false);
    setNewAppt({ patientName: '', date: '', time: '09:00', duration: 30, mode: 'video', reason: '', fee: 200, type: 'consultation' });
    toast.success('Appointment scheduled');
  };

  const cancelAppt = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    setSelectedAppt(null);
    toast.info('Appointment cancelled');
  };

  const filtered = appointments.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === '2026-04-07').length,
    revenue: appointments.filter(a => a.status === 'confirmed').reduce((s, a) => s + a.fee, 0),
    pending: appointments.filter(a => a.status === 'pending').length,
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'list', label: 'List View' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Practice</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Scheduling</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Scheduling</h1>
            <p className="text-[#64748B] mt-1 text-sm">Manage appointments, availability, and patient scheduling</p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />New Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
          { label: 'Today', value: stats.today, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Revenue Scheduled', value: '$' + stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Confirm', value: stats.pending, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
            }`}>{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <motion.div key="cal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card">
              {/* Calendar Nav */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={prevWeek} className="p-1.5 border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] text-[#64748B] hover:text-[#1E40AF]"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-semibold text-[#0F172A]">
                    {MONTHS[weekDates[0].getMonth()]} {weekDates[0].getDate()} — {MONTHS[weekDates[6].getMonth()]} {weekDates[6].getDate()}, {weekDates[0].getFullYear()}
                  </span>
                  <button onClick={nextWeek} className="p-1.5 border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] text-[#64748B] hover:text-[#1E40AF]"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setCurrentDate(new Date())} className="text-xs text-[#1E40AF] hover:underline">Today</button>
              </div>

              {/* Week Grid */}
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, i) => {
                  const dayAppts = getAppointmentsForDay(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className={`rounded-lg p-2 min-h-[120px] border ${isToday ? 'border-[#1E40AF] bg-[#F8FAFF]' : 'border-[#E2E8F0]'}`}>
                      <div className={`text-xs font-medium mb-2 ${isToday ? 'text-[#1E40AF]' : 'text-[#64748B]'}`}>
                        <div>{DAYS[date.getDay()]}</div>
                        <div className={`text-base font-bold ${isToday ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{date.getDate()}</div>
                      </div>
                      <div className="space-y-1">
                        {dayAppts.slice(0, 3).map(appt => {
                          const ModeIcon = MODE_ICONS[appt.mode] || User;
                          return (
                            <div key={appt.id}
                              onClick={() => setSelectedAppt(appt)}
                              className={`px-1.5 py-1 rounded text-[10px] cursor-pointer border transition-colors hover:opacity-80 ${
                                appt.priority === 'urgent' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-[#EFF6FF] border-blue-200 text-[#1E40AF]'
                              }`}>
                              <div className="font-medium truncate">{appt.time} {appt.patientName.split(' ')[0]}</div>
                            </div>
                          );
                        })}
                        {dayAppts.length > 3 && <div className="text-[10px] text-[#94A3B8] pl-1">+{dayAppts.length - 3} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* LIST TAB */}
        {tab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-3">
              {filtered.map(appt => {
                const ModeIcon = MODE_ICONS[appt.mode] || User;
                const status = STATUS_CONFIG[appt.status];
                return (
                  <div key={appt.id} className="card hover:border-[#1E40AF] transition-colors cursor-pointer" onClick={() => setSelectedAppt(appt)}>
                    <div className="flex items-center gap-4">
                      <img src={appt.patientPhoto} alt={appt.patientName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.patientName)}&background=1E40AF&color=fff`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[#0F172A] text-sm">{appt.patientName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${status.cls}`}>{status.label}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-xs text-[#64748B]"><Calendar className="w-3 h-3" />{appt.date}</span>
                          <span className="flex items-center gap-1 text-xs text-[#64748B]"><Clock className="w-3 h-3" />{appt.time} ({appt.duration}min)</span>
                          <span className="flex items-center gap-1 text-xs text-[#64748B]"><ModeIcon className="w-3 h-3" />{appt.mode}</span>
                          <span className="text-xs text-[#64748B]">${appt.fee}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1">{appt.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={e => { e.stopPropagation(); toast.info(`Starting ${appt.mode} call...`); }} className="btn-primary text-xs py-1.5 px-3">Join</button>
                        <button onClick={e => { e.stopPropagation(); cancelAppt(appt.id); }} className="p-1.5 text-[#64748B] hover:text-red-500 border border-[#E2E8F0] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-[#0F172A]">Appointment Details</h3>
                  <button onClick={() => setSelectedAppt(null)} className="text-[#94A3B8] hover:text-[#0F172A]"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-lg">
                  <img src={selectedAppt.patientPhoto} alt={selectedAppt.patientName} className="w-12 h-12 rounded-full" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAppt.patientName)}&background=1E40AF&color=fff`} />
                  <div>
                    <div className="font-semibold text-[#0F172A]">{selectedAppt.patientName}</div>
                    <div className="text-xs text-[#64748B]">{selectedAppt.type} · {selectedAppt.mode}</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Date', value: selectedAppt.date },
                    { label: 'Time', value: `${selectedAppt.time} (${selectedAppt.duration} minutes)` },
                    { label: 'Reason', value: selectedAppt.reason },
                    { label: 'Fee', value: `$${selectedAppt.fee}` },
                    { label: 'Status', value: STATUS_CONFIG[selectedAppt.status]?.label },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-[#64748B]">{item.label}</span>
                      <span className="font-medium text-[#0F172A]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { toast.info('Joining consultation...'); setSelectedAppt(null); }} className="btn-primary flex-1">Join Now</button>
                  <button onClick={() => cancelAppt(selectedAppt.id)} className="btn-secondary text-red-600 border-red-200 flex-1">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-[#0F172A]">New Appointment</h3>
                  <button onClick={() => setShowNew(false)} className="text-[#94A3B8] hover:text-[#0F172A]"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={newAppt.patientName} onChange={e => setNewAppt(p => ({ ...p, patientName: e.target.value }))} placeholder="Full name" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-[#64748B] mb-1">Date *</label><input type="date" className="input" value={newAppt.date} onChange={e => setNewAppt(p => ({ ...p, date: e.target.value }))} /></div>
                    <div><label className="block text-xs text-[#64748B] mb-1">Time</label><input type="time" className="input" value={newAppt.time} onChange={e => setNewAppt(p => ({ ...p, time: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-[#64748B] mb-1">Mode</label>
                      <select className="input" value={newAppt.mode} onChange={e => setNewAppt(p => ({ ...p, mode: e.target.value }))}>
                        <option value="video">Video</option><option value="in-person">In-person</option><option value="phone">Phone</option>
                      </select>
                    </div>
                    <div><label className="block text-xs text-[#64748B] mb-1">Duration (min)</label><input type="number" className="input" value={newAppt.duration} onChange={e => setNewAppt(p => ({ ...p, duration: +e.target.value }))} /></div>
                  </div>
                  <div><label className="block text-xs text-[#64748B] mb-1">Reason</label><input className="input" value={newAppt.reason} onChange={e => setNewAppt(p => ({ ...p, reason: e.target.value }))} placeholder="Visit reason" /></div>
                  <div><label className="block text-xs text-[#64748B] mb-1">Fee ($)</label><input type="number" className="input" value={newAppt.fee} onChange={e => setNewAppt(p => ({ ...p, fee: +e.target.value }))} /></div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveNewAppt} className="btn-primary flex-1 flex items-center justify-center gap-2"><Save className="w-4 h-4" />Schedule</button>
                  <button onClick={() => setShowNew(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
