import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Download, Printer, Share, Edit, Trash2, Eye, Clock, Calendar, User, Tag, Star, Archive, ChevronRight, Save, X, Bold, Italic, AlignLeft, List, Hash, CheckSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const TEMPLATES = [
  { id: 'soap', name: 'SOAP Note', sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] },
  { id: 'discharge', name: 'Discharge Summary', sections: ['Admission Details', 'Hospital Course', 'Discharge Medications', 'Follow-up'] },
  { id: 'referral', name: 'Referral Letter', sections: ['Patient Information', 'Reason for Referral', 'Clinical History', 'Current Medications'] },
  { id: 'operative', name: 'Operative Report', sections: ['Pre-op Diagnosis', 'Procedure', 'Findings', 'Post-op Diagnosis'] },
  { id: 'progress', name: 'Progress Note', sections: ['Interval History', 'Examination', 'Assessment', 'Plan'] },
];

const SAMPLE_DOCS = [
  { id: 1, title: 'SOAP Note — John Smith', type: 'soap', date: '2026-04-07', patient: 'John Smith', author: 'Dr. User', status: 'signed', starred: false },
  { id: 2, title: 'Discharge Summary — Maria Garcia', type: 'discharge', date: '2026-04-06', patient: 'Maria Garcia', author: 'Dr. User', status: 'draft', starred: true },
  { id: 3, title: 'Referral Letter — Robert Chen', type: 'referral', date: '2026-04-05', patient: 'Robert Chen', author: 'Dr. User', status: 'signed', starred: false },
];

const DOC_ICONS = { soap: FileText, discharge: Archive, referral: Share, operative: Hash, progress: AlignLeft };

