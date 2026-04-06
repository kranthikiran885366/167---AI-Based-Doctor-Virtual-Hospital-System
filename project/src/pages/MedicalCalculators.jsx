import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Heart, Activity, Weight, Brain, Thermometer, Plus, Minus, RotateCcw, Info, ChevronRight, AlertTriangle, CheckCircle, Ruler } from 'lucide-react';
import { toast } from 'react-toastify';

const CALCULATORS = [
  { id: 'bmi', title: 'Body Mass Index', icon: Weight, category: 'General', desc: 'Calculate BMI and weight status' },
  { id: 'bsa', title: 'Body Surface Area', icon: Ruler, category: 'General', desc: 'Calculate BSA using Mosteller formula' },
  { id: 'map', title: 'Mean Arterial Pressure', icon: Heart, category: 'Cardiovascular', desc: 'Calculate MAP from blood pressure' },
  { id: 'egfr', title: 'eGFR (CKD-EPI)', icon: Activity, category: 'Renal', desc: 'Estimate glomerular filtration rate' },
  { id: 'chadsvasc', title: 'CHA₂DS₂-VASc Score', icon: Heart, category: 'Cardiovascular', desc: 'AF stroke risk stratification' },
  { id: 'wells', title: 'Wells Score (DVT)', icon: Activity, category: 'Hematology', desc: 'DVT pre-test probability' },
];

const CATEGORIES = ['All', 'General', 'Cardiovascular', 'Renal', 'Hematology'];

