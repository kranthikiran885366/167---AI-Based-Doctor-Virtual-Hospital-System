import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Activity, Heart, Eye, Ear, Thermometer, Weight, Ruler, CheckCircle, Save, FileText, ChevronDown, ChevronUp, Plus, Minus, RotateCcw, Brain, Smile } from 'lucide-react';
import { toast } from 'react-toastify';

const EXAM_SECTIONS = [
  {
    id: 'vitals', title: 'Vital Signs', icon: Activity,
    fields: [
      { key: 'bp_sys', label: 'Blood Pressure Systolic', unit: 'mmHg', type: 'number', ref: '90-140' },
      { key: 'bp_dia', label: 'Blood Pressure Diastolic', unit: 'mmHg', type: 'number', ref: '60-90' },
      { key: 'hr', label: 'Heart Rate', unit: 'bpm', type: 'number', ref: '60-100' },
      { key: 'temp', label: 'Temperature', unit: '°F', type: 'number', ref: '97-99' },
      { key: 'rr', label: 'Respiratory Rate', unit: '/min', type: 'number', ref: '12-20' },
      { key: 'spo2', label: 'SpO₂', unit: '%', type: 'number', ref: '95-100' },
      { key: 'weight', label: 'Weight', unit: 'kg', type: 'number', ref: '' },
      { key: 'height', label: 'Height', unit: 'cm', type: 'number', ref: '' },
    ]
  },
  {
    id: 'general', title: 'General Appearance', icon: Stethoscope,
    fields: [
      { key: 'appearance', label: 'Overall Appearance', type: 'select', options: ['Well-appearing, NAD', 'Acute distress', 'Chronic distress', 'Mildly uncomfortable', 'Cachectic', 'Obese'] },
      { key: 'consciousness', label: 'Level of Consciousness', type: 'select', options: ['Alert and oriented x4', 'Confused', 'Lethargic', 'Obtunded', 'Stuporous'] },
      { key: 'cooperation', label: 'Cooperation', type: 'select', options: ['Cooperative', 'Uncooperative', 'Agitated', 'Combative'] },
    ]
  },
  {
    id: 'cardiovascular', title: 'Cardiovascular', icon: Heart,
    fields: [
      { key: 'heart_sounds', label: 'Heart Sounds', type: 'select', options: ['Regular rate and rhythm, no murmurs', 'Irregular rhythm', 'Systolic murmur', 'Diastolic murmur', 'S3 gallop', 'S4 gallop'] },
      { key: 'pulses', label: 'Peripheral Pulses', type: 'select', options: ['2+ bilateral', '1+ diminished', 'Absent', 'Bounding'] },
      { key: 'edema', label: 'Edema', type: 'select', options: ['None', '1+ pitting bilateral LE', '2+ pitting bilateral LE', '3+ pitting bilateral LE', 'Non-pitting'] },
      { key: 'jvd', label: 'JVD', type: 'select', options: ['Absent', 'Present at 45°', 'Present at 30°'] },
      { key: 'cv_notes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'respiratory', title: 'Respiratory', icon: Activity,
    fields: [
      { key: 'breath_sounds', label: 'Breath Sounds', type: 'select', options: ['Clear to auscultation bilaterally', 'Crackles bilaterally', 'Crackles right base', 'Crackles left base', 'Wheezes bilateral', 'Rhonchi', 'Absent right', 'Absent left'] },
      { key: 'effort', label: 'Work of Breathing', type: 'select', options: ['Unlabored', 'Mildly labored', 'Moderately labored', 'Severely labored', 'Accessory muscle use'] },
      { key: 'percussion', label: 'Percussion', type: 'select', options: ['Resonant bilateral', 'Dull right base', 'Dull left base', 'Dull bilateral', 'Hyperresonant'] },
      { key: 'resp_notes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'neurological', title: 'Neurological', icon: Brain,
    fields: [
      { key: 'orientation', label: 'Orientation', type: 'select', options: ['Person, place, time, situation', 'Person and place only', 'Person only', 'Disoriented'] },
      { key: 'cranial_nerves', label: 'Cranial Nerves', type: 'select', options: ['CN II-XII intact', 'CN II deficit', 'CN III deficit', 'CN VII deficit (facial palsy)', 'Multiple deficits'] },
      { key: 'motor', label: 'Motor Strength', type: 'select', options: ['5/5 bilateral', '4/5 R weakness', '4/5 L weakness', '3/5 weakness', 'Hemiplegia'] },
      { key: 'reflexes', label: 'Reflexes', type: 'select', options: ['2+ symmetrical', 'Hyperreflexia', 'Hyporeflexia', 'Areflexia', 'Asymmetric'] },
      { key: 'neuro_notes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
];

export default function ComprehensiveExamination() {
  const [expanded, setExpanded] = useState({ vitals: true, general: true, cardiovascular: true, respiratory: false, neurological: false });
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const set = (key, val) => setValues(prev => ({ ...prev, [key]: val }));

  const getFlag = (key, val) => {
    const flagRanges = { bp_sys: [90, 140], bp_dia: [60, 90], hr: [60, 100], temp: [97, 99], rr: [12, 20], spo2: [95, 100] };
    if (key in flagRanges && val) {
      const n = parseFloat(val);
      const [min, max] = flagRanges[key];
      if (n < min || n > max) return 'abnormal';
    }
    return 'normal';
  };

  const save = async () => {
    if (!patientName) { toast.error('Enter patient name'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    toast.success('Examination saved');
  };

  const completion = Math.round((Object.keys(values).length / EXAM_SECTIONS.reduce((s, sec) => s + sec.fields.length, 0)) * 100);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Clinical</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Physical Exam</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Comprehensive Examination</h1>
            <p className="text-[#64748B] mt-1 text-sm">Systematic physical examination with structured documentation</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-[#64748B]">{completion}% complete</div>
            <div className="w-24 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#1E40AF] rounded-full transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Patient + Date */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Patient full name" /></div>
          <div><label className="block text-xs text-[#64748B] mb-1">Exam Date</label><input type="date" className="input" value={examDate} onChange={e => setExamDate(e.target.value)} /></div>
          <div><label className="block text-xs text-[#64748B] mb-1">Examiner</label><input className="input" defaultValue="Dr. User" /></div>
        </div>
      </div>

      {/* Exam Sections */}
      <div className="space-y-4 mb-6">
        {EXAM_SECTIONS.map(section => (
          <div key={section.id} className="card p-0 overflow-hidden">
            <button onClick={() => toggle(section.id)} className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-xl flex items-center justify-center"><section.icon className="w-4 h-4 text-[#1E40AF]" /></div>
                <div className="font-semibold text-[#0F172A]">{section.title}</div>
                <span className="text-xs text-[#94A3B8]">{section.fields.filter(f => values[f.key]).length}/{section.fields.length} fields</span>
              </div>
              {expanded[section.id] ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
            </button>
            <AnimatePresence>
              {expanded[section.id] && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 border-t border-[#E2E8F0] pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {section.fields.map(field => (
                        <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                          <label className="block text-xs text-[#64748B] mb-1">
                            {field.label}
                            {field.ref && <span className="text-[#94A3B8] ml-1">(ref: {field.ref})</span>}
                          </label>
                          {field.type === 'number' ? (
                            <div className="relative">
                              <input type="number" className={`input pr-12 ${getFlag(field.key, values[field.key]) === 'abnormal' ? 'border-amber-400 bg-amber-50' : ''}`} value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)} placeholder={field.ref?.split('-')[0] || ''} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">{field.unit}</span>
                            </div>
                          ) : field.type === 'select' ? (
                            <select className="input" value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)}>
                              <option value="">Select...</option>
                              {field.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <textarea className="input h-16 resize-none text-sm" value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)} placeholder="Enter clinical observations..." />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Impression */}
      <div className="card mb-6">
        <h2 className="font-semibold text-[#0F172A] mb-3">Clinical Impression & Plan</h2>
        <div className="space-y-3">
          <div><label className="block text-xs text-[#64748B] mb-1">Assessment</label><textarea className="input h-20 resize-none text-sm" placeholder="Primary and secondary diagnoses..." value={values.assessment || ''} onChange={e => set('assessment', e.target.value)} /></div>
          <div><label className="block text-xs text-[#64748B] mb-1">Plan</label><textarea className="input h-20 resize-none text-sm" placeholder="Diagnostic workup, treatment, follow-up..." value={values.plan || ''} onChange={e => set('plan', e.target.value)} /></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Examination</>}
        </button>
        <button onClick={() => toast.info('Generating report...')} className="btn-secondary flex items-center gap-2"><FileText className="w-4 h-4" />Generate Report</button>
        <button onClick={() => { setValues({}); setPatientName(''); }} className="btn-secondary flex items-center gap-2 ml-auto"><RotateCcw className="w-4 h-4" />Clear</button>
      </div>
    </div>
  );
}
