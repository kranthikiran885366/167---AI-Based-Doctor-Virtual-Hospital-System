import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle, AlertTriangle, Clock, Plus, Search, Eye, Download, Trash2, Shield, Award, Star, Calendar, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const DOCUMENT_TYPES = ['Medical License', 'Board Certification', 'DEA Registration', 'Hospital Privileges', 'Malpractice Insurance', 'NPI Certificate', 'State License', 'CME Certificate'];

const SAMPLE_DOCS = [
  { id: 1, type: 'Medical License', state: 'New York', number: 'MD-NY-123456', expiry: '2027-12-31', status: 'active', verified: true, file: 'license_ny.pdf' },
  { id: 2, type: 'Board Certification', board: 'ABIM', specialty: 'Internal Medicine', expiry: '2028-06-30', status: 'active', verified: true, file: 'abim_cert.pdf' },
  { id: 3, type: 'DEA Registration', number: 'XD1234567', expiry: '2026-08-31', status: 'expiring', verified: true, file: 'dea_cert.pdf' },
  { id: 4, type: 'Malpractice Insurance', provider: 'Medical Protective', expiry: '2026-12-31', status: 'active', verified: false, file: null },
];

const STATUS_CONFIG = {
  active: { cls: 'bg-green-100 text-green-700 border-green-200', label: 'Active' },
  expiring: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Expiring Soon' },
  expired: { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Expired' },
  pending: { cls: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Pending Review' },
};

export default function MedicalRegistration() {
  const [docs, setDocs] = useState(SAMPLE_DOCS);
  const [tab, setTab] = useState('documents');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', number: '', expiry: '' });

  const filtered = docs.filter(d => d.type.toLowerCase().includes(search.toLowerCase()));

  const addDoc = () => {
    if (!newDoc.type || !newDoc.expiry) { toast.error('Fill required fields'); return; }
    setDocs(prev => [...prev, { id: Date.now(), ...newDoc, status: 'pending', verified: false, file: null }]);
    setShowAdd(false);
    setNewDoc({ type: '', number: '', expiry: '' });
    toast.success('Document added — pending verification');
  };

  const tabs = [
    { id: 'documents', label: 'My Documents', count: docs.length },
    { id: 'expiring', label: 'Expiring Soon', count: docs.filter(d => d.status === 'expiring').length },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Compliance</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Credentials</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Medical Registration</h1>
            <p className="text-[#64748B] mt-1 text-sm">Manage licenses, certifications, and professional credentials</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Document</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Documents', value: docs.length, icon: FileText, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
          { label: 'Active', value: docs.filter(d => d.status === 'active').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Expiring Soon', value: docs.filter(d => d.status === 'expiring').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Verified', value: docs.filter(d => d.verified).length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>
            {t.label}
            {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${t.id === 'expiring' && t.count > 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input className="input pl-9" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {(tab === 'documents' ? filtered : filtered.filter(d => d.status === 'expiring')).map(doc => {
          const st = STATUS_CONFIG[doc.status] || STATUS_CONFIG['pending'];
          return (
            <div key={doc.id} className={`card ${doc.status === 'expiring' ? 'border-amber-200' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#0F172A] text-sm">{doc.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${st.cls}`}>{st.label}</span>
                    {doc.verified && <span className="flex items-center gap-0.5 text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded"><CheckCircle className="w-2.5 h-2.5" />Verified</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#94A3B8]">
                    {doc.number && <span>#{doc.number}</span>}
                    {doc.state && <span>{doc.state}</span>}
                    {doc.specialty && <span>{doc.specialty}</span>}
                    {doc.expiry && <span className={`flex items-center gap-1 ${doc.status === 'expiring' ? 'text-amber-600 font-medium' : ''}`}><Calendar className="w-3 h-3" />Expires: {doc.expiry}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.file ? (
                    <button onClick={() => toast.info('Downloading...')} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Download className="w-3.5 h-3.5" /></button>
                  ) : (
                    <button onClick={() => toast.info('Uploading document...')} className="flex items-center gap-1 text-xs px-2 py-1.5 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:border-[#1E40AF]"><Upload className="w-3 h-3" />Upload</button>
                  )}
                  <button onClick={() => { setDocs(prev => prev.filter(d => d.id !== doc.id)); toast.success('Removed'); }} className="p-1.5 text-[#64748B] hover:text-red-500 border border-[#E2E8F0] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-display font-bold text-[#0F172A]">Add Document</h3><button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-[#94A3B8]" /></button></div>
              <div className="space-y-3">
                <div><label className="block text-xs text-[#64748B] mb-1">Document Type *</label>
                  <select className="input" value={newDoc.type} onChange={e => setNewDoc(p => ({ ...p, type: e.target.value }))}>
                    <option value="">Select type...</option>
                    {DOCUMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">License/Certificate Number</label><input className="input" value={newDoc.number} onChange={e => setNewDoc(p => ({ ...p, number: e.target.value }))} placeholder="Number or ID" /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Expiry Date *</label><input type="date" className="input" value={newDoc.expiry} onChange={e => setNewDoc(p => ({ ...p, expiry: e.target.value }))} /></div>
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center cursor-pointer hover:border-[#1E40AF] transition-colors" onClick={() => toast.info('File selection...')}>
                  <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">Upload document file (PDF, JPG)</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={addDoc} className="btn-primary flex-1 flex items-center justify-center gap-1"><Save className="w-4 h-4" />Add Document</button>
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
