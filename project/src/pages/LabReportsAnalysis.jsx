import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Search, Filter, Download, Eye, Trash2, ZoomIn, ZoomOut, RotateCw, Save, Share, AlertTriangle, CheckCircle, Clock, X, Plus, Star, Archive, Database, Activity } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const SAMPLE_REPORTS = [
  { id: 1, name: 'CBC_Report_Jan2024.pdf', type: 'Blood Work', date: '2024-01-15', patient: 'John Smith', status: 'analyzed', category: 'hematology', size: '245 KB', result: 'normal', summary: 'All values within normal range. Hemoglobin 14.2 g/dL, WBC 7.2K/µL.' },
  { id: 2, name: 'Chest_Xray_Dec2023.jpg', type: 'Radiology', date: '2023-12-20', patient: 'Maria Garcia', status: 'analyzed', category: 'imaging', size: '1.2 MB', result: 'abnormal', summary: 'Mild cardiomegaly noted. No acute infiltrates. Follow-up recommended.' },
  { id: 3, name: 'Lipid_Panel_Nov2023.pdf', type: 'Biochemistry', date: '2023-11-10', patient: 'Robert Chen', status: 'pending', category: 'biochemistry', size: '180 KB', result: 'pending', summary: 'Analysis in progress...' },
];

const ANALYSIS_TEMPLATES = {
  'blood': {
    title: 'Hematology Analysis',
    parameters: [
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normal: '12-17', status: 'normal' },
      { name: 'WBC Count', value: '7.2', unit: 'K/µL', normal: '4-11', status: 'normal' },
      { name: 'Platelets', value: '250', unit: 'K/µL', normal: '150-400', status: 'normal' },
      { name: 'Hematocrit', value: '42', unit: '%', normal: '36-52', status: 'normal' },
      { name: 'MCV', value: '88', unit: 'fL', normal: '80-100', status: 'normal' },
      { name: 'Neutrophils', value: '68', unit: '%', normal: '50-70', status: 'normal' },
    ],
  },
  'default': {
    title: 'General Lab Analysis',
    parameters: [
      { name: 'Glucose (Fasting)', value: '95', unit: 'mg/dL', normal: '70-100', status: 'normal' },
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', normal: '<200', status: 'borderline' },
      { name: 'LDL', value: '128', unit: 'mg/dL', normal: '<100', status: 'high' },
      { name: 'HDL', value: '52', unit: 'mg/dL', normal: '>60', status: 'low' },
      { name: 'Triglycerides', value: '145', unit: 'mg/dL', normal: '<150', status: 'normal' },
      { name: 'Creatinine', value: '0.9', unit: 'mg/dL', normal: '0.7-1.3', status: 'normal' },
    ],
  },
};

const STATUS_COLORS = { normal: 'text-green-700 bg-green-50 border-green-200', high: 'text-red-700 bg-red-50 border-red-200', low: 'text-amber-700 bg-amber-50 border-amber-200', borderline: 'text-amber-700 bg-amber-50 border-amber-200' };

