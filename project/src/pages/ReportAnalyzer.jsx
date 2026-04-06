import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Upload, Search, AlertTriangle, CheckCircle, Info, Brain, Activity, TrendingUp, TrendingDown, Minus, Zap, Download, Share, FileText, X, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const SAMPLE_ANALYSIS = {
  reportType: 'Comprehensive Blood Panel',
  patient: 'John Smith',
  date: '2026-04-07',
  overallScore: 78,
  risk: 'moderate',
  summary: 'Blood panel shows predominantly normal values with mild dyslipidemia. Fasting glucose slightly elevated. Overall metabolic health is moderate. Lifestyle modifications recommended.',
  categories: [
    { name: 'Hematology', score: 95, status: 'Excellent', icon: Activity },
    { name: 'Metabolic', score: 72, status: 'Moderate', icon: TrendingUp },
    { name: 'Lipids', score: 65, status: 'Needs Attention', icon: TrendingDown },
    { name: 'Kidney Function', score: 88, status: 'Good', icon: CheckCircle },
    { name: 'Liver Function', score: 91, status: 'Excellent', icon: CheckCircle },
    { name: 'Thyroid', score: 82, status: 'Good', icon: CheckCircle },
  ],
  findings: [
    { parameter: 'Hemoglobin', value: '14.2 g/dL', reference: '12.0-17.5', status: 'normal', trend: 'stable', interpretation: 'Within normal range. No anemia detected.' },
    { parameter: 'WBC Count', value: '7.8 K/µL', reference: '4.5-11.0', status: 'normal', trend: 'stable', interpretation: 'Normal immune response. No infection markers.' },
    { parameter: 'Platelet Count', value: '265 K/µL', reference: '150-400', status: 'normal', trend: 'stable', interpretation: 'Normal clotting function.' },
    { parameter: 'Fasting Glucose', value: '108 mg/dL', reference: '70-100', status: 'borderline', trend: 'up', interpretation: 'Slightly elevated. Prediabetes range. Dietary modification recommended.' },
    { parameter: 'HbA1c', value: '5.9%', reference: '<5.7%', status: 'borderline', trend: 'up', interpretation: 'Borderline prediabetes range. Monitor closely.' },
    { parameter: 'Total Cholesterol', value: '218 mg/dL', reference: '<200', status: 'high', trend: 'up', interpretation: 'Mildly elevated. Dietary changes and possible statin therapy.' },
    { parameter: 'LDL Cholesterol', value: '135 mg/dL', reference: '<100', status: 'high', trend: 'up', interpretation: 'Above optimal. Consider cardiovascular risk assessment.' },
    { parameter: 'HDL Cholesterol', value: '48 mg/dL', reference: '>60', status: 'low', trend: 'down', interpretation: 'Below optimal. Exercise and omega-3 may help.' },
    { parameter: 'Creatinine', value: '0.95 mg/dL', reference: '0.74-1.35', status: 'normal', trend: 'stable', interpretation: 'Normal kidney filtration function.' },
    { parameter: 'ALT', value: '28 U/L', reference: '7-40', status: 'normal', trend: 'stable', interpretation: 'Normal liver enzyme. No hepatotoxicity detected.' },
  ],
  recommendations: [
    { priority: 'high', text: 'Schedule dietitian consultation for lipid management', category: 'Lifestyle' },
    { priority: 'high', text: 'Monitor blood glucose every 3 months — prediabetes risk', category: 'Monitoring' },
    { priority: 'medium', text: 'Increase aerobic exercise to 150min/week to raise HDL', category: 'Lifestyle' },
    { priority: 'medium', text: 'Reduce saturated fat intake — Mediterranean diet recommended', category: 'Nutrition' },
    { priority: 'low', text: 'Consider fish oil supplementation for triglycerides', category: 'Supplements' },
    { priority: 'low', text: 'Repeat lipid panel in 3 months after lifestyle changes', category: 'Monitoring' },
  ],
};

const STATUS_COLORS = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  borderline: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  low: 'bg-amber-100 text-amber-700 border-amber-200',
};

const PRIORITY_COLORS = {
  high: 'bg-red-50 border-red-200',
  medium: 'bg-amber-50 border-amber-200',
  low: 'bg-green-50 border-green-200',
};

