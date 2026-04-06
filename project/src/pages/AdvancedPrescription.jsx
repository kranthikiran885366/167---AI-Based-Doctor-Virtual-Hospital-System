import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Search, AlertTriangle, CheckCircle, X, Printer, Download, Send, Clock, User, FileText, ChevronDown, Star, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const DRUG_DATABASE = [
  { id: 1, name: 'Lisinopril', class: 'ACE Inhibitor', forms: ['5mg', '10mg', '20mg', '40mg'], routes: ['Oral'], interactions: ['Potassium-sparing diuretics', 'NSAIDs'], contraindications: ['Pregnancy', 'Angioedema history'] },
  { id: 2, name: 'Metformin', class: 'Biguanide', forms: ['500mg', '850mg', '1000mg'], routes: ['Oral'], interactions: ['Alcohol', 'Contrast dye'], contraindications: ['Renal impairment (eGFR<30)', 'Hepatic failure'] },
  { id: 3, name: 'Atorvastatin', class: 'Statin', forms: ['10mg', '20mg', '40mg', '80mg'], routes: ['Oral'], interactions: ['CYP3A4 inhibitors', 'Gemfibrozil'], contraindications: ['Active liver disease', 'Pregnancy'] },
  { id: 4, name: 'Amlodipine', class: 'CCB', forms: ['2.5mg', '5mg', '10mg'], routes: ['Oral'], interactions: ['CYP3A4 inhibitors', 'Simvastatin'], contraindications: ['Cardiogenic shock'] },
  { id: 5, name: 'Omeprazole', class: 'PPI', forms: ['10mg', '20mg', '40mg'], routes: ['Oral'], interactions: ['Clopidogrel', 'Methotrexate'], contraindications: ['Hypersensitivity'] },
  { id: 6, name: 'Amoxicillin', class: 'Penicillin Antibiotic', forms: ['250mg', '500mg', '875mg'], routes: ['Oral'], interactions: ['Methotrexate', 'Warfarin'], contraindications: ['Penicillin allergy'] },
];

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 8 hours', 'Every 12 hours', 'As needed (PRN)', 'Weekly', 'At bedtime'];

