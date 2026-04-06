import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Eye, ZoomIn, ZoomOut, RotateCw, Maximize, Download, Share, AlertTriangle, CheckCircle, Info, Layers, X, FileImage, Sliders, Search, Crosshair } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const ANALYSIS_TYPES = [
  { id: 'skin', label: 'Skin Lesion', icon: Eye, description: 'Analyze skin lesions, moles, rashes' },
  { id: 'wound', label: 'Wound Assessment', icon: AlertTriangle, description: 'Evaluate wounds, burns, healing progress' },
  { id: 'eye', label: 'Eye Examination', icon: Eye, description: 'Assess eye conditions, conjunctiva' },
  { id: 'oral', label: 'Oral Inspection', icon: Search, description: 'Inspect oral cavity, throat' },
];

const SAMPLE_FINDINGS = [
  { severity: 'moderate', finding: 'Irregular border detected', confidence: 87, action: 'Recommend biopsy if no improvement in 4 weeks' },
  { severity: 'low', finding: 'Mild erythema present', confidence: 94, action: 'Topical anti-inflammatory may be helpful' },
  { severity: 'info', finding: 'Lesion diameter approximately 6mm', confidence: 91, action: 'Monitor for size changes' },
];

export default function VisualInspection() {
  const [image, setImage] = useState(null);
  const [analysisType, setAnalysisType] = useState('skin');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [notes, setNotes] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(accepted => {
    if (accepted[0]) {
      const url = URL.createObjectURL(accepted[0]);
      setImage(url);
      setResults(null);
      toast.success('Image uploaded — ready to analyze');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxSize: 10 * 1024 * 1024 });

  const analyze = async () => {
    if (!image) { toast.error('Upload an image first'); return; }
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    setResults({
      type: ANALYSIS_TYPES.find(t => t.id === analysisType)?.label,
      findings: SAMPLE_FINDINGS,
      overallRisk: 'moderate',
      recommendation: 'Clinical correlation recommended. Consider dermatology referral if findings persist.',
      timestamp: new Date().toISOString(),
    });
    setAnalyzing(false);
    toast.success('Visual analysis complete');
  };

  const severityColors = {
    high: 'bg-red-50 border-red-200 text-red-700',
    moderate: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Diagnostics</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Visual AI</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Visual Inspection</h1>
        <p className="text-[#64748B] mt-1 text-sm">AI-powered visual analysis of clinical images and findings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Analysis Type Selection */}
          <div className="card">
            <div className="section-label mb-3">Analysis Type</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ANALYSIS_TYPES.map(type => (
                <button key={type.id} onClick={() => setAnalysisType(type.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${analysisType === type.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#1E40AF]'}`}>
                  <type.icon className={`w-4 h-4 mb-1.5 ${analysisType === type.id ? 'text-[#1E40AF]' : 'text-[#64748B]'}`} />
                  <div className={`text-xs font-medium ${analysisType === type.id ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{type.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload / Display */}
          {!image ? (
            <div {...getRootProps()} className={`card border-2 border-dashed min-h-[300px] flex items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#CBD5E1] hover:border-[#1E40AF]'}`}>
              <input {...getInputProps()} />
              <div>
                <FileImage className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-[#1E40AF]' : 'text-[#94A3B8]'}`} />
                <h3 className="font-semibold text-[#0F172A] mb-2">Upload Clinical Image</h3>
                <p className="text-sm text-[#64748B] mb-4">Drag & drop or click to upload<br />JPG, PNG, HEIC · Max 10MB</p>
                <div className="flex gap-3 justify-center">
                  <button className="btn-primary text-sm">Browse Files</button>
                  <button onClick={e => { e.stopPropagation(); toast.info('Camera access...'); }} className="btn-secondary text-sm flex items-center gap-1"><Camera className="w-3.5 h-3.5" />Use Camera</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="relative bg-[#0F172A] flex items-center justify-center" style={{ minHeight: '300px' }}>
                <img src={image} alt="Clinical" className="max-h-80 object-contain transition-transform duration-200" style={{ transform: `scale(${zoom}) rotate(0deg)` }} />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <div className="text-sm font-medium">Analyzing image...</div>
                    </div>
                  </div>
                )}
                {/* Toolbar */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/40 backdrop-blur-sm"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/40 backdrop-blur-sm"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => setZoom(1)} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/40 backdrop-blur-sm"><Maximize className="w-4 h-4" /></button>
                  <button onClick={() => { setImage(null); setResults(null); }} className="p-1.5 bg-red-500/70 text-white rounded-lg hover:bg-red-500 backdrop-blur-sm"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4 flex gap-2 border-t border-[#E2E8F0]">
                <button onClick={analyze} disabled={analyzing} className="btn-primary flex items-center gap-2 disabled:opacity-40">
                  <Eye className="w-4 h-4" />{analyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
                <button onClick={() => { setImage(null); setResults(null); }} className="btn-secondary">Upload New</button>
                <button onClick={() => toast.info('Downloading...')} className="btn-secondary ml-auto flex items-center gap-2"><Download className="w-4 h-4" />Save</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!results ? (
            <>
              <div className="card">
                <div className="section-label mb-3">Clinical Notes</div>
                <textarea className="input h-32 resize-none text-sm" placeholder="Add clinical observations, context, patient history..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-blue-800 mb-1">AI Visual Analysis</div>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Analyzes clinical images for diagnostic patterns</li>
                      <li>• Identifies lesion characteristics and measurements</li>
                      <li>• Provides evidence-based recommendations</li>
                      <li>• Always verify findings clinically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#0F172A]">Analysis Results</h2>
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${results.overallRisk === 'high' ? 'bg-red-100 text-red-700 border-red-200' : results.overallRisk === 'moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'}`}>{results.overallRisk} risk</span>
                </div>
                <div className="space-y-2 mb-4">
                  {results.findings.map((finding, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${severityColors[finding.severity]}`}>
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-medium">{finding.finding}</div>
                        <span className="text-[10px] ml-2 flex-shrink-0">{finding.confidence}%</span>
                      </div>
                      <div className="text-xs mt-1 opacity-80">{finding.action}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="text-xs font-medium text-[#0F172A] mb-1">Clinical Recommendation</div>
                  <p className="text-xs text-[#64748B]">{results.recommendation}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.info('Saving report...')} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5" />Save Report</button>
                <button onClick={() => setResults(null)} className="btn-secondary text-sm px-3">Reset</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