export default function LabReportsAnalysis() {
  const { user, addMedicalRecord } = useUser();
  const [files, setFiles] = useState(SAMPLE_REPORTS);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [tab, setTab] = useState('reports');
  const [zoom, setZoom] = useState(1);

  const onDrop = useCallback(accepted => {
    const newFiles = accepted.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.includes('image') ? 'Radiology' : 'Lab Report',
      date: new Date().toLocaleDateString(),
      patient: user?.name || 'Current Patient',
      status: 'pending',
      category: file.name.toLowerCase().includes('blood') || file.name.toLowerCase().includes('cbc') ? 'hematology' : 'general',
      size: (file.size / 1024).toFixed(0) + ' KB',
      result: 'pending',
      summary: 'Awaiting analysis',
      url: URL.createObjectURL(file),
    }));
    setFiles(prev => [...newFiles, ...prev]);
    toast.success(`${accepted.length} file(s) uploaded`);
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
  });

  const analyze = async (file) => {
    setSelected(file);
    setAnalyzing(true);
    setAnalysis(null);
    await new Promise(r => setTimeout(r, 2000));
    const template = file.category === 'hematology' ? ANALYSIS_TEMPLATES['blood'] : ANALYSIS_TEMPLATES['default'];
    setAnalysis({ ...template, analyzedAt: new Date().toISOString(), confidence: 94, fileId: file.id });
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'analyzed' } : f));
    setAnalyzing(false);
    setTab('analysis');
    toast.success('Analysis complete');
    addMedicalRecord({ type: 'lab_report', fileName: file.name, analysis: template });
  };

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.patient.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || f.type.toLowerCase().includes(filterType.toLowerCase()) || f.status === filterType;
    return matchSearch && matchType;
  });

  const tabs = [
    { id: 'upload', label: 'Upload' },
    { id: 'reports', label: 'Reports', count: files.length },
    { id: 'analysis', label: 'Analysis', disabled: !analysis },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Diagnostics</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Lab Reports</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Lab Reports & Analysis</h1>
        <p className="text-[#64748B] mt-1 text-sm">Upload, view, and AI-analyze diagnostic reports and imaging</p>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => !t.disabled && setTab(t.id)} disabled={t.disabled}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            } ${t.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
            {t.label}
            {t.count !== undefined && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* UPLOAD TAB */}
        {tab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#CBD5E1] hover:border-[#1E40AF] hover:bg-[#F8FAFF]'}`}>
              <input {...getInputProps()} />
              <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragActive ? 'text-[#1E40AF]' : 'text-[#94A3B8]'}`} />
              <h3 className="font-semibold text-[#0F172A] mb-2">{isDragActive ? 'Drop files here' : 'Upload Lab Reports'}</h3>
              <p className="text-sm text-[#64748B] mb-4">Drag & drop or click to upload PDF, JPEG, PNG files<br/>Max file size: 20MB</p>
              <button className="btn-primary">Browse Files</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: FileText, title: 'Blood Work', desc: 'CBC, metabolic panels, lipids', color: 'bg-blue-50 text-[#1E40AF]' },
                { icon: Activity, title: 'Imaging Reports', desc: 'X-ray, MRI, CT, ultrasound', color: 'bg-purple-50 text-purple-600' },
                { icon: Database, title: 'Pathology', desc: 'Biopsy, culture, cytology', color: 'bg-green-50 text-green-600' },
              ].map((item, i) => (
                <div key={i} className="card text-center">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="font-medium text-[#0F172A] text-sm">{item.title}</div>
                  <div className="text-xs text-[#64748B] mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REPORTS TAB */}
        {tab === 'reports' && (
          <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input w-auto" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Blood">Blood Work</option>
                <option value="Radiology">Radiology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="analyzed">Analyzed</option>
                <option value="pending">Pending</option>
              </select>
              <button onClick={() => setTab('upload')} className="btn-secondary flex items-center gap-2">
                <Upload className="w-4 h-4" />Upload
              </button>
            </div>

            <div className="space-y-3">
              {filtered.map(file => (
                <div key={file.id} className={`card hover:border-[#1E40AF] transition-colors cursor-pointer ${selected?.id === file.id ? 'border-[#1E40AF]' : ''}`}
                  onClick={() => setSelected(file)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      file.type === 'Radiology' ? 'bg-purple-100' : file.type === 'Blood Work' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${file.type === 'Radiology' ? 'text-purple-600' : file.type === 'Blood Work' ? 'text-[#1E40AF]' : 'text-green-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#0F172A] text-sm truncate">{file.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                          file.result === 'normal' ? 'bg-green-50 text-green-700 border-green-200' :
                          file.result === 'abnormal' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>{file.result}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-[#94A3B8]">{file.patient}</span>
                        <span className="text-xs text-[#94A3B8]">{file.date}</span>
                        <span className="text-xs text-[#94A3B8]">{file.size}</span>
                        <span className="text-xs text-[#94A3B8]">{file.type}</span>
                      </div>
                      {file.summary && file.status === 'analyzed' && (
                        <p className="text-xs text-[#64748B] mt-1 truncate">{file.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${file.status === 'analyzed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{file.status}</span>
                      <button onClick={e => { e.stopPropagation(); analyze(file); }} className="btn-primary text-xs py-1.5 px-3">
                        {analyzing && selected?.id === file.id ? 'Analyzing...' : file.status === 'analyzed' ? 'Re-analyze' : 'Analyze'}
                      </button>
                      <button onClick={e => { e.stopPropagation(); toast.info('Downloading...'); }} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter(f => f.id !== file.id)); if (selected?.id === file.id) setSelected(null); }} className="p-1.5 text-[#64748B] hover:text-red-500 border border-[#E2E8F0] rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="card text-center py-12">
                  <FileText className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-[#64748B] font-medium">No reports found</p>
                  <button onClick={() => setTab('upload')} className="btn-secondary mt-4 text-sm">Upload a Report</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ANALYSIS TAB */}
        {tab === 'analysis' && analysis && (
          <motion.div key="analysis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Analysis Complete · {analysis.confidence}% confidence</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.info('Downloading report...')} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Download</button>
                <button onClick={() => toast.info('Sharing report...')} className="btn-secondary flex items-center gap-2"><Share className="w-4 h-4" />Share</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-4">{analysis.title}</h2>
                  <div className="space-y-3">
                    {analysis.parameters.map((param, i) => {
                      const statusCls = STATUS_COLORS[param.status] || 'text-gray-700 bg-gray-50 border-gray-200';
                      return (
                        <div key={i} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                          <div>
                            <div className="font-medium text-[#0F172A] text-sm">{param.name}</div>
                            <div className="text-xs text-[#94A3B8]">Normal: {param.normal} {param.unit}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-[#0F172A]">{param.value}</div>
                              <div className="text-xs text-[#64748B]">{param.unit}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded border text-xs font-medium capitalize ${statusCls}`}>{param.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <h2 className="font-semibold text-[#0F172A] mb-3">Summary</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-[#374151]">{analysis.parameters.filter(p => p.status === 'normal').length} values normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-xs text-[#374151]">{analysis.parameters.filter(p => p.status === 'borderline' || p.status === 'low').length} values borderline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-xs text-[#374151]">{analysis.parameters.filter(p => p.status === 'high').length} values elevated</span>
                    </div>
                  </div>
                </div>

                <div className="card bg-blue-50 border-blue-200">
                  <div className="section-label text-blue-600 mb-2">Recommendations</div>
                  <ul className="space-y-1">
                    {analysis.parameters.filter(p => p.status !== 'normal').length > 0 ? (
                      <>
                        <li className="text-xs text-blue-800">• Follow up on abnormal values within 2 weeks</li>
                        <li className="text-xs text-blue-800">• Consider dietary modifications for lipid values</li>
                        <li className="text-xs text-blue-800">• Recheck lipid panel in 3 months</li>
                      </>
                    ) : (
                      <li className="text-xs text-blue-800">• All values within normal range — routine follow-up</li>
                    )}
                  </ul>
                </div>

                <div className="card">
                  <div className="text-xs text-[#64748B]">Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}</div>
                  {selected && <div className="text-xs text-[#64748B] mt-1">File: {selected.name}</div>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading overlay */}
        {analyzing && tab !== 'analysis' && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-xl text-center">
              <div className="w-10 h-10 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="font-semibold text-[#0F172A]">Analyzing Report</div>
              <div className="text-sm text-[#64748B] mt-1">AI processing your lab report...</div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