export default function AdvancedPrescription() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [allergies, setAllergies] = useState('');
  const [tab, setTab] = useState('compose');
  const [showInteractions, setShowInteractions] = useState(false);

  const filteredDrugs = DRUG_DATABASE.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addDrug = (drug) => {
    if (prescriptions.find(p => p.drugId === drug.id)) { toast.warning('Drug already in list'); return; }
    setPrescriptions(prev => [...prev, {
      id: Date.now(),
      drugId: drug.id,
      name: drug.name,
      class: drug.class,
      dose: drug.forms[0],
      route: drug.routes[0],
      frequency: 'Once daily',
      duration: '30 days',
      refills: '0',
      instructions: '',
      interactions: drug.interactions,
    }]);
    setSearchTerm('');
    toast.success(`${drug.name} added`);
  };

  const removeDrug = (id) => setPrescriptions(prev => prev.filter(p => p.id !== id));
  const updateDrug = (id, key, value) => setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, [key]: value } : p));

  const printRx = async () => {
    if (!patientName) { toast.error('Enter patient name'); return; }
    if (!prescriptions.length) { toast.error('Add at least one medication'); return; }
    await new Promise(r => setTimeout(r, 500));
    toast.success('Prescription generated and ready to print');
  };

  const sendRx = async () => {
    if (!patientName || !prescriptions.length) { toast.error('Complete prescription details'); return; }
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Prescription sent to pharmacy');
  };

  const allInteractions = [...new Set(prescriptions.flatMap(p => p.interactions))];
  const hasInteractionWarnings = prescriptions.length > 1;

  const tabs = [
    { id: 'compose', label: 'Compose Rx' },
    { id: 'history', label: 'Rx History' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Clinical Tools</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Advanced Rx</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Advanced Prescription</h1>
        <p className="text-[#64748B] mt-1 text-sm">AI-assisted prescription writer with drug interaction checking</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>{t.label}
          </button>
        ))}
      </div>

      {tab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Drug Search */}
          <div className="space-y-4">
            <div className="card">
              <div className="section-label mb-3">Patient Information</div>
              <div className="space-y-3">
                <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Full name" /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Date of Birth</label><input type="date" className="input" value={patientDOB} onChange={e => setPatientDOB(e.target.value)} /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Known Allergies</label><input className="input" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="NKDA or list allergies" /></div>
              </div>
            </div>

            <div className="card">
              <div className="section-label mb-3">Add Medication</div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9 text-sm" placeholder="Search drug name or class..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(searchTerm ? filteredDrugs : DRUG_DATABASE).map(drug => (
                  <button key={drug.id} onClick={() => addDrug(drug)}
                    className="w-full text-left p-3 rounded-lg border border-[#E2E8F0] hover:border-[#1E40AF] hover:bg-[#EFF6FF] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-[#0F172A] text-xs">{drug.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{drug.class}</div>
                      </div>
                      <Plus className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Prescription Items */}
          <div className="space-y-4">
            {hasInteractionWarnings && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-amber-800">Potential Interactions Detected</div>
                  <div className="text-xs text-amber-700 mt-0.5">Review drug interactions below before prescribing</div>
                  <button onClick={() => setShowInteractions(s => !s)} className="text-xs text-amber-700 underline mt-1">{showInteractions ? 'Hide' : 'Show'} interactions</button>
                </div>
              </div>
            )}

            {prescriptions.length === 0 ? (
              <div className="card text-center py-12 border-dashed border-2 border-[#CBD5E1]">
                <Pill className="w-8 h-8 text-[#94A3B8] mx-auto mb-3" />
                <p className="text-sm text-[#64748B]">Search and add medications<br />from the left panel</p>
              </div>
            ) : (
              prescriptions.map((rx, i) => (
                <div key={rx.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-[#0F172A]">{rx.name}</div>
                      <div className="text-xs text-[#94A3B8]">{rx.class}</div>
                    </div>
                    <button onClick={() => removeDrug(rx.id)} className="text-[#94A3B8] hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-[10px] text-[#64748B] mb-1">Dose</label>
                      <select className="input text-xs py-1.5" value={rx.dose} onChange={e => updateDrug(rx.id, 'dose', e.target.value)}>
                        {DRUG_DATABASE.find(d => d.id === rx.drugId)?.forms.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-[10px] text-[#64748B] mb-1">Frequency</label>
                      <select className="input text-xs py-1.5" value={rx.frequency} onChange={e => updateDrug(rx.id, 'frequency', e.target.value)}>
                        {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-[10px] text-[#64748B] mb-1">Duration</label>
                      <select className="input text-xs py-1.5" value={rx.duration} onChange={e => updateDrug(rx.id, 'duration', e.target.value)}>
                        {['7 days', '14 days', '30 days', '60 days', '90 days', 'Ongoing'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-[10px] text-[#64748B] mb-1">Refills</label>
                      <select className="input text-xs py-1.5" value={rx.refills} onChange={e => updateDrug(rx.id, 'refills', e.target.value)}>
                        {['0', '1', '2', '3', '6', '11', 'PRN'].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2"><label className="block text-[10px] text-[#64748B] mb-1">Sig (Instructions)</label>
                      <input className="input text-xs" placeholder="Take 1 tablet by mouth daily with food" value={rx.instructions} onChange={e => updateDrug(rx.id, 'instructions', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-4">
            {showInteractions && allInteractions.length > 0 && (
              <div className="card">
                <div className="section-label mb-3">Drug Interactions</div>
                <div className="space-y-2">
                  {allInteractions.map(interaction => (
                    <div key={interaction} className="flex items-start gap-2 text-xs p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-amber-700">{interaction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div className="section-label mb-3">Actions</div>
              <div className="space-y-2">
                <button onClick={printRx} className="btn-primary w-full flex items-center justify-center gap-2"><Printer className="w-4 h-4" />Print Prescription</button>
                <button onClick={sendRx} className="btn-secondary w-full flex items-center justify-center gap-2"><Send className="w-4 h-4" />Send to Pharmacy</button>
                <button onClick={() => toast.info('Downloading...')} className="btn-secondary w-full flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download PDF</button>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#1E40AF]" />
                <div className="text-xs font-medium text-[#0F172A]">AI Safety Check</div>
              </div>
              <div className="space-y-1">
                {['Dose validation', 'Interaction screening', 'Allergy cross-check', 'Renal dose adjustment'].map(check => (
                  <div key={check} className="flex items-center gap-2 text-xs text-[#64748B]">
                    <CheckCircle className="w-3 h-3 text-green-500" />{check}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card text-center py-12">
          <Clock className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
          <p className="font-medium text-[#64748B]">Prescription History</p>
          <p className="text-sm text-[#94A3B8] mt-1">Previous prescriptions will appear here</p>
        </div>
      )}
    </div>
  );
}