export default function MedicalDocumentation() {
  const [tab, setTab] = useState('documents');
  const [search, setSearch] = useState('');
  const [docs, setDocs] = useState(SAMPLE_DOCS);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState({});
  const [docPatient, setDocPatient] = useState('');

  const filtered = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.patient.toLowerCase().includes(search.toLowerCase()));

  const createDoc = () => {
    if (!selectedTemplate) { toast.error('Select a template'); return; }
    if (!docTitle) { toast.error('Enter document title'); return; }
    const doc = {
      id: Date.now(),
      title: docTitle || `${selectedTemplate.name} — ${docPatient}`,
      type: selectedTemplate.id,
      date: new Date().toISOString().split('T')[0],
      patient: docPatient,
      author: 'Dr. User',
      status: 'draft',
      starred: false,
      content: docContent,
    };
    setDocs(prev => [doc, ...prev]);
    setCreating(false);
    setSelectedTemplate(null);
    setDocTitle('');
    setDocContent({});
    setDocPatient('');
    toast.success('Document created');
  };

  const toggleStar = (id) => setDocs(prev => prev.map(d => d.id === id ? { ...d, starred: !d.starred } : d));
  const signDoc = (id) => { setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'signed' } : d)); toast.success('Document signed'); };
  const deleteDoc = (id) => { setDocs(prev => prev.filter(d => d.id !== id)); if (selected?.id === id) setSelected(null); toast.success('Document deleted'); };

  const tabs = [
    { id: 'documents', label: 'Documents', count: docs.length },
    { id: 'templates', label: 'Templates' },
    { id: 'create', label: 'New Document' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Clinical</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Documentation</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Medical Documentation</h1>
            <p className="text-[#64748B] mt-1 text-sm">Create and manage clinical documents, notes, and reports</p>
          </div>
          <button onClick={() => setTab('create')} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />New Document</button>
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>
            {t.label}{t.count && <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded">{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'documents' && (
          <motion.div key="docs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input className="input pl-9" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {filtered.map(doc => {
                  const DocIcon = DOC_ICONS[doc.type] || FileText;
                  return (
                    <div key={doc.id} className={`card cursor-pointer hover:border-[#1E40AF] transition-colors ${selected?.id === doc.id ? 'border-[#1E40AF]' : ''}`} onClick={() => setSelected(doc)}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0"><DocIcon className="w-4 h-4 text-[#1E40AF]" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-[#0F172A] text-sm truncate">{doc.title}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${doc.status === 'signed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{doc.status}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
                            <span>{doc.patient}</span>
                            <span>·</span>
                            <span>{doc.date}</span>
                            <span>·</span>
                            <span>{doc.author}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={e => { e.stopPropagation(); toggleStar(doc.id); }} className={`p-1 rounded ${doc.starred ? 'text-amber-400' : 'text-[#94A3B8] hover:text-amber-400'}`}>
                            <Star className={`w-4 h-4 ${doc.starred ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }} className="p-1 text-[#94A3B8] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="card text-center py-12">
                    <FileText className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                    <p className="text-[#64748B]">No documents found</p>
                  </div>
                )}
              </div>
              <div>
                {selected ? (
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#0F172A] text-sm">Document Details</h3>
                      <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-[#94A3B8]" /></button>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[['Patient', selected.patient], ['Date', selected.date], ['Author', selected.author], ['Status', selected.status]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm"><span className="text-[#64748B]">{k}</span><span className="font-medium text-[#0F172A] capitalize">{v}</span></div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => toast.info('Opening editor...')} className="btn-secondary w-full text-sm flex items-center justify-center gap-2"><Edit className="w-3.5 h-3.5" />Edit</button>
                      {selected.status === 'draft' && <button onClick={() => signDoc(selected.id)} className="btn-primary w-full text-sm flex items-center justify-center gap-2"><CheckSquare className="w-3.5 h-3.5" />Sign Document</button>}
                      <button onClick={() => toast.info('Downloading...')} className="btn-secondary w-full text-sm flex items-center justify-center gap-2"><Download className="w-3.5 h-3.5" />Download PDF</button>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-8">
                    <FileText className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-sm text-[#64748B]">Select a document</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'templates' && (
          <motion.div key="templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map(t => {
                const TIcon = DOC_ICONS[t.id] || FileText;
                return (
                  <div key={t.id} className="card hover:border-[#1E40AF] transition-colors cursor-pointer" onClick={() => { setSelectedTemplate(t); setTab('create'); }}>
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-3"><TIcon className="w-5 h-5 text-[#1E40AF]" /></div>
                    <h3 className="font-semibold text-[#0F172A] mb-1">{t.name}</h3>
                    <div className="space-y-1 mb-3">
                      {t.sections.map(s => <div key={s} className="text-xs text-[#64748B] flex items-center gap-1"><div className="w-1 h-1 bg-[#94A3B8] rounded-full" />{s}</div>)}
                    </div>
                    <button className="btn-secondary text-xs w-full">Use Template</button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {tab === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card max-w-3xl mx-auto">
            <h2 className="font-semibold text-[#0F172A] mb-4">Create New Document</h2>
            <div className="space-y-4 mb-6">
              <div><label className="block text-xs text-[#64748B] mb-1">Template</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setSelectedTemplate(t)}
                      className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${selectedTemplate?.id === t.id ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]' : 'border-[#E2E8F0] text-[#374151] hover:border-[#1E40AF]'}`}>{t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-[#64748B] mb-1">Document Title</label><input className="input" value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Enter title..." /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Patient</label><input className="input" value={docPatient} onChange={e => setDocPatient(e.target.value)} placeholder="Patient name" /></div>
              </div>
              {selectedTemplate && (
                <div className="space-y-3">
                  {selectedTemplate.sections.map(section => (
                    <div key={section}>
                      <label className="block text-xs font-medium text-[#64748B] mb-1">{section}</label>
                      <textarea className="input h-20 resize-none text-sm" placeholder={`Enter ${section.toLowerCase()}...`} value={docContent[section] || ''} onChange={e => setDocContent(prev => ({ ...prev, [section]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={createDoc} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" />Save Document</button>
              <button onClick={() => setTab('documents')} className="btn-secondary">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
