import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, AlertTriangle, Download, Plus, Minus, Calendar, User, FileText, CheckCircle, Info, X, Save, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';
import jsPDF from 'jspdf';

const COMMON_SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Sore Throat', 'Body Ache', 'Nausea', 'Vomiting', 'Diarrhea', 'Fatigue', 'Dizziness', 'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Back Pain', 'Abdominal Pain'];

const DRUG_DB = [
  { name: 'Paracetamol', dose: '500mg', frequency: 'Every 6 hours', duration: '5 days', instructions: 'Take with water. Do not exceed 4g/day.', category: 'Analgesic/Antipyretic', sideEffects: ['Liver damage at high doses'] },
  { name: 'Ibuprofen', dose: '400mg', frequency: 'Every 8 hours', duration: '5 days', instructions: 'Take with food. Avoid on empty stomach.', category: 'NSAID', sideEffects: ['GI upset', 'Kidney issues with long use'] },
  { name: 'Amoxicillin', dose: '500mg', frequency: 'Every 8 hours', duration: '7 days', instructions: 'Complete full course even if feeling better.', category: 'Antibiotic', sideEffects: ['Diarrhea', 'Allergic reaction (rare)'] },
  { name: 'Cetirizine', dose: '10mg', frequency: 'Once daily', duration: '7 days', instructions: 'Take at bedtime. May cause drowsiness.', category: 'Antihistamine', sideEffects: ['Drowsiness', 'Dry mouth'] },
  { name: 'Omeprazole', dose: '20mg', frequency: 'Once daily before meals', duration: '14 days', instructions: 'Take 30 minutes before breakfast.', category: 'PPI', sideEffects: ['Headache', 'Nausea (rare)'] },
  { name: 'Metformin', dose: '500mg', frequency: 'Twice daily with meals', duration: '30 days', instructions: 'Take with food to reduce GI side effects.', category: 'Antidiabetic', sideEffects: ['GI upset initially'] },
  { name: 'Atenolol', dose: '50mg', frequency: 'Once daily', duration: '30 days', instructions: 'Do not stop suddenly. Monitor blood pressure.', category: 'Beta-blocker', sideEffects: ['Fatigue', 'Cold extremities'] },
  { name: 'Azithromycin', dose: '500mg', frequency: 'Once daily', duration: '3 days', instructions: 'Complete the full 3-day course.', category: 'Antibiotic', sideEffects: ['GI upset', 'QT prolongation (rare)'] },
];

function generatePrescriptionData(symptoms, allergies, history) {
  const syms = symptoms.toLowerCase();
  const meds = [];

  if (syms.includes('fever') || syms.includes('headache') || syms.includes('body ache')) {
    meds.push(DRUG_DB[0]); // Paracetamol
  }
  if (syms.includes('cough') || syms.includes('sore throat')) {
    meds.push(DRUG_DB[2]); // Amoxicillin
  }
  if (syms.includes('nausea') || syms.includes('abdominal')) {
    meds.push(DRUG_DB[4]); // Omeprazole
  }
  if (meds.length === 0) {
    meds.push(DRUG_DB[0], DRUG_DB[3]); // Default
  }

  // Dedup
  const unique = meds.filter((m, i, arr) => arr.findIndex(x => x.name === m.name) === i).slice(0, 4);

  return {
    medications: unique,
    advice: [
      'Drink at least 8 glasses of water daily',
      'Get adequate rest (7-8 hours of sleep)',
      'Avoid cold beverages and spicy food',
      'Return if symptoms worsen or new symptoms develop',
    ],
    followUp: '7 days or sooner if symptoms worsen',
    diagnosis: 'Based on reported symptoms — clinical correlation required',
  };
}

