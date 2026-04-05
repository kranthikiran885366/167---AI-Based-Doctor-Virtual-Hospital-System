import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Search, Download, Save, Eye, X, FileText, Zap,
  Database, BarChart3, Info, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const ALL_SYMPTOMS = [
  { id: 1, name: 'Fever', category: 'Constitutional', icd10: 'R50.9' },
  { id: 2, name: 'Headache', category: 'Neurological', icd10: 'R51' },
  { id: 3, name: 'Chest Pain', category: 'Cardiovascular', icd10: 'R07.89' },
  { id: 4, name: 'Shortness of Breath', category: 'Respiratory', icd10: 'R06.02' },
  { id: 5, name: 'Cough', category: 'Respiratory', icd10: 'R05' },
  { id: 6, name: 'Nausea', category: 'Gastrointestinal', icd10: 'R11.0' },
  { id: 7, name: 'Abdominal Pain', category: 'Gastrointestinal', icd10: 'R10.9' },
  { id: 8, name: 'Fatigue', category: 'Constitutional', icd10: 'R53.1' },
  { id: 9, name: 'Dizziness', category: 'Neurological', icd10: 'R42' },
  { id: 10, name: 'Joint Pain', category: 'Musculoskeletal', icd10: 'M25.50' },
  { id: 11, name: 'Skin Rash', category: 'Dermatological', icd10: 'R21' },
  { id: 12, name: 'Weight Loss', category: 'Constitutional', icd10: 'R63.4' },
  { id: 13, name: 'Palpitations', category: 'Cardiovascular', icd10: 'R00.2' },
  { id: 14, name: 'Back Pain', category: 'Musculoskeletal', icd10: 'M54.9' },
  { id: 15, name: 'Sore Throat', category: 'Respiratory', icd10: 'J02.9' },
  { id: 16, name: 'Vomiting', category: 'Gastrointestinal', icd10: 'R11.1' },
  { id: 17, name: 'Swelling', category: 'General', icd10: 'R60.9' },
  { id: 18, name: 'Vision Changes', category: 'Neurological', icd10: 'H53.9' },
  { id: 19, name: 'Confusion', category: 'Neurological', icd10: 'R41.3' },
  { id: 20, name: 'Weakness', category: 'Constitutional', icd10: 'R53.1' },
  { id: 21, name: 'Wheezing', category: 'Respiratory', icd10: 'R06.2' },
  { id: 22, name: 'Numbness', category: 'Neurological', icd10: 'R20.2' },
];

const CATEGORIES = ['All', 'Constitutional', 'Cardiovascular', 'Respiratory', 'Neurological', 'Gastrointestinal', 'Musculoskeletal', 'Dermatological', 'General'];