function BMICalc() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [unit, setUnit] = useState('metric');
  const bmi = unit === 'metric'
    ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)
    : ((parseFloat(weight) / Math.pow(parseFloat(height), 2)) * 703).toFixed(1);
  const bmiNum = parseFloat(bmi);
  const status = bmiNum < 18.5 ? { label: 'Underweight', cls: 'text-blue-600', bg: 'bg-blue-50' } : bmiNum < 25 ? { label: 'Normal', cls: 'text-green-600', bg: 'bg-green-50' } : bmiNum < 30 ? { label: 'Overweight', cls: 'text-amber-600', bg: 'bg-amber-50' } : { label: 'Obese', cls: 'text-red-600', bg: 'bg-red-50' };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {['metric', 'imperial'].map(u => (
          <button key={u} onClick={() => setUnit(u)} className={`flex-1 py-2 text-sm rounded-lg border capitalize font-medium transition-colors ${unit === u ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#E2E8F0] text-[#64748B]'}`}>{u}</button>
        ))}
      </div>
      <div><label className="block text-xs text-[#64748B] mb-1">Height ({unit === 'metric' ? 'cm' : 'inches'})</label><input type="number" className="input" value={height} onChange={e => setHeight(e.target.value)} /></div>
      <div><label className="block text-xs text-[#64748B] mb-1">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label><input type="number" className="input" value={weight} onChange={e => setWeight(e.target.value)} /></div>
      {height && weight && (
        <div className={`p-4 rounded-xl ${status.bg} border text-center`}>
          <div className={`text-4xl font-bold ${status.cls}`}>{bmi}</div>
          <div className={`text-sm font-medium mt-1 ${status.cls}`}>{status.label}</div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-[10px]">
            {[{ range: '<18.5', label: 'Under', cls: 'bg-blue-100 text-blue-700' }, { range: '18.5-24.9', label: 'Normal', cls: 'bg-green-100 text-green-700' }, { range: '25-29.9', label: 'Over', cls: 'bg-amber-100 text-amber-700' }, { range: '≥30', label: 'Obese', cls: 'bg-red-100 text-red-700' }].map(r => (
              <div key={r.label} className={`px-1 py-1 rounded ${r.cls}`}><div className="font-medium">{r.range}</div><div>{r.label}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MAPCalc() {
  const [sys, setSys] = useState('120');
  const [dia, setDia] = useState('80');
  const map = ((parseFloat(sys) + 2 * parseFloat(dia)) / 3).toFixed(0);
  const mapNum = parseInt(map);
  const status = mapNum < 70 ? { label: 'Low', cls: 'text-red-600', note: 'May indicate shock — evaluate immediately' } : mapNum <= 100 ? { label: 'Normal', cls: 'text-green-600', note: 'Adequate perfusion pressure' } : { label: 'Elevated', cls: 'text-amber-600', note: 'May require intervention' };
  return (
    <div className="space-y-4">
      <div><label className="block text-xs text-[#64748B] mb-1">Systolic BP (mmHg)</label><input type="number" className="input" value={sys} onChange={e => setSys(e.target.value)} /></div>
      <div><label className="block text-xs text-[#64748B] mb-1">Diastolic BP (mmHg)</label><input type="number" className="input" value={dia} onChange={e => setDia(e.target.value)} /></div>
      {sys && dia && (
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
          <div className={`text-4xl font-bold ${status.cls}`}>{map} <span className="text-lg">mmHg</span></div>
          <div className={`text-sm font-medium mt-1 ${status.cls}`}>MAP — {status.label}</div>
          <p className="text-xs text-[#64748B] mt-2">{status.note}</p>
        </div>
      )}
      <div className="text-xs text-[#94A3B8]">Formula: MAP = (SBP + 2 × DBP) / 3</div>
    </div>
  );
}

function EGFRCalc() {
  const [creatinine, setCreatinine] = useState('1.0');
  const [age, setAge] = useState('50');
  const [gender, setGender] = useState('male');
  const cr = parseFloat(creatinine);
  const k = gender === 'female' ? 0.7 : 0.9;
  const alpha = gender === 'female' ? -0.241 : -0.302;
  const egfr = Math.round(142 * Math.pow(Math.min(cr / k, 1), alpha) * Math.pow(Math.max(cr / k, 1), -1.200) * Math.pow(0.9938, parseInt(age)) * (gender === 'female' ? 1.012 : 1));
  const stage = egfr >= 90 ? 'G1 — Normal' : egfr >= 60 ? 'G2 — Mildly decreased' : egfr >= 45 ? 'G3a — Mild-moderate' : egfr >= 30 ? 'G3b — Moderate-severe' : egfr >= 15 ? 'G4 — Severely decreased' : 'G5 — Kidney failure';
  const stageColor = egfr >= 60 ? 'text-green-600' : egfr >= 30 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-[#64748B] mb-1">Creatinine (mg/dL)</label><input type="number" step="0.1" className="input" value={creatinine} onChange={e => setCreatinine(e.target.value)} /></div>
        <div><label className="block text-xs text-[#64748B] mb-1">Age (years)</label><input type="number" className="input" value={age} onChange={e => setAge(e.target.value)} /></div>
      </div>
      <div><label className="block text-xs text-[#64748B] mb-1">Gender</label>
        <div className="flex gap-2">{['male', 'female'].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 text-sm rounded-lg border capitalize ${gender === g ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#E2E8F0] text-[#64748B]'}`}>{g}</button>)}</div>
      </div>
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
        <div className={`text-4xl font-bold ${stageColor}`}>{isNaN(egfr) ? '—' : egfr} <span className="text-lg">mL/min</span></div>
        <div className={`text-sm font-medium mt-1 ${stageColor}`}>{isNaN(egfr) ? 'Enter values' : stage}</div>
      </div>
    </div>
  );
}

function CHADSVASCCalc() {
  const items = [
    { key: 'chf', label: 'Congestive heart failure', points: 1 },
    { key: 'htn', label: 'Hypertension', points: 1 },
    { key: 'age75', label: 'Age ≥ 75 years', points: 2 },
    { key: 'dm', label: 'Diabetes mellitus', points: 1 },
    { key: 'stroke', label: 'Stroke / TIA / thromboembolism', points: 2 },
    { key: 'vascular', label: 'Vascular disease (MI, PAD)', points: 1 },
    { key: 'age65', label: 'Age 65-74 years', points: 1 },
    { key: 'female', label: 'Female sex', points: 1 },
  ];
  const [checks, setChecks] = useState({});
  const score = items.reduce((s, item) => s + (checks[item.key] ? item.points : 0), 0);
  const risk = score === 0 ? { label: 'Low', cls: 'text-green-600', note: 'No antithrombotic therapy needed' } : score === 1 ? { label: 'Low-Moderate', cls: 'text-amber-600', note: 'Consider anticoagulation' } : { label: 'Moderate-High', cls: 'text-red-600', note: 'Anticoagulation recommended' };
  return (
    <div className="space-y-3">
      {items.map(item => (
        <label key={item.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#F8FAFC]">
          <input type="checkbox" className="accent-[#1E40AF] w-4 h-4" checked={!!checks[item.key]} onChange={e => setChecks(c => ({ ...c, [item.key]: e.target.checked }))} />
          <span className="flex-1 text-sm text-[#374151]">{item.label}</span>
          <span className="text-xs text-[#94A3B8] font-medium">+{item.points}</span>
        </label>
      ))}
      <div className={`p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center mt-2`}>
        <div className={`text-4xl font-bold ${risk.cls}`}>{score}</div>
        <div className={`text-sm font-medium mt-1 ${risk.cls}`}>{risk.label} Risk</div>
        <p className="text-xs text-[#64748B] mt-1">{risk.note}</p>
      </div>
    </div>
  );
}

const CALC_COMPONENTS = { bmi: BMICalc, map: MAPCalc, egfr: EGFRCalc, chadsvasc: CHADSVASCCalc };

export default function MedicalCalculators() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState('bmi');

  const filtered = CALCULATORS.filter(c => category === 'All' || c.category === category);
  const ActiveCalc = CALC_COMPONENTS[selected];
  const calcInfo = CALCULATORS.find(c => c.id === selected);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Clinical Tools</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Calculators</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Medical Calculators</h1>
        <p className="text-[#64748B] mt-1 text-sm">Evidence-based clinical decision support tools</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${category === c ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1E40AF]'}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {filtered.map(calc => (
            <button key={calc.id} onClick={() => setSelected(calc.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected === calc.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#1E40AF]'}`}>
              <div className="flex items-center gap-3">
                <calc.icon className={`w-5 h-5 ${selected === calc.id ? 'text-[#1E40AF]' : 'text-[#64748B]'}`} />
                <div>
                  <div className={`font-medium text-sm ${selected === calc.id ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{calc.title}</div>
                  <div className="text-[10px] text-[#94A3B8]">{calc.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 card">
          {calcInfo && (
            <>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                  <calcInfo.icon className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0F172A]">{calcInfo.title}</h2>
                  <p className="text-xs text-[#64748B]">{calcInfo.desc}</p>
                </div>
              </div>
              {ActiveCalc ? (
                <ActiveCalc />
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">This calculator is coming soon</p>
                </div>
              )}
            </>
          )}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Results are for educational and decision-support purposes only. Clinical judgment must always be applied.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
