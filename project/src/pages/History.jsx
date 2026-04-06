import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Calendar, FileText, Pill, Activity, Brain, Video, User, Filter, ChevronRight, Download, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const ALL_HISTORY = [
  { id: 1, type: 'consultation', title: 'Cardiology Consultation', date: '2026-04-07', doctor: 'Dr. Sarah Chen', notes: 'Blood pressure evaluated. New medication prescribed.', icon: User, color: 'bg-blue-100 text-blue-600' },
  { id: 2, type: 'prescription', title: 'Prescription — Lisinopril 10mg', date: '2026-04-07', doctor: 'Dr. Sarah Chen', notes: 'Once daily for hypertension management.', icon: Pill, color: 'bg-green-100 text-green-600' },
  { id: 3, type: 'lab', title: 'CBC + Comprehensive Metabolic Panel', date: '2026-04-06', doctor: 'Lab Department', notes: 'All values within normal range.', icon: Activity, color: 'bg-purple-100 text-purple-600' },
  { id: 4, type: 'ai_diagnosis', title: 'AI Symptom Analysis', date: '2026-04-05', doctor: 'AI System', notes: 'Differential diagnosis: Hypertension, Anxiety, Stress.', icon: Brain, color: 'bg-amber-100 text-amber-600' },
  { id: 5, type: 'consultation', title: 'Telemedicine Follow-up', date: '2026-03-28', doctor: 'Dr. User', notes: 'Routine follow-up. Patient stable.', icon: Video, color: 'bg-indigo-100 text-indigo-600' },
  { id: 6, type: 'lab', title: 'HbA1c Report', date: '2026-03-20', doctor: 'Lab Department', notes: 'HbA1c 7.2% — slightly elevated.', icon: Activity, color: 'bg-red-100 text-red-600' },
  { id: 7, type: 'prescription', title: 'Prescription — Metformin 500mg', date: '2026-03-20', doctor: 'Dr. User', notes: 'Twice daily with meals.', icon: Pill, color: 'bg-green-100 text-green-600' },
];

const TYPES = ['All', 'consultation', 'prescription', 'lab', 'ai_diagnosis'];

export default function History() {
  const { medicalHistory, prescriptions } = useUser();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [dateRange, setDateRange] = useState('all');

  const allHistory = [...ALL_HISTORY, ...medicalHistory.map((h, i) => ({
    id: `user-${i}`,
    type: h.type || 'consultation',
    title: h.type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Medical Record',
    date: new Date(h.timestamp).toISOString().split('T')[0],
    doctor: 'Dr. User',
    notes: 'Patient record',
    icon: FileText,
    color: 'bg-gray-100 text-gray-600',
  }))];

  const filtered = allHistory.filter(h => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase()) || h.doctor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || h.type === filter;
    return matchSearch && matchFilter;
  });

  const grouped = filtered.reduce((acc, h) => {
    const month = new Date(h.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(h);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Records</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Activity</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Medical History</h1>
        <p className="text-[#64748B] mt-1 text-sm">Complete timeline of your medical activity and records</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Records', value: allHistory.length, icon: FileText, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
          { label: 'Consultations', value: allHistory.filter(h => h.type === 'consultation').length, icon: User, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Prescriptions', value: allHistory.filter(h => h.type === 'prescription').length + prescriptions.length, icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Lab Reports', value: allHistory.filter(h => h.type === 'lab').length, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input className="input pl-9" placeholder="Search history..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 text-xs rounded-lg border capitalize font-medium transition-colors ${filter === t ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1E40AF]'}`}>
              {t === 'ai_diagnosis' ? 'AI Analysis' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([month, records]) => (
          <div key={month}>
            <div className="flex items-center gap-3 mb-4">
              <div className="section-label">{month}</div>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8]">{records.length} records</span>
            </div>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-[#E2E8F0]" />
              {records.map((record, i) => (
                <motion.div key={record.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative">
                  <div className={`absolute -left-4 top-3 w-2.5 h-2.5 rounded-full border-2 border-white ${record.type === 'prescription' ? 'bg-green-500' : record.type === 'lab' ? 'bg-purple-500' : record.type === 'ai_diagnosis' ? 'bg-amber-500' : 'bg-[#1E40AF]'}`} />
                  <div className="card hover:border-[#1E40AF] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${record.color}`}>
                        <record.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[#0F172A] text-sm">{record.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize ${record.type === 'prescription' ? 'bg-green-100 text-green-700 border-green-200' : record.type === 'lab' ? 'bg-purple-100 text-purple-700 border-purple-200' : record.type === 'ai_diagnosis' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{record.type.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
                          <span>{record.date}</span>
                          <span>·</span>
                          <span>{record.doctor}</span>
                        </div>
                        {record.notes && <p className="text-xs text-[#64748B] mt-1">{record.notes}</p>}
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => toast.info('Viewing record...')} className="p-1.5 text-[#94A3B8] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toast.info('Downloading...')} className="p-1.5 text-[#94A3B8] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="card text-center py-16">
            <Clock className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <p className="font-medium text-[#64748B]">No history found</p>
          </div>
        )}
      </div>
    </div>
  );
}