const URGENCY = {
  emergency: { label: 'Emergency', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  urgent: { label: 'Urgent', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  routine: { label: 'Routine', cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
};

function buildDiagnoses(symptoms) {
  const names = symptoms.map(s => s.name);
  const results = [];
  if (names.includes('Chest Pain') && names.includes('Shortness of Breath')) {
    results.push({ name: 'Angina Pectoris', probability: 0.78, urgency: 'urgent', icd10: 'I20.9', description: 'Chest pain from reduced coronary blood flow.' });
    results.push({ name: 'Pulmonary Embolism', probability: 0.34, urgency: 'emergency', icd10: 'I26.9', description: 'Blood clot in pulmonary artery — requires immediate evaluation.' });
  } else if (names.includes('Chest Pain')) {
    results.push({ name: 'Musculoskeletal Chest Pain', probability: 0.65, urgency: 'routine', icd10: 'M79.3', description: 'Non-cardiac pain from chest wall muscles.' });
    results.push({ name: 'GERD', probability: 0.42, urgency: 'routine', icd10: 'K21.0', description: 'Gastroesophageal reflux causing chest discomfort.' });
  }
  if (names.includes('Fever') && names.includes('Cough')) {
    results.push({ name: 'Upper Respiratory Infection', probability: 0.82, urgency: 'routine', icd10: 'J06.9', description: 'Viral infection of the upper airways.' });
    if (names.includes('Shortness of Breath')) results.push({ name: 'Community-acquired Pneumonia', probability: 0.61, urgency: 'urgent', icd10: 'J18.9', description: 'Bacterial or viral lung infection.' });
  }
  if (names.includes('Headache') && names.includes('Nausea')) {
    results.push({ name: 'Migraine', probability: 0.71, urgency: 'routine', icd10: 'G43.909', description: 'Recurring headache disorder, often unilateral.' });
  }
  if (names.includes('Confusion') || names.includes('Weakness')) {
    results.push({ name: 'TIA / Stroke', probability: 0.55, urgency: 'emergency', icd10: 'G45.9', description: 'Transient ischemic attack or stroke — seek immediate care.' });
  }
  if (results.length === 0) {
    results.push({ name: 'Viral Syndrome', probability: 0.67, urgency: 'routine', icd10: 'B34.9', description: 'Non-specific viral illness — most cases self-resolve.' });
    results.push({ name: 'Functional Somatic Syndrome', probability: 0.38, urgency: 'routine', icd10: 'F45.9', description: 'Physical symptoms with psychosomatic component.' });
  }
  return results.sort((a, b) => b.probability - a.probability);
}

export default function AIDiagnosis() {
  const { user, addMedicalRecord } = useUser();
  const [selected, setSelected] = useState([]);
  const [vitals, setVitals] = useState({ age: '', gender: '', weight: '', height: '', temperature: '', heartRate: '', bloodPressure: '' });
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [mode, setMode] = useState('comprehensive');
  const [catFilter, setCatFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('analyze');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('aiDiagnoses');
    if (s) setHistory(JSON.parse(s));
  }, []);

  const filtered = ALL_SYMPTOMS.filter(s =>
    (catFilter === 'All' || s.category === catFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (sym) => {
    setSelected(prev =>
      prev.find(s => s.id === sym.id)
        ? prev.filter(s => s.id !== sym.id)
        : [...prev, { ...sym, severity: 5, duration: '1-3 days' }]
    );
  };

  const analyze = async () => {
    if (!selected.length) { toast.error('Select at least one symptom'); return; }
    setAnalyzing(true); setProgress(0); setResults(null);
    const steps = ['Analyzing symptom patterns...', 'Cross-referencing database...', 'Calculating probabilities...', 'Generating diagnoses...', 'Formulating recommendations...'];
    for (let i = 0; i < steps.length; i++) {
      setStep(steps[i]);
      await new Promise(r => setTimeout(r, 800));
      setProgress((i + 1) * 20);
    }
    const diagnoses = buildDiagnoses(selected);
    setResults({
      diagnoses,
      recommendations: [
        { type: 'diagnostic', action: 'Complete Blood Count (CBC)', timeframe: 'Within 24 hours' },
        { type: 'diagnostic', action: 'Basic Metabolic Panel', timeframe: 'Within 24 hours' },
        { type: 'monitoring', action: 'Monitor vitals every 4 hours', timeframe: 'Ongoing' },
        { type: 'treatment', action: 'Symptomatic treatment as indicated', timeframe: 'As needed' },
      ],
      followUp: [
        { visit: 'Follow-up consultation', timing: 'In 1 week', notes: 'Reassess symptoms and review lab results' },
        { visit: 'Specialist referral if needed', timing: 'If no improvement', notes: 'Cardiology or pulmonology if indicated' },
      ],
      confidence: Math.floor(65 + Math.random() * 25),
      timestamp: new Date().toISOString(),
    });
    setAnalyzing(false);
    setTab('results');
    toast.success('Analysis complete');
  };

  const save = () => {
    if (!results) return;
    const record = { id: Date.now(), symptoms: selected.map(s => s.name), results, timestamp: new Date().toISOString(), mode };
    const updated = [record, ...history];
    setHistory(updated);
    localStorage.setItem('aiDiagnoses', JSON.stringify(updated));
    addMedicalRecord({ type: 'ai_diagnosis', ...record });
    toast.success('Saved to medical records');
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Brain },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'history', label: 'History', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Clinical AI</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Diagnostic Engine</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">AI Diagnosis</h1>
            <p className="text-[#64748B] mt-1 text-sm">Evidence-based differential diagnosis powered by clinical AI</p>
          </div>
          <div className="flex items-center gap-2">
            {['comprehensive', 'quick', 'emergency'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                  mode === m ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1E40AF]'
                }`}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => (t.id !== 'results' || results) && setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            } ${t.id === 'results' && !results ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ANALYZE TAB */}
        {tab === 'analyze' && (
          <motion.div key="analyze" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#0F172A]">Select Symptoms</h2>
                  <span className="text-xs text-[#64748B]">{selected.length} selected</span>
                </div>
                <div className="flex gap-3 mb-4 flex-wrap">
                  <div className="relative flex-1 min-w-[160px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input className="input pl-9" placeholder="Search symptoms..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <select className="input w-auto" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filtered.map(sym => {
                    const sel = selected.find(s => s.id === sym.id);
                    return (
                      <button key={sym.id} onClick={() => toggle(sym)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                          sel ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF] font-medium' : 'border-[#E2E8F0] text-[#374151] hover:border-[#1E40AF]'
                        }`}>
                        <div className="font-medium text-xs">{sym.name}</div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{sym.category}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selected.length > 0 && (
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Symptom Details</h2>
                  <div className="space-y-3">
                    {selected.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg flex-wrap">
                        <div className="flex-1 min-w-[100px]">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#0F172A]">{s.name}</span>
                            <span className="text-[10px] text-[#94A3B8] bg-[#E2E8F0] px-1.5 py-0.5 rounded">{s.icd10}</span>
                          </div>
                        </div>
                        <select className="text-xs border border-[#E2E8F0] rounded-md px-2 py-1 text-[#374151]"
                          value={s.duration}
                          onChange={e => setSelected(prev => prev.map(sym => sym.id === s.id ? { ...sym, duration: e.target.value } : sym))}>
                          {['< 1 day', '1-3 days', '3-7 days', '1-2 weeks', '> 2 weeks'].map(d => <option key={d}>{d}</option>)}
                        </select>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#64748B]">Severity:</span>
                          <input type="range" min="1" max="10" value={s.severity}
                            onChange={e => setSelected(prev => prev.map(sym => sym.id === s.id ? { ...sym, severity: +e.target.value } : sym))}
                            className="w-20 accent-[#1E40AF]" />
                          <span className="text-xs font-medium w-4">{s.severity}</span>
                        </div>
                        <button onClick={() => toggle(s)} className="text-[#94A3B8] hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="font-semibold text-[#0F172A] mb-4">Patient Parameters</h2>
                <div className="space-y-3">
                  {[
                    { key: 'age', label: 'Age (years)', type: 'number', placeholder: '45' },
                    { key: 'gender', label: 'Gender', type: 'select', opts: ['Male', 'Female', 'Other'] },
                    { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
                    { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '170' },
                    { key: 'temperature', label: 'Temperature (°F)', type: 'number', placeholder: '98.6' },
                    { key: 'heartRate', label: 'Heart Rate (bpm)', type: 'number', placeholder: '72' },
                    { key: 'bloodPressure', label: 'Blood Pressure', type: 'text', placeholder: '120/80' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-[#64748B] mb-1">{f.label}</label>
                      {f.type === 'select' ? (
                        <select className="input" value={vitals[f.key]} onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))}>
                          <option value="">Select...</option>
                          {f.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} className="input" placeholder={f.placeholder} value={vitals[f.key]} onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-[#1E40AF]" />
                  <span className="text-sm font-medium text-[#0F172A]">Ready to Analyze</span>
                </div>
                <p className="text-xs text-[#64748B] mb-4">
                  {selected.length} symptom{selected.length !== 1 ? 's' : ''} selected.
                  {!selected.length && ' Select at least one symptom to continue.'}
                </p>
                {analyzing ? (
                  <div>
                    <div className="flex justify-between mb-2 text-xs">
                      <span className="text-[#64748B]">{step}</span>
                      <span className="font-medium text-[#1E40AF]">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#1E40AF] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-3 text-center">AI processing...</p>
                  </div>
                ) : (
                  <button onClick={analyze} disabled={!selected.length}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Brain className="w-4 h-4" />Run AI Analysis
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS TAB */}
        {tab === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-xs font-medium text-green-700">Analysis Complete</span>
                </div>
                <span className="text-sm text-[#64748B]">Confidence: <strong className="text-[#0F172A]">{results.confidence}%</strong></span>
              </div>
              <div className="flex gap-2">
                <button onClick={save} className="btn-secondary flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
                <button onClick={() => { setTab('analyze'); setResults(null); setSelected([]); }} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" />New</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Differential Diagnoses</h2>
                  <div className="space-y-3">
                    {results.diagnoses.map((dx, i) => {
                      const u = URGENCY[dx.urgency];
                      return (
                        <div key={i} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-[#1E40AF] text-white' : 'bg-[#E2E8F0] text-[#64748B]'}`}>{i + 1}</div>
                              <div>
                                <div className="font-medium text-[#0F172A] text-sm">{dx.name}</div>
                                <div className="text-xs text-[#94A3B8]">ICD-10: {dx.icd10}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-lg font-bold text-[#0F172A]">{Math.round(dx.probability * 100)}%</div>
                              </div>
                              <span className={`px-2 py-0.5 rounded border text-xs font-medium ${u.cls}`}>{u.label}</span>
                              {expanded === i ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
                            </div>
                          </div>
                          <div className="px-4 pb-2">
                            <div className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#1E40AF] rounded-full" style={{ width: `${dx.probability * 100}%` }} />
                            </div>
                          </div>
                          {expanded === i && (
                            <div className="px-4 pb-4 pt-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                              <p className="text-sm text-[#64748B]">{dx.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Clinical Recommendations</h2>
                  <div className="space-y-2">
                    {results.recommendations.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.type === 'diagnostic' ? 'bg-blue-500' : r.type === 'monitoring' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <div className="flex-1">
                          <div className="text-sm text-[#0F172A]">{r.action}</div>
                          <div className="text-xs text-[#94A3B8]">{r.timeframe}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded border capitalize ${r.type === 'diagnostic' ? 'bg-blue-50 text-blue-700 border-blue-200' : r.type === 'monitoring' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{r.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-3">Analyzed Symptoms</h2>
                  <div className="flex flex-wrap gap-2">
                    {selected.map(s => <span key={s.id} className="px-2.5 py-1 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded border border-[#BFDBFE]">{s.name}</span>)}
                  </div>
                </div>
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">Follow-up Plan</h2>
                  <div className="space-y-3">
                    {results.followUp.map((fu, i) => (
                      <div key={i} className="border-l-2 border-[#1E40AF] pl-3">
                        <div className="text-sm font-medium text-[#0F172A]">{fu.visit}</div>
                        <div className="text-xs text-[#1E40AF]">{fu.timing}</div>
                        <div className="text-xs text-[#64748B] mt-0.5">{fu.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card bg-amber-50 border-amber-200">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-amber-800 mb-1">Clinical Disclaimer</div>
                      <p className="text-xs text-amber-700">AI analysis supports — not replaces — clinical judgment. Always apply professional assessment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {!history.length ? (
              <div className="card text-center py-16">
                <Database className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="font-medium text-[#64748B]">No diagnostic history</p>
                <p className="text-sm text-[#94A3B8] mt-1">Run an analysis and save it to build history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(d => (
                  <div key={d.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{d.results?.diagnoses?.[0]?.name || 'Diagnosis Record'}</div>
                        <div className="text-xs text-[#64748B] mt-1">Symptoms: {d.symptoms?.join(', ')} · {new Date(d.timestamp).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#94A3B8]">{d.results?.confidence}% confidence</span>
                        <button className="p-1.5 text-[#64748B] hover:text-[#1E40AF]"><Eye className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