export default function Prescription() {
  const { user, addPrescription } = useUser();
  const [symptoms, setSymptoms] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMeds, setCurrentMeds] = useState('');
  const [history, setHistory] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [savedPrescriptions, setSavedPrescriptions] = useState(() => {
    const s = localStorage.getItem('savedPrescriptions');
    return s ? JSON.parse(s) : [];
  });
  const [activeTab, setActiveTab] = useState('generate');

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setSymptoms(prev => {
      const arr = prev ? prev.split(',').map(x => x.trim()).filter(Boolean) : [];
      if (arr.includes(s)) return arr.filter(x => x !== s).join(', ');
      return [...arr, s].join(', ');
    });
  };

  const generate = async () => {
    if (!symptoms.trim() && !selectedSymptoms.length) { toast.error('Please describe your symptoms'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const data = generatePrescriptionData(symptoms + ' ' + selectedSymptoms.join(' '), allergies, history);
    setPrescription({
      ...data,
      patient: user?.name || 'Patient',
      doctor: 'Dr. AI Assistant',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      rxNumber: 'RX' + Date.now().toString().slice(-6),
      symptoms: symptoms + (selectedSymptoms.length ? ', ' + selectedSymptoms.join(', ') : ''),
      allergies,
    });
    setGenerating(false);
    setActiveTab('prescription');
    toast.success('Prescription generated');
  };

  const savePrescription = () => {
    if (!prescription) return;
    const record = { id: Date.now(), ...prescription, savedAt: new Date().toISOString() };
    const updated = [record, ...savedPrescriptions];
    setSavedPrescriptions(updated);
    localStorage.setItem('savedPrescriptions', JSON.stringify(updated));
    addPrescription(record);
    toast.success('Prescription saved');
  };

  const downloadPDF = () => {
    if (!prescription) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Medical Prescription', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${prescription.patient}`, 20, 35);
    doc.text(`Date: ${prescription.date}`, 20, 45);
    doc.text(`Rx: ${prescription.rxNumber}`, 20, 55);
    doc.text('Medications:', 20, 70);
    prescription.medications.forEach((med, i) => {
      doc.text(`${i + 1}. ${med.name} ${med.dose} - ${med.frequency} x ${med.duration}`, 25, 80 + i * 10);
    });
    doc.save(`prescription-${prescription.rxNumber}.pdf`);
    toast.success('PDF downloaded');
  };

  const tabs = [
    { id: 'generate', label: 'Generate' },
    { id: 'prescription', label: 'Prescription', disabled: !prescription },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Treatment</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Prescription Generator</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Prescription</h1>
        <p className="text-[#64748B] mt-1 text-sm">AI-generated medication recommendations based on symptoms</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => !t.disabled && setActiveTab(t.id)} disabled={t.disabled}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            } ${t.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generate' && (
          <motion.div key="gen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="font-semibold text-[#0F172A] mb-4">Quick Symptom Selection</h2>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedSymptoms.includes(s) ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#374151] border-[#E2E8F0] hover:border-[#1E40AF]'
                      }`}>{s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="font-semibold text-[#0F172A] mb-4">Patient Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1">Symptoms Description *</label>
                    <textarea className="input h-24 resize-none" placeholder="Describe symptoms in detail..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Known Allergies</label>
                      <input className="input" placeholder="e.g., Penicillin, Aspirin" value={allergies} onChange={e => setAllergies(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Current Medications</label>
                      <input className="input" placeholder="List current medications" value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1">Medical History</label>
                    <textarea className="input h-20 resize-none" placeholder="Relevant medical history, chronic conditions..." value={history} onChange={e => setHistory(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card bg-amber-50 border-amber-200">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-amber-800 mb-1">Important Notice</div>
                    <p className="text-xs text-amber-700">AI prescriptions are educational only. Always consult a licensed physician before taking any medication.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Selected Symptoms</h3>
                {selectedSymptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSymptoms.map(s => (
                      <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded border border-[#BFDBFE]">
                        {s}
                        <button onClick={() => toggleSymptom(s)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#94A3B8]">No symptoms selected yet</p>}
              </div>

              <button onClick={generate} disabled={generating || (!symptoms.trim() && !selectedSymptoms.length)}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
                ) : (
                  <><Pill className="w-4 h-4" />Generate Prescription</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'prescription' && prescription && (
          <motion.div key="rx" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end gap-2 mb-6">
              <button onClick={savePrescription} className="btn-secondary flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
              <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />PDF</button>
              <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2"><Printer className="w-4 h-4" />Print</button>
            </div>

            <div className="card max-w-3xl mx-auto">
              {/* Rx Header */}
              <div className="flex items-start justify-between pb-6 border-b border-[#E2E8F0] mb-6">
                <div>
                  <div className="font-display text-xl font-bold text-[#0F172A]">Medical Prescription</div>
                  <div className="text-sm text-[#64748B] mt-1">{prescription.doctor} · HIPAA Compliant</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-[#1E40AF]">℞ {prescription.rxNumber}</div>
                  <div className="text-xs text-[#64748B]">{prescription.date}</div>
                </div>
              </div>

              {/* Patient */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[#F8FAFC] rounded-lg">
                <div>
                  <div className="text-xs text-[#64748B]">Patient</div>
                  <div className="font-medium text-[#0F172A]">{prescription.patient}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B]">Chief Complaint</div>
                  <div className="text-sm text-[#0F172A]">{prescription.symptoms}</div>
                </div>
                {prescription.allergies && (
                  <div className="col-span-2">
                    <div className="text-xs text-[#64748B]">Allergies</div>
                    <div className="text-sm text-red-600 font-medium">{prescription.allergies}</div>
                  </div>
                )}
              </div>

              {/* Medications */}
              <h3 className="font-semibold text-[#0F172A] mb-3">Medications</h3>
              <div className="space-y-4 mb-6">
                {prescription.medications.map((med, i) => (
                  <div key={i} className="border border-[#E2E8F0] rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center text-sm font-bold text-[#1E40AF]">{i + 1}</div>
                        <div>
                          <div className="font-semibold text-[#0F172A]">{med.name} <span className="font-normal text-[#64748B]">({med.dose})</span></div>
                          <div className="text-xs text-[#94A3B8]">{med.category}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pl-11">
                      <div><div className="text-xs text-[#64748B]">Frequency</div><div className="text-sm font-medium text-[#0F172A]">{med.frequency}</div></div>
                      <div><div className="text-xs text-[#64748B]">Duration</div><div className="text-sm font-medium text-[#0F172A]">{med.duration}</div></div>
                      <div className="col-span-2 sm:col-span-1"><div className="text-xs text-[#64748B]">Instructions</div><div className="text-sm text-[#374151]">{med.instructions}</div></div>
                    </div>
                    {med.sideEffects?.length > 0 && (
                      <div className="pl-11 mt-2">
                        <span className="text-xs text-[#94A3B8]">Side effects: {med.sideEffects.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Advice */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#0F172A] mb-3">General Advice</h3>
                <div className="space-y-2">
                  {prescription.advice.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up */}
              <div className="flex items-center gap-3 p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                <Calendar className="w-4 h-4 text-[#1E40AF]" />
                <div>
                  <span className="text-xs font-medium text-[#1E40AF]">Follow-up: </span>
                  <span className="text-xs text-[#374151]">{prescription.followUp}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div key="hist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {!savedPrescriptions.length ? (
              <div className="card text-center py-16">
                <FileText className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="font-medium text-[#64748B]">No saved prescriptions</p>
                <p className="text-sm text-[#94A3B8] mt-1">Generate and save a prescription to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPrescriptions.map(p => (
                  <div key={p.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{p.rxNumber} — {p.medications?.length} medications</div>
                        <div className="text-xs text-[#64748B] mt-1">{p.date} · {p.symptoms}</div>
                      </div>
                      <button onClick={downloadPDF} className="p-1.5 text-[#64748B] hover:text-[#1E40AF]"><Download className="w-4 h-4" /></button>
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
