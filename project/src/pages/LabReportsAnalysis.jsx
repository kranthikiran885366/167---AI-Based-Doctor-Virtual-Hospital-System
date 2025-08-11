import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload,
  FileText,
  Image,
  Download,
  Share,
  Eye,
  EyeOff,
  MousePointer,
  Highlighter,
  Type,
  Circle,
  Square,
  ArrowRight,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Brain,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Edit,
  Archive,
  Star,
  Clock,
  Database
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const LabReportsAnalysis = () => {
  const { user, addMedicalRecord } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [annotationMode, setAnnotationMode] = useState('view');
  const [annotations, setAnnotations] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [annotationText, setAnnotationText] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      annotations: [],
      analysis: null,
      category: determineCategory(file.name),
      patient: user?.name || 'Unknown Patient'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.csv']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const determineCategory = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('blood') || name.includes('cbc') || name.includes('hematology')) return 'Blood Test';
    if (name.includes('xray') || name.includes('x-ray') || name.includes('radiograph')) return 'X-Ray';
    if (name.includes('ct') || name.includes('scan')) return 'CT Scan';
    if (name.includes('mri')) return 'MRI';
    if (name.includes('ultrasound') || name.includes('echo')) return 'Ultrasound';
    if (name.includes('urine')) return 'Urine Test';
    if (name.includes('biopsy')) return 'Biopsy';
    if (name.includes('pathology')) return 'Pathology';
    return 'Other';
  };

  const analyzeReport = async (file) => {
    setIsAnalyzing(true);
    setSelectedFile(file);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockAnalysis = generateMockAnalysis(file);
      
      // Update file with analysis
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, analysis: mockAnalysis } : f
      ));
      
      setAnalysisResults(mockAnalysis);
      
      // Save to medical records
      addMedicalRecord({
        type: 'lab_analysis',
        fileName: file.name,
        category: file.category,
        analysis: mockAnalysis,
        timestamp: new Date().toISOString()
      });

      toast.success('Report analysis completed successfully');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (file) => {
    const category = file.category;
    
    const analysisTemplates = {
      'Blood Test': {
        type: 'Blood Test Analysis',
        findings: [
          { parameter: 'Hemoglobin', value: '11.2 g/dL', normalRange: '12-15 g/dL', status: 'low', severity: 'mild' },
          { parameter: 'WBC Count', value: '12,500/μL', normalRange: '4,000-11,000/μL', status: 'high', severity: 'moderate' },
          { parameter: 'Platelet Count', value: '250,000/μL', normalRange: '150,000-450,000/μL', status: 'normal', severity: 'none' },
          { parameter: 'Blood Glucose', value: '140 mg/dL', normalRange: '70-100 mg/dL', status: 'high', severity: 'mild' }
        ],
        summary: 'Mild anemia with elevated white blood cell count suggesting possible infection. Blood glucose levels are elevated.',
        recommendations: [
          'Consult hematologist for anemia evaluation',
          'Consider iron supplementation',
          'Monitor blood glucose levels',
          'Follow up in 2 weeks',
          'Investigate source of infection'
        ],
        criticalValues: ['WBC Count elevated', 'Hemoglobin low'],
        confidence: 92
      },
      'X-Ray': {
        type: 'X-Ray Analysis',
        findings: [
          { parameter: 'Lung Fields', value: 'Clear bilateral lung fields', normalRange: 'Clear', status: 'normal', severity: 'none' },
          { parameter: 'Heart Size', value: 'Normal cardiac silhouette', normalRange: 'Normal', status: 'normal', severity: 'none' },
          { parameter: 'Bone Structure', value: 'Intact rib cage and spine', normalRange: 'Intact', status: 'normal', severity: 'none' },
          { parameter: 'Soft Tissues', value: 'No obvious abnormalities', normalRange: 'Normal', status: 'normal', severity: 'none' }
        ],
        summary: 'Normal chest X-ray with no acute cardiopulmonary abnormalities detected.',
        recommendations: [
          'No immediate treatment required',
          'Continue regular health monitoring',
          'Maintain healthy lifestyle',
          'Routine follow-up as scheduled'
        ],
        criticalValues: [],
        confidence: 95
      },
      'CT Scan': {
        type: 'CT Scan Analysis',
        findings: [
          { parameter: 'Brain Parenchyma', value: 'No acute hemorrhage or mass', normalRange: 'Normal', status: 'normal', severity: 'none' },
          { parameter: 'Ventricles', value: 'Normal size and configuration', normalRange: 'Normal', status: 'normal', severity: 'none' },
          { parameter: 'Skull', value: 'Intact calvarium', normalRange: 'Intact', status: 'normal', severity: 'none' }
        ],
        summary: 'Normal head CT scan with no evidence of acute intracranial pathology.',
        recommendations: [
          'No immediate intervention required',
          'Correlate with clinical symptoms',
          'Follow up if symptoms persist'
        ],
        criticalValues: [],
        confidence: 98
      }
    };

    return analysisTemplates[category] || analysisTemplates['Blood Test'];
  };

  const addAnnotation = (event) => {
    if (annotationMode === 'view' || !selectedFile) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const annotation = {
      id: Date.now(),
      type: annotationMode,
      x,
      y,
      text: annotationText || 'Annotation',
      timestamp: new Date().toISOString(),
      author: user?.name || 'Doctor'
    };

    const newAnnotations = [...annotations, annotation];
    setAnnotations(newAnnotations);

    // Update file annotations
    setUploadedFiles(prev => prev.map(file => 
      file.id === selectedFile.id 
        ? { ...file, annotations: newAnnotations }
        : file
    ));

    setAnnotationText('');
    toast.success('Annotation added successfully');
  };

  const removeAnnotation = (annotationId) => {
    const newAnnotations = annotations.filter(a => a.id !== annotationId);
    setAnnotations(newAnnotations);

    if (selectedFile) {
      setUploadedFiles(prev => prev.map(file => 
        file.id === selectedFile.id 
          ? { ...file, annotations: newAnnotations }
          : file
      ));
    }
  };

  const selectFile = (file) => {
    setSelectedFile(file);
    setAnnotations(file.annotations || []);
    setAnalysisResults(file.analysis);
    setZoom(1);
    setRotation(0);
    setAnnotationMode('view');
  };

  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setAnnotations([]);
      setAnalysisResults(null);
    }
    toast.success('File deleted successfully');
  };

  const saveReport = () => {
    if (!selectedFile) return;

    const reportData = {
      id: selectedFile.id,
      file: selectedFile,
      annotations,
      analysis: analysisResults,
      savedAt: new Date().toISOString(),
      patient: user?.name || 'Unknown'
    };

    setSavedReports(prev => [...prev, reportData]);
    localStorage.setItem('savedReports', JSON.stringify([...savedReports, reportData]));
    
    addMedicalRecord({
      type: 'saved_report',
      data: reportData,
      timestamp: new Date().toISOString()
    });

    toast.success('Report saved successfully');
  };

  const exportReport = () => {
    if (!selectedFile) return;
    
    const reportData = {
      fileName: selectedFile.name,
      patient: user?.name,
      analysisDate: new Date().toLocaleDateString(),
      analysis: analysisResults,
      annotations: annotations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile.name}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.category === filterType;
    const matchesDate = !selectedDate || file.uploadedAt.includes(selectedDate);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Image className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Lab Reports & Scan Analysis</h1>
              <p className="text-xl text-gray-600">AI-Powered Medical Report Analysis</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - File Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Reports</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop your medical reports here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: PDF, JPG, PNG, TIFF (Max 50MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p className="font-medium mb-2">Supported Report Types:</p>
                <ul className="space-y-1">
                  <li>• Blood Test Reports (CBC, LFT, KFT)</li>
                  <li>• X-Ray and CT Scans</li>
                  <li>• MRI and Ultrasound Images</li>
                  <li>• Pathology Reports</li>
                  <li>• Urine and Other Lab Tests</li>
                </ul>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search & Filter</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Blood Test">Blood Tests</option>
                  <option value="X-Ray">X-Rays</option>
                  <option value="CT Scan">CT Scans</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Urine Test">Urine Tests</option>
                  <option value="Other">Other</option>
                </select>
                
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Uploaded Files ({filteredFiles.length})
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFile?.id === file.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => selectFile(file)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                          <p className="text-sm text-gray-500">{file.category}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          {file.analysis && (
                            <div className="flex items-center space-x-1 mt-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">Analyzed</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        {!file.analysis && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              analyzeReport(file);
                            }}
                            disabled={isAnalyzing}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded text-xs"
                          >
                            <Brain className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Image Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              {selectedFile ? (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowAnnotations(!showAnnotations)}
                        className={`p-2 rounded ${showAnnotations ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {showAnnotations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Annotation Tools */}
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <button
                      onClick={() => setAnnotationMode('view')}
                      className={`px-3 py-1 rounded text-sm ${annotationMode === 'view' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <MousePointer className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => setAnnotationMode('point')}
                      className={`px-3 py-1 rounded text-sm ${annotationMode === 'point' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Circle className="w-4 h-4 inline mr-1" />
                      Point
                    </button>
                    <button
                      onClick={() => setAnnotationMode('highlight')}
                      className={`px-3 py-1 rounded text-sm ${annotationMode === 'highlight' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Highlighter className="w-4 h-4 inline mr-1" />
                      Highlight
                    </button>
                    {annotationMode !== 'view' && (
                      <input
                        type="text"
                        placeholder="Annotation text..."
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  {/* Image Display */}
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 aspect-square">
                    {selectedFile.type.startsWith('image/') ? (
                      <div
                        className="relative w-full h-full cursor-crosshair"
                        onClick={addAnnotation}
                      >
                        <img
                          ref={imageRef}
                          src={selectedFile.url}
                          alt={selectedFile.name}
                          className="w-full h-full object-contain"
                          style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            transition: 'transform 0.2s ease'
                          }}
                        />
                        
                        {/* Annotations Overlay */}
                        {showAnnotations && annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{
                              left: `${annotation.x}%`,
                              top: `${annotation.y}%`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {annotation.text}
                              <button
                                onClick={() => removeAnnotation(annotation.id)}
                                className="ml-2 text-red-300 hover:text-red-100"
                              >
                                <X className="w-3 h-3 inline" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <FileText className="w-16 h-16 mx-auto mb-4" />
                          <p>PDF preview not available</p>
                          <p className="text-sm">Click analyze to process this file</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {!selectedFile.analysis && (
                      <button
                        onClick={() => analyzeReport(selectedFile)}
                        disabled={isAnalyzing}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            <span>Analyze</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={saveReport}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={exportReport}
                      className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No File Selected</h3>
                    <p>Upload and select a file to view and analyze</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              {analysisResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {analysisResults.confidence}% Confidence
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Report Type</h4>
                      <p className="text-blue-600 font-medium">{analysisResults.type}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Findings</h4>
                      <div className="space-y-3">
                        {analysisResults.findings.map((finding, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{finding.parameter}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                finding.status === 'normal' ? 'bg-green-100 text-green-800' :
                                finding.status === 'high' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {finding.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Value: <span className="font-medium">{finding.value}</span></p>
                              <p>Normal Range: <span className="font-medium">{finding.normalRange}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{analysisResults.summary}</p>
                    </div>

                    {analysisResults.criticalValues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Critical Values
                        </h4>
                        <div className="space-y-1">
                          {analysisResults.criticalValues.map((value, index) => (
                            <div key={index} className="text-red-700 bg-red-50 p-2 rounded text-sm">
                              • {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResults.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                    <p>Select a file and click "Analyze" to see AI-powered insights</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportsAnalysis;