export default function ReportAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [tab, setTab] = useState('upload');

  const onDrop = useCallback(accepted => {
    if (accepted[0]) { setUploaded(true); toast.success('Report uploaded'); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [], 'application/pdf': [] } });

  const runAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 3000));
    setAnalysis(SAMPLE_ANALYSIS);
    setAnalyzing(false);
    setTab('results');
    toast.success('AI analysis complete');
  };

  const tabs = [
    { id: 'upload', label: 'Upload Report' },
    { id: 'results', label: 'AI Analysis', disabled: !analysis },
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-amber-500" />;
    return <Minus className="w-3 h-3 text-[#94A3B8]" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">AI Tools</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Report Analysis</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Report Analyzer</h1>
        <p className="text-[#64748B] mt-1 text-sm">AI-powered comprehensive analysis of medical reports and lab results</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => !t.disabled && setTab(t.id)} disabled={t.disabled}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'} ${t.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#1E40AF] bg-[#EFF6FF]' : uploaded ? 'border-green-400 bg-green-50' : 'border-[#CBD5E1] hover:border-[#1E40AF] hover:bg-[#F8FAFF]'}`}>
              <input {...getInputProps()} />
              {uploaded ? (
                <>
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-[#0F172A] text-lg mb-2">Report Uploaded</h3>
                  <p className="text-sm text-[#64748B] mb-6">Ready for AI analysis</p>
                  <button onClick={e => { e.stopPropagation(); runAnalysis(); }} disabled={analyzing}
                    className="btn-primary flex items-center gap-2 mx-auto px-8 py-3 disabled:opacity-50">
                    {analyzing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</> : <><Brain className="w-4 h-4" />Run AI Analysis</>}
                  </button>
                  <button onClick={e => { e.stopPropagation(); setUploaded(false); }} className="block mx-auto mt-3 text-xs text-[#94A3B8] hover:text-[#64748B]">Upload different file</button>
                </>
              ) : (
                <>
                  <BarChart3 className="w-14 h-14 text-[#94A3B8] mx-auto mb-4" />
                  <h3 className="font-semibold text-[#0F172A] text-lg mb-2">{isDragActive ? 'Drop your report here' : 'Upload Medical Report'}</h3>
                  <p className="text-sm text-[#64748B] mb-2">Drag & drop or click to browse</p>
                  <p className="text-xs text-[#94A3B8] mb-6">Supports PDF, JPG, PNG — Max 20MB</p>
                  <button className="btn-primary mx-auto"><Upload className="w-4 h-4 inline mr-2" />Browse Files</button>
                </>
              )}
            </div>

            <div className="mt-6 card bg-[#EFF6FF] border-blue-200">
              <div className="flex gap-3 items-start">
                <Brain className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#1E40AF] text-sm mb-1">AI Analysis Capabilities</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-[#374151]">
                    {['Parameter interpretation', 'Trend analysis', 'Risk stratification', 'Clinical recommendations', 'Reference range comparison', 'Pattern recognition'].map(c => (
                      <div key={c} className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'results' && analysis && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="text-sm text-[#64748B]">{analysis.patient} · {analysis.date} · {analysis.reportType}</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${analysis.risk === 'moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' : analysis.risk === 'high' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />{analysis.risk} risk
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFF6FF] rounded-lg border border-blue-200 text-sm text-[#1E40AF] font-medium">
                    Health Score: {analysis.overallScore}/100
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.info('Downloading...')} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
                <button onClick={() => toast.info('Sharing...')} className="btn-secondary flex items-center gap-2"><Share className="w-4 h-4" />Share</button>
              </div>
            </div>

            {/* Summary */}
            <div className="card mb-6">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#0F172A] mb-1">AI Summary</div>
                  <p className="text-sm text-[#374151]">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="card mb-6">
              <h2 className="font-semibold text-[#0F172A] mb-4">Category Scores</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.categories.map((cat, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <cat.icon className="w-4 h-4 text-[#1E40AF]" />
                      <span className="text-sm font-medium text-[#0F172A]">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cat.score}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${cat.score >= 80 ? 'text-green-600' : cat.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{cat.score}</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">{cat.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings Table */}
            <div className="card mb-6 p-0 overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0]"><h2 className="font-semibold text-[#0F172A]">Detailed Findings</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-[#F8FAFC] text-left"><th className="px-4 py-3 text-xs font-medium text-[#64748B]">Parameter</th><th className="px-4 py-3 text-xs font-medium text-[#64748B]">Value</th><th className="px-4 py-3 text-xs font-medium text-[#64748B]">Reference</th><th className="px-4 py-3 text-xs font-medium text-[#64748B]">Status</th><th className="px-4 py-3 text-xs font-medium text-[#64748B]">Interpretation</th></tr></thead>
                  <tbody>
                    {analysis.findings.map((f, i) => (
                      <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">{f.parameter}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#0F172A]">{f.value}</span>
                            {getTrendIcon(f.trend)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#64748B]">{f.reference}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize ${STATUS_COLORS[f.status]}`}>{f.status}</span></td>
                        <td className="px-4 py-3 text-xs text-[#64748B] max-w-xs">{f.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">AI Recommendations</h2>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${PRIORITY_COLORS[rec.priority]}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <div className="flex-1 text-sm text-[#374151]">{rec.text}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{rec.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
