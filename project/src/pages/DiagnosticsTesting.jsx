import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, Clock, Upload, Search, Filter, Download, Eye, Plus, X, Camera, Video, FileText, Zap, Star, Flag, RefreshCw, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';

const TEST_CATEGORIES = {
  'Blood Work': [
    { id: 'cbc', name: 'Complete Blood Count (CBC)', cost: 45, turnaround: '2-4 hours', description: 'WBC, RBC, Hgb, Hct, platelets' },
    { id: 'bmp', name: 'Basic Metabolic Panel (BMP)', cost: 55, turnaround: '2-4 hours', description: 'Glucose, electrolytes, kidney function' },
    { id: 'cmp', name: 'Comprehensive Metabolic Panel', cost: 75, turnaround: '4-6 hours', description: 'Full metabolic workup including liver' },
    { id: 'lipids', name: 'Lipid Panel', cost: 65, turnaround: '4-8 hours', description: 'Total cholesterol, LDL, HDL, triglycerides' },
    { id: 'thyroid', name: 'Thyroid Panel (TSH, T4)', cost: 85, turnaround: '8-12 hours', description: 'Thyroid stimulating hormone and free T4' },
    { id: 'hba1c', name: 'HbA1c', cost: 60, turnaround: '4-6 hours', description: 'Three-month blood sugar control' },
  ],
  'Imaging': [
    { id: 'xray_chest', name: 'Chest X-Ray', cost: 150, turnaround: '1-2 hours', description: 'Two-view chest radiograph' },
    { id: 'ecg', name: 'ECG / EKG', cost: 95, turnaround: '30 minutes', description: '12-lead electrocardiogram' },
    { id: 'echo', name: 'Echocardiogram', cost: 450, turnaround: '24-48 hours', description: 'Cardiac ultrasound imaging' },
    { id: 'ct_chest', name: 'CT Chest (with contrast)', cost: 850, turnaround: '24-48 hours', description: 'CT scan of thoracic cavity' },
  ],
  'Microbiology': [
    { id: 'blood_culture', name: 'Blood Culture', cost: 120, turnaround: '24-72 hours', description: 'Bacterial growth detection' },
    { id: 'urine_culture', name: 'Urine Culture', cost: 80, turnaround: '24-48 hours', description: 'UTI pathogen identification' },
    { id: 'covid', name: 'COVID-19 PCR', cost: 125, turnaround: '2-24 hours', description: 'SARS-CoV-2 molecular test' },
    { id: 'flu', name: 'Influenza A/B', cost: 70, turnaround: '30-60 minutes', description: 'Rapid flu antigen test' },
  ],
};

const SAMPLE_RESULTS = [
  { id: 1, name: 'CBC Report', patient: 'John Smith', date: '2026-04-06', status: 'completed', priority: 'normal', result: 'Normal', flagged: false },
  { id: 2, name: 'Lipid Panel', patient: 'Maria Garcia', date: '2026-04-06', status: 'pending', priority: 'normal', result: 'Pending', flagged: false },
  { id: 3, name: 'ECG', patient: 'Robert Chen', date: '2026-04-07', status: 'completed', priority: 'urgent', result: 'Abnormal — ST changes', flagged: true },
  { id: 4, name: 'HbA1c', patient: 'Sarah Johnson', date: '2026-04-05', status: 'completed', priority: 'normal', result: '7.2% — elevated', flagged: true },
];

