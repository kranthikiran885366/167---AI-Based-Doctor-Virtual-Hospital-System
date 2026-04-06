import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Calendar, Search, Filter, UserPlus, Phone, Video, MessageSquare, Star, AlertTriangle, CheckCircle, Eye, Edit, MoreVertical, MapPin, Mail, User, Heart, Activity, Pill, FileText, Shield, Plus, ChevronDown, X, Badge } from 'lucide-react';
import { toast } from 'react-toastify';

const INITIAL_PATIENTS = [
  { id: 1, name: 'John Smith', age: 45, gender: 'M', photo: 'https://i.pravatar.cc/100?img=1', appointmentTime: '09:00 AM', priority: 'urgent', chiefComplaint: 'Chest pain and shortness of breath', waitingTime: 15, status: 'waiting', type: 'video', lastVisit: '2024-01-10', contact: '+1 (555) 123-4567', email: 'john.smith@email.com', bloodType: 'O+', allergies: ['Penicillin'], conditions: ['Hypertension', 'Diabetes'], vitals: { bp: '145/92', hr: 88, temp: '98.6', o2: 96 } },
  { id: 2, name: 'Maria Garcia', age: 32, gender: 'F', photo: 'https://i.pravatar.cc/100?img=5', appointmentTime: '09:30 AM', priority: 'normal', chiefComplaint: 'Routine checkup and flu symptoms', waitingTime: 5, status: 'in-progress', type: 'in-person', lastVisit: '2023-11-15', contact: '+1 (555) 234-5678', email: 'maria.garcia@email.com', bloodType: 'A+', allergies: [], conditions: ['Asthma'], vitals: { bp: '118/76', hr: 72, temp: '99.1', o2: 99 } },
  { id: 3, name: 'Robert Chen', age: 58, gender: 'M', photo: 'https://i.pravatar.cc/100?img=3', appointmentTime: '10:00 AM', priority: 'critical', chiefComplaint: 'Severe abdominal pain, vomiting', waitingTime: 2, status: 'waiting', type: 'walk-in', lastVisit: null, contact: '+1 (555) 345-6789', email: 'r.chen@email.com', bloodType: 'B-', allergies: ['Aspirin', 'Sulfa'], conditions: [], vitals: { bp: '160/100', hr: 110, temp: '101.2', o2: 97 } },
  { id: 4, name: 'Sarah Johnson', age: 28, gender: 'F', photo: 'https://i.pravatar.cc/100?img=9', appointmentTime: '10:30 AM', priority: 'normal', chiefComplaint: 'Follow-up for diabetes management', waitingTime: 22, status: 'waiting', type: 'video', lastVisit: '2024-01-05', contact: '+1 (555) 456-7890', email: 's.johnson@email.com', bloodType: 'AB+', allergies: ['Latex'], conditions: ['Type 2 Diabetes'], vitals: { bp: '122/80', hr: 76, temp: '98.4', o2: 98 } },
  { id: 5, name: 'Michael Brown', age: 65, gender: 'M', photo: 'https://i.pravatar.cc/100?img=7', appointmentTime: '11:00 AM', priority: 'urgent', chiefComplaint: 'Dizziness and vision changes', waitingTime: 8, status: 'waiting', type: 'in-person', lastVisit: '2023-12-20', contact: '+1 (555) 567-8901', email: 'm.brown@email.com', bloodType: 'O-', allergies: [], conditions: ['Hypertension', 'Glaucoma'], vitals: { bp: '178/105', hr: 82, temp: '98.2', o2: 95 } },
];

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', cls: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  urgent: { label: 'Urgent', cls: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  normal: { label: 'Normal', cls: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

