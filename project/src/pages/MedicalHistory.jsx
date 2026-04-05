import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Heart, Pill, User, Calendar, AlertTriangle, Plus, Trash2, Save, ChevronRight, ChevronLeft, CheckCircle, X, Edit, Download, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const STEPS = [
  { id: 0, label: 'Personal Info', icon: User },
  { id: 1, label: 'Chief Complaint', icon: AlertTriangle },
  { id: 2, label: 'Medical History', icon: FileText },
  { id: 3, label: 'Medications & Allergies', icon: Pill },
  { id: 4, label: 'Family & Social History', icon: Heart },
  { id: 5, label: 'Review & Save', icon: CheckCircle },
];

const CHRONIC_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'COPD', 'Arthritis', 'Cancer', 'Epilepsy', 'Depression', 'Anxiety', 'Thyroid Disease', 'Kidney Disease'];
const COMMON_ALLERGIES = ['Penicillin', 'Aspirin', 'Ibuprofen', 'Sulfa drugs', 'Codeine', 'Latex', 'Iodine', 'Peanuts'];
const COMMON_MEDICATIONS = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine', 'Omeprazole', 'Metoprolol', 'Losartan', 'Levothyroxine'];

export default function MedicalHistory() {
  const { user, addMedicalRecord } = useUser();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const [personal, setPersonal] = useState({ name: user?.name || '', age: '', gender: '', dob: '', phone: '', email: user?.email || '', emergency: '', bloodType: '', height: '', weight: '' });
  const [complaint, setComplaint] = useState({ chief: '', hpi: '', onset: '', duration: '', severity: 5, location: '', radiation: '', quality: '', timing: '' });
  const [history, setHistory] = useState({ pastMedical: '', surgeries: [], hospitalizations: [], conditions: [] });
  const [medsAllergies, setMedsAllergies] = useState({ medications: [], allergies: [], newMed: '', newAllergy: '' });
  const [family, setFamily] = useState({ diabetes: false, heartDisease: false, cancer: false, hypertension: false, stroke: false, mental: false, other: '', smoking: 'never', alcohol: 'never', exercise: 'moderate', occupation: '', stress: 'low' });

  const addCondition = (c) => setHistory(h => ({ ...h, conditions: h.conditions.includes(c) ? h.conditions.filter(x => x !== c) : [...h.conditions, c] }));
  const addMed = () => { if (medsAllergies.newMed) { setMedsAllergies(m => ({ ...m, medications: [...m.medications, { name: m.newMed, dose: '', frequency: '' }], newMed: '' })); } };
  const addAllergy = (a) => setMedsAllergies(m => ({ ...m, allergies: m.allergies.includes(a) ? m.allergies.filter(x => x !== a) : [...m.allergies, a] }));
  const addCustomAllergy = () => { if (medsAllergies.newAllergy) { setMedsAllergies(m => ({ ...m, allergies: [...m.allergies, m.newAllergy], newAllergy: '' })); } };

  const saveRecord = () => {
    const record = { personal, complaint, history, medsAllergies, family, timestamp: new Date().toISOString(), type: 'medical_history' };
    addMedicalRecord(record);
    setSaved(true);
    toast.success('Medical history saved successfully');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Patient</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Medical History</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Medical History</h1>
        <p className="text-[#64748B] mt-1 text-sm">Comprehensive patient medical history intake form</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              step === i ? 'bg-[#1E40AF] text-white' : i < step ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'bg-[#F1F5F9] text-[#64748B]'
            }`}>
              {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
              {s.label}
            </button>
            {i < STEPS.length - 1 && <div className={`w-6 h-0.5 flex-shrink-0 ${i < step ? 'bg-[#1E40AF]' : 'bg-[#E2E8F0]'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0: Personal Info */}
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
                { key: 'age', label: 'Age', type: 'number', placeholder: '45' },
                { key: 'gender', label: 'Gender', type: 'select', opts: ['Male', 'Female', 'Other', 'Prefer not to say'] },
                { key: 'dob', label: 'Date of Birth', type: 'date' },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
                { key: 'emergency', label: 'Emergency Contact', type: 'text', placeholder: 'Name and phone' },
                { key: 'bloodType', label: 'Blood Type', type: 'select', opts: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'] },
                { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '170' },
                { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
              ].map(f => (
                <div key={f.key} className={f.key === 'emergency' || f.key === 'email' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-[#64748B] mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select className="input" value={personal[f.key]} onChange={e => setPersonal(p => ({ ...p, [f.key]: e.target.value }))}>
                      <option value="">Select...</option>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} className="input" placeholder={f.placeholder} value={personal[f.key]} onChange={e => setPersonal(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1: Chief Complaint */}
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Chief Complaint & HPI</h2>
            <div className="space-y-4">
              <div><label className="block text-xs text-[#64748B] mb-1">Chief Complaint *</label><textarea className="input h-20 resize-none" placeholder="Main reason for visit..." value={complaint.chief} onChange={e => setComplaint(c => ({ ...c, chief: e.target.value }))} /></div>
              <div><label className="block text-xs text-[#64748B] mb-1">History of Present Illness</label><textarea className="input h-24 resize-none" placeholder="Describe the illness in detail..." value={complaint.hpi} onChange={e => setComplaint(c => ({ ...c, hpi: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-[#64748B] mb-1">Onset</label><input className="input" placeholder="When did it start?" value={complaint.onset} onChange={e => setComplaint(c => ({ ...c, onset: e.target.value }))} /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Duration</label><input className="input" placeholder="How long?" value={complaint.duration} onChange={e => setComplaint(c => ({ ...c, duration: e.target.value }))} /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Location</label><input className="input" placeholder="Where is the pain/symptom?" value={complaint.location} onChange={e => setComplaint(c => ({ ...c, location: e.target.value }))} /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Quality</label><input className="input" placeholder="Sharp, dull, burning, etc." value={complaint.quality} onChange={e => setComplaint(c => ({ ...c, quality: e.target.value }))} /></div>
              </div>
              <div>
                <label className="block text-xs text-[#64748B] mb-2">Severity (1-10): <span className="font-medium text-[#0F172A]">{complaint.severity}</span></label>
                <input type="range" min="1" max="10" value={complaint.severity} onChange={e => setComplaint(c => ({ ...c, severity: +e.target.value }))} className="w-full accent-[#1E40AF]" />
                <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1"><span>Mild</span><span>Moderate</span><span>Severe</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Medical History */}
        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Past Medical History</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#64748B] mb-2">Chronic Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {CHRONIC_CONDITIONS.map(c => (
                    <button key={c} onClick={() => addCondition(c)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${history.conditions.includes(c) ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#374151] border-[#E2E8F0] hover:border-[#1E40AF]'}`}>{c}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-xs text-[#64748B] mb-1">Past Medical History</label><textarea className="input h-20 resize-none" placeholder="Previous diagnoses, treatments..." value={history.pastMedical} onChange={e => setHistory(h => ({ ...h, pastMedical: e.target.value }))} /></div>
              <div>
                <label className="block text-xs text-[#64748B] mb-2">Previous Surgeries</label>
                {history.surgeries.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 p-2 bg-[#F8FAFC] rounded-lg">
                    <span className="flex-1 text-sm text-[#374151]">{s}</span>
                    <button onClick={() => setHistory(h => ({ ...h, surgeries: h.surgeries.filter((_, j) => j !== i) }))}><X className="w-4 h-4 text-[#94A3B8]" /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="Add surgery..." id="surgery-input" />
                  <button onClick={() => { const v = document.getElementById('surgery-input').value; if (v) { setHistory(h => ({ ...h, surgeries: [...h.surgeries, v] })); document.getElementById('surgery-input').value = ''; } }} className="btn-secondary text-sm px-3">Add</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Medications & Allergies */}
        {step === 3 && (
          <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Medications & Allergies</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-[#64748B] mb-2">Current Medications</label>
                <div className="flex gap-2 mb-3">
                  <input className="input flex-1" placeholder="Medication name..." value={medsAllergies.newMed} onChange={e => setMedsAllergies(m => ({ ...m, newMed: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addMed()} />
                  <button onClick={addMed} className="btn-secondary text-sm px-3">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_MEDICATIONS.map(m => (
                    <button key={m} onClick={() => setMedsAllergies(ma => ({ ...ma, medications: ma.medications.find(x => x.name === m) ? ma.medications : [...ma.medications, { name: m, dose: '', frequency: '' }] }))}
                      className="text-xs px-2.5 py-1 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:border-[#1E40AF] transition-colors">{m}</button>
                  ))}
                </div>
                <div className="space-y-2">
                  {medsAllergies.medications.map((med, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                      <Pill className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium text-[#0F172A]">{med.name}</span>
                      <input className="input w-24 text-xs py-1.5" placeholder="Dose" value={med.dose} onChange={e => setMedsAllergies(m => ({ ...m, medications: m.medications.map((x, j) => j === i ? { ...x, dose: e.target.value } : x) }))} />
                      <input className="input w-32 text-xs py-1.5" placeholder="Frequency" value={med.frequency} onChange={e => setMedsAllergies(m => ({ ...m, medications: m.medications.map((x, j) => j === i ? { ...x, frequency: e.target.value } : x) }))} />
                      <button onClick={() => setMedsAllergies(m => ({ ...m, medications: m.medications.filter((_, j) => j !== i) }))}><X className="w-4 h-4 text-[#94A3B8]" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#64748B] mb-2">Allergies</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_ALLERGIES.map(a => (
                    <button key={a} onClick={() => addAllergy(a)}
                      className={`text-xs px-2.5 py-1 border rounded-lg transition-colors ${medsAllergies.allergies.includes(a) ? 'bg-red-100 text-red-700 border-red-200' : 'border-[#E2E8F0] text-[#64748B] hover:border-red-300'}`}>{a}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="Other allergy..." value={medsAllergies.newAllergy} onChange={e => setMedsAllergies(m => ({ ...m, newAllergy: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addCustomAllergy()} />
                  <button onClick={addCustomAllergy} className="btn-secondary text-sm px-3">Add</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Family & Social */}
        {step === 4 && (
          <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Family & Social History</h2>
            <div className="space-y-6">
              <div>
                <div className="section-label mb-3">Family History</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'diabetes', label: 'Diabetes' },
                    { key: 'heartDisease', label: 'Heart Disease' },
                    { key: 'cancer', label: 'Cancer' },
                    { key: 'hypertension', label: 'Hypertension' },
                    { key: 'stroke', label: 'Stroke' },
                    { key: 'mental', label: 'Mental Health' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={family[item.key]} onChange={e => setFamily(f => ({ ...f, [item.key]: e.target.checked }))} className="accent-[#1E40AF] w-4 h-4" />
                      <span className="text-sm text-[#374151]">{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3"><label className="block text-xs text-[#64748B] mb-1">Other family conditions</label><input className="input" placeholder="Other..." value={family.other} onChange={e => setFamily(f => ({ ...f, other: e.target.value }))} /></div>
              </div>

              <div>
                <div className="section-label mb-3">Social History</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'smoking', label: 'Smoking', opts: ['never', 'former', 'current'] },
                    { key: 'alcohol', label: 'Alcohol', opts: ['never', 'occasionally', 'regularly', 'heavy'] },
                    { key: 'exercise', label: 'Exercise', opts: ['none', 'light', 'moderate', 'heavy'] },
                    { key: 'stress', label: 'Stress Level', opts: ['low', 'moderate', 'high', 'very high'] },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs text-[#64748B] mb-1">{field.label}</label>
                      <select className="input" value={family[field.key]} onChange={e => setFamily(f => ({ ...f, [field.key]: e.target.value }))}>
                        {field.opts.map(o => <option key={o} className="capitalize">{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="sm:col-span-2"><label className="block text-xs text-[#64748B] mb-1">Occupation</label><input className="input" placeholder="Current occupation" value={family.occupation} onChange={e => setFamily(f => ({ ...f, occupation: e.target.value }))} /></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Review */}
        {step === 5 && (
          <motion.div key="5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {saved ? (
              <div className="card text-center py-12">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-[#0F172A] mb-2">History Saved</h3>
                <p className="text-[#64748B] text-sm mb-6">Medical history has been saved to your records</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => { setSaved(false); setStep(0); }} className="btn-secondary">New Entry</button>
                  <button onClick={() => toast.info('Downloading...')} className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" />Download PDF</button>
                </div>
              </div>
            ) : (
              <div className="card">
                <h2 className="font-semibold text-[#0F172A] mb-4">Review & Confirm</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="section-label mb-2">Personal</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-[#64748B]">Name: </span><span className="font-medium text-[#0F172A]">{personal.name || '—'}</span></div>
                      <div><span className="text-[#64748B]">Age: </span><span className="font-medium text-[#0F172A]">{personal.age || '—'}</span></div>
                      <div><span className="text-[#64748B]">Gender: </span><span className="font-medium text-[#0F172A]">{personal.gender || '—'}</span></div>
                      <div><span className="text-[#64748B]">Blood Type: </span><span className="font-medium text-[#0F172A]">{personal.bloodType || '—'}</span></div>
                    </div>
                  </div>
                  {complaint.chief && (
                    <div className="p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="section-label mb-2">Chief Complaint</div>
                      <p className="text-sm text-[#374151]">{complaint.chief}</p>
                    </div>
                  )}
                  {history.conditions.length > 0 && (
                    <div className="p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="section-label mb-2">Conditions</div>
                      <div className="flex flex-wrap gap-2">
                        {history.conditions.map(c => <span key={c} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{c}</span>)}
                      </div>
                    </div>
                  )}
                  {medsAllergies.medications.length > 0 && (
                    <div className="p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="section-label mb-2">Medications</div>
                      <div className="space-y-1">
                        {medsAllergies.medications.map((m, i) => <div key={i} className="text-sm text-[#374151]">• {m.name} {m.dose} {m.frequency}</div>)}
                      </div>
                    </div>
                  )}
                  {medsAllergies.allergies.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="section-label text-red-600 mb-2">Allergies</div>
                      <div className="flex flex-wrap gap-2">
                        {medsAllergies.allergies.map(a => <span key={a} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">{a}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={saveRecord} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />Save Medical History
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {!saved && (
        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary flex items-center gap-2">
              Next<ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