export default function DiagnosticsTesting() {
  const [tab, setTab] = useState('order');
  const [selectedTests, setSelectedTests] = useState([]);
  const [priority, setPriority] = useState('normal');
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState(SAMPLE_RESULTS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [ordering, setOrdering] = useState(false);
  const fileInputRef = useRef(null);

  const toggleTest = (test) => {
    setSelectedTests(prev =>
      prev.find(t => t.id === test.id) ? prev.filter(t => t.id !== test.id) : [...prev, test]
    );
  };

  const totalCost = selectedTests.reduce((s, t) => s + t.cost, 0);

  const submitOrder = async () => {
    if (!selectedTests.length) { toast.error('Select at least one test'); return; }
    if (!patientName.trim()) { toast.error('Enter patient name'); return; }
    setOrdering(true);
    await new Promise(r => setTimeout(r, 1500));
    const newResults = selectedTests.map(t => ({
      id: Date.now() + Math.random(),
      name: t.name,
      patient: patientName,
      date: new Date().toLocaleDateString(),
      status: 'pending',
      priority,
      result: 'Pending',
      flagged: false,
    }));
    setResults(prev => [...newResults, ...prev]);
    setSelectedTests([]);
    setPatientName('');
    setNotes('');
    setOrdering(false);
    setTab('results');
    toast.success(`${newResults.length} test(s) ordered successfully`);
  };

  const filteredResults = results.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.patient.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const tabs = [
    { id: 'order', label: 'Order Tests', icon: Plus },
    { id: 'results', label: 'Results', icon: FileText, count: results.filter(r => r.flagged).length },
    { id: 'upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Diagnostics</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Lab Ordering</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Diagnostics & Testing</h1>
        <p className="text-[#64748B] mt-1 text-sm">Order lab tests, view results, and upload diagnostic images</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
            }`}>
            <t.icon className="w-4 h-4" />{t.label}
            {t.count > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ORDER TESTS */}
        {tab === 'order' && (
          <motion.div key="order" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {Object.entries(TEST_CATEGORIES).map(([cat, tests]) => (
                  <div key={cat} className="card">
                    <div className="section-label mb-3">{cat}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tests.map(test => {
                        const selected = selectedTests.find(t => t.id === test.id);
                        return (
                          <button key={test.id} onClick={() => toggleTest(test)}
                            className={`text-left p-3 rounded-lg border transition-all ${selected ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#1E40AF]'}`}>
                            <div className="flex items-start justify-between">
                              <div className="font-medium text-[#0F172A] text-xs">{test.name}</div>
                              {selected && <CheckCircle className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />}
                            </div>
                            <div className="text-[10px] text-[#94A3B8] mt-1">{test.description}</div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs font-medium text-[#0F172A]">${test.cost}</span>
                              <span className="text-[10px] text-[#94A3B8]"><Clock className="w-3 h-3 inline mr-0.5" />{test.turnaround}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4 text-sm">Order Details</h2>
                  <div className="space-y-3">
                    <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" placeholder="Patient full name" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Priority</label>
                      <div className="flex gap-2">
                        {['normal', 'urgent', 'stat'].map(p => (
                          <button key={p} onClick={() => setPriority(p)}
                            className={`flex-1 py-1.5 text-xs rounded-lg border capitalize font-medium transition-colors ${priority === p ? p === 'normal' ? 'bg-green-100 text-green-700 border-green-200' : p === 'urgent' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200' : 'border-[#E2E8F0] text-[#64748B]'}`}>{p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div><label className="block text-xs text-[#64748B] mb-1">Clinical Notes</label><textarea className="input h-20 resize-none text-sm" placeholder="Indication, relevant history..." value={notes} onChange={e => setNotes(e.target.value)} /></div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-3 text-sm">Order Summary</h2>
                  {selectedTests.length === 0 ? (
                    <p className="text-xs text-[#94A3B8]">No tests selected</p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {selectedTests.map(t => (
                        <div key={t.id} className="flex items-center justify-between">
                          <span className="text-xs text-[#374151]">{t.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#0F172A]">${t.cost}</span>
                            <button onClick={() => toggleTest(t)}><X className="w-3 h-3 text-[#94A3B8]" /></button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-semibold">
                        <span className="text-sm text-[#0F172A]">Total</span>
                        <span className="text-sm text-[#1E40AF]">${totalCost}</span>
                      </div>
                    </div>
                  )}
                  <button onClick={submitOrder} disabled={ordering || !selectedTests.length || !patientName.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    {ordering ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Ordering...</> : <><Zap className="w-4 h-4" />Submit Order</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS */}
        {tab === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search results..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              {filteredResults.map(result => (
                <div key={result.id} className={`card transition-colors ${result.flagged ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${result.status === 'completed' ? result.flagged ? 'bg-amber-100' : 'bg-green-100' : 'bg-blue-100'}`}>
                      <Activity className={`w-4 h-4 ${result.status === 'completed' ? result.flagged ? 'text-amber-600' : 'text-green-600' : 'text-[#1E40AF]'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#0F172A] text-sm">{result.name}</span>
                        {result.flagged && <Flag className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${result.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{result.status}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${result.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{result.priority}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-[#64748B]">{result.patient}</span>
                        <span className="text-xs text-[#94A3B8]">{result.date}</span>
                      </div>
                      {result.result !== 'Pending' && <div className={`text-xs mt-1 font-medium ${result.flagged ? 'text-amber-700' : 'text-green-700'}`}>{result.result}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toast.info('Viewing result...')} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toast.info('Downloading...')} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredResults.length === 0 && (
                <div className="card text-center py-12">
                  <BarChart3 className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-[#64748B]">No results found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* UPLOAD */}
        {tab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card border-dashed border-2 border-[#CBD5E1] hover:border-[#1E40AF] transition-colors cursor-pointer text-center p-10" onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="image/*,video/*,.pdf,.dcm" multiple className="hidden" onChange={e => { if (e.target.files.length) toast.success(`${e.target.files.length} file(s) uploaded`); }} />
                <Upload className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <h3 className="font-semibold text-[#0F172A] mb-1">Upload Images/Reports</h3>
                <p className="text-sm text-[#64748B]">DICOM, JPG, PNG, PDF, MP4</p>
                <button className="btn-primary mt-4 text-sm">Browse Files</button>
              </div>
              <div className="card border-dashed border-2 border-[#CBD5E1] hover:border-[#1E40AF] transition-colors cursor-pointer text-center p-10" onClick={() => toast.info('Camera opening...')}>
                <Camera className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <h3 className="font-semibold text-[#0F172A] mb-1">Capture Image</h3>
                <p className="text-sm text-[#64748B]">Use device camera for direct capture</p>
                <button className="btn-secondary mt-4 text-sm">Open Camera</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