const STATUS_CONFIG = {
  waiting: { label: 'Waiting', cls: 'bg-blue-100 text-blue-700' },
  'in-progress': { label: 'In Progress', cls: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
};

export default function PatientManagement() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.chiefComplaint.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.priority === filter || p.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === 'waiting').length,
    critical: patients.filter(p => p.priority === 'critical').length,
    avgWait: Math.round(patients.reduce((a, p) => a + p.waitingTime, 0) / patients.length),
  };

  const updateStatus = (id, status) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast.success(`Patient status updated to ${status}`);
  };

  const tabs = [
    { id: 'queue', label: 'Patient Queue', count: stats.waiting },
    { id: 'all', label: 'All Patients', count: stats.total },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Clinical</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Patient Queue</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Patient Management</h1>
            <p className="text-[#64748B] mt-1 text-sm">Manage patient queue, appointments, and records</p>
          </div>
          <button onClick={() => toast.info('Add Patient form coming soon')} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />Add Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Today', value: stats.total, icon: Users, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
          { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Avg Wait (min)', value: stats.avgWait, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{stat.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{stat.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
              }`}>
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeTab === t.id ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input className="input pl-9 w-56" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(patient => {
            const prio = PRIORITY_CONFIG[patient.priority];
            const status = STATUS_CONFIG[patient.status];
            return (
              <motion.div
                key={patient.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelected(patient)}
                className={`card cursor-pointer transition-all hover:border-[#1E40AF] ${selected?.id === patient.id ? 'border-[#1E40AF] bg-[#F8FAFF]' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img src={patient.photo} alt={patient.name} className="w-10 h-10 rounded-full object-cover" onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=1E40AF&color=fff`; }} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${prio.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#0F172A] text-sm">{patient.name}</span>
                      <span className="text-xs text-[#94A3B8]">· {patient.age}y {patient.gender}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${prio.cls}`}>{prio.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${status.cls}`}>{status.label}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 truncate">{patient.chiefComplaint}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]"><Clock className="w-3 h-3" />{patient.appointmentTime}</span>
                      <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]"><Clock className="w-3 h-3" />Wait: {patient.waitingTime}min</span>
                      <span className={`flex items-center gap-1 text-[10px] text-[#94A3B8]`}>
                        {patient.type === 'video' ? <Video className="w-3 h-3" /> : patient.type === 'in-person' ? <User className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {patient.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={e => { e.stopPropagation(); toast.info(`Starting call with ${patient.name}`); }} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] transition-colors">
                      <Video className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); updateStatus(patient.id, 'in-progress'); }} className="p-1.5 text-[#64748B] hover:text-green-600 border border-[#E2E8F0] rounded-lg hover:border-green-500 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card text-center py-12">
              <Users className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <p className="text-[#64748B] font-medium">No patients found</p>
            </div>
          )}
        </div>

        {/* Patient Detail Panel */}
        <div className="space-y-4">
          {selected ? (
            <AnimatePresence>
              <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={selected.photo} alt={selected.name} className="w-12 h-12 rounded-full object-cover" onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=1E40AF&color=fff`; }} />
                      <div>
                        <div className="font-semibold text-[#0F172A]">{selected.name}</div>
                        <div className="text-xs text-[#64748B]">{selected.age} years · {selected.gender === 'M' ? 'Male' : 'Female'} · {selected.bloodType}</div>
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-[#94A3B8] hover:text-[#0F172A]"><X className="w-4 h-4" /></button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Call', icon: Phone, action: () => toast.info('Initiating call...') },
                      { label: 'Video', icon: Video, action: () => toast.info('Starting video...') },
                      { label: 'Message', icon: MessageSquare, action: () => toast.info('Opening chat...') },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1 p-2 border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors text-[#64748B] text-xs">
                        <a.icon className="w-4 h-4" />{a.label}
                      </button>
                    ))}
                  </div>

                  {/* Vitals */}
                  <div className="mb-4">
                    <div className="section-label mb-2">Current Vitals</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'BP', value: selected.vitals.bp, unit: 'mmHg' },
                        { label: 'HR', value: selected.vitals.hr, unit: 'bpm' },
                        { label: 'Temp', value: selected.vitals.temp, unit: '°F' },
                        { label: 'SpO₂', value: selected.vitals.o2, unit: '%' },
                      ].map((v, i) => (
                        <div key={i} className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                          <div className="text-sm font-bold text-[#0F172A]">{v.value}</div>
                          <div className="text-[10px] text-[#64748B]">{v.label} ({v.unit})</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chief Complaint */}
                  <div className="mb-4">
                    <div className="section-label mb-1">Chief Complaint</div>
                    <p className="text-sm text-[#374151]">{selected.chiefComplaint}</p>
                  </div>

                  {/* Conditions & Allergies */}
                  {(selected.conditions.length > 0 || selected.allergies.length > 0) && (
                    <div className="space-y-2 mb-4">
                      {selected.conditions.length > 0 && (
                        <div>
                          <div className="section-label mb-1">Conditions</div>
                          <div className="flex flex-wrap gap-1">
                            {selected.conditions.map(c => <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">{c}</span>)}
                          </div>
                        </div>
                      )}
                      {selected.allergies.length > 0 && (
                        <div>
                          <div className="section-label mb-1">Allergies</div>
                          <div className="flex flex-wrap gap-1">
                            {selected.allergies.map(a => <span key={a} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">{a}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#64748B]"><Phone className="w-3.5 h-3.5" />{selected.contact}</div>
                    <div className="flex items-center gap-2 text-xs text-[#64748B]"><Mail className="w-3.5 h-3.5" />{selected.email}</div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button onClick={() => { updateStatus(selected.id, 'in-progress'); }} className="btn-primary w-full text-sm">Start Consultation</button>
                    <button onClick={() => { updateStatus(selected.id, 'completed'); setSelected(null); }} className="btn-secondary w-full text-sm">Mark Complete</button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="card text-center py-12">
              <User className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
