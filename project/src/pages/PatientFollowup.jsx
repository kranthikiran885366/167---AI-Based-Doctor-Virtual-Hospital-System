import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, User, Bell, CheckCircle, AlertTriangle, Plus, Search, Phone, Video, MessageSquare, Edit, Trash2, ChevronRight, Activity, Pill, FileText, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const FOLLOWUPS = [
  { id: 1, patient: 'John Smith', age: 45, condition: 'Hypertension + Chest pain', lastVisit: '2026-03-28', nextDue: '2026-04-14', daysLeft: 7, type: 'video', priority: 'urgent', status: 'due', notes: 'Check BP response to new medication', photo: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, patient: 'Maria Garcia', age: 32, condition: 'Type 2 Diabetes', lastVisit: '2026-03-15', nextDue: '2026-04-15', daysLeft: 8, type: 'in-person', priority: 'normal', status: 'scheduled', notes: 'HbA1c recheck', photo: 'https://i.pravatar.cc/100?img=5' },
  { id: 3, patient: 'Robert Chen', age: 58, condition: 'Post-op knee replacement', lastVisit: '2026-04-01', nextDue: '2026-04-08', daysLeft: 1, type: 'video', priority: 'urgent', status: 'overdue', notes: 'Check wound healing and ROM', photo: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, patient: 'Sarah Johnson', age: 28, condition: 'Asthma management', lastVisit: '2026-02-20', nextDue: '2026-05-20', daysLeft: 44, type: 'phone', priority: 'normal', status: 'upcoming', notes: 'Annual review', photo: 'https://i.pravatar.cc/100?img=9' },
  { id: 5, patient: 'Michael Brown', age: 65, condition: 'COPD exacerbation', lastVisit: '2026-03-30', nextDue: '2026-04-10', daysLeft: 3, type: 'in-person', priority: 'urgent', status: 'scheduled', notes: 'Spirometry and medication adjustment', photo: 'https://i.pravatar.cc/100?img=7' },
];

const STATUS_CONFIG = {
  overdue: { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Overdue' },
  due: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Due Soon' },
  scheduled: { cls: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Scheduled' },
  upcoming: { cls: 'bg-green-100 text-green-700 border-green-200', label: 'Upcoming' },
};

export default function PatientFollowup() {
  const [followups, setFollowups] = useState(FOLLOWUPS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newFollowup, setNewFollowup] = useState({ patient: '', condition: '', nextDue: '', type: 'video', priority: 'normal', notes: '' });

  const filtered = followups.filter(f => {
    const matchSearch = f.patient.toLowerCase().includes(search.toLowerCase()) || f.condition.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || f.status === filter || f.priority === filter;
    return matchSearch && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => a.daysLeft - b.daysLeft);

  const addFollowup = () => {
    if (!newFollowup.patient || !newFollowup.nextDue) { toast.error('Fill required fields'); return; }
    const days = Math.ceil((new Date(newFollowup.nextDue) - new Date()) / (1000 * 60 * 60 * 24));
    setFollowups(prev => [...prev, {
      id: Date.now(),
      ...newFollowup,
      age: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      daysLeft: days,
      status: days < 0 ? 'overdue' : days <= 7 ? 'due' : 'upcoming',
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newFollowup.patient)}&background=1E40AF&color=fff`,
    }]);
    setShowAdd(false);
    setNewFollowup({ patient: '', condition: '', nextDue: '', type: 'video', priority: 'normal', notes: '' });
    toast.success('Follow-up added');
  };

  const markComplete = (id) => {
    setFollowups(prev => prev.filter(f => f.id !== id));
    setSelected(null);
    toast.success('Follow-up completed');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Clinical</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Follow-ups</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Patient Follow-up</h1>
            <p className="text-[#64748B] mt-1 text-sm">Track and manage patient follow-up appointments and care plans</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Follow-up</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overdue', value: followups.filter(f => f.status === 'overdue').length, cls: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
          { label: 'Due This Week', value: followups.filter(f => f.status === 'due').length, cls: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Scheduled', value: followups.filter(f => f.status === 'scheduled').length, cls: 'text-blue-600', bg: 'bg-[#EFF6FF]', icon: Calendar },
          { label: 'Upcoming', value: followups.filter(f => f.status === 'upcoming').length, cls: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.cls}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input className="input pl-9" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="overdue">Overdue</option>
          <option value="due">Due Soon</option>
          <option value="scheduled">Scheduled</option>
          <option value="upcoming">Upcoming</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="space-y-3">
        {sorted.map(f => {
          const st = STATUS_CONFIG[f.status];
          return (
            <div key={f.id} className={`card cursor-pointer hover:border-[#1E40AF] transition-all ${selected?.id === f.id ? 'border-[#1E40AF]' : ''}`} onClick={() => setSelected(f)}>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img src={f.photo} alt={f.patient} className="w-10 h-10 rounded-full object-cover" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.patient)}&background=1E40AF&color=fff`} />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${f.priority === 'urgent' ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#0F172A] text-sm">{f.patient}</span>
                    <span className="text-xs text-[#94A3B8]">· {f.age}y</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{f.condition}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {f.nextDue}</span>
                    <span className={`font-medium ${f.daysLeft <= 0 ? 'text-red-600' : f.daysLeft <= 7 ? 'text-amber-600' : 'text-[#64748B]'}`}>{f.daysLeft <= 0 ? `${Math.abs(f.daysLeft)} days overdue` : `${f.daysLeft} days`}</span>
                    <span>{f.type}</span>
                  </div>
                  {f.notes && <p className="text-xs text-[#94A3B8] mt-1 italic">"{f.notes}"</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toast.info(`Contacting ${f.patient}...`); }} className={`p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg`}>
                    {f.type === 'video' ? <Video className="w-3.5 h-3.5" /> : f.type === 'in-person' ? <User className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={e => { e.stopPropagation(); markComplete(f.id); }} className="p-1.5 text-[#64748B] hover:text-green-600 border border-[#E2E8F0] rounded-lg"><CheckCircle className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="card text-center py-12">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="font-medium text-[#64748B]">All follow-ups complete</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-display font-bold text-[#0F172A]">Add Follow-up</h3><button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-[#94A3B8]" /></button></div>
              <div className="space-y-3">
                <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={newFollowup.patient} onChange={e => setNewFollowup(p => ({ ...p, patient: e.target.value }))} /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Condition</label><input className="input" value={newFollowup.condition} onChange={e => setNewFollowup(p => ({ ...p, condition: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-[#64748B] mb-1">Follow-up Date *</label><input type="date" className="input" value={newFollowup.nextDue} onChange={e => setNewFollowup(p => ({ ...p, nextDue: e.target.value }))} /></div>
                  <div><label className="block text-xs text-[#64748B] mb-1">Mode</label>
                    <select className="input" value={newFollowup.type} onChange={e => setNewFollowup(p => ({ ...p, type: e.target.value }))}>
                      <option value="video">Video</option><option value="in-person">In-person</option><option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">Priority</label>
                  <div className="flex gap-2">
                    {['normal', 'urgent'].map(p => <button key={p} onClick={() => setNewFollowup(prev => ({ ...prev, priority: p }))} className={`flex-1 py-1.5 text-xs rounded-lg border capitalize ${newFollowup.priority === p ? p === 'urgent' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200' : 'border-[#E2E8F0] text-[#64748B]'}`}>{p}</button>)}
                  </div>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">Notes</label><textarea className="input h-16 resize-none text-sm" value={newFollowup.notes} onChange={e => setNewFollowup(p => ({ ...p, notes: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={addFollowup} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save className="w-4 h-4" />Save</button>
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
