import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope,
  Camera,
  Upload,
  FileImage,
  MousePointer,
  Highlighter,
  Eye,
  EyeOff,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Brain,
  Pill,
  Search,
  Plus,
  X,
  Check,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Download,
  Share,
  Save,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Bluetooth,
  Wifi,
  Smartphone,
  Watch,
  Monitor,
  Settings,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Info,
  BookOpen,
  Link,
  Edit3,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Filter,
  Calendar as CalendarIcon,
  Clipboard,
  Database,
  Send,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';

const ExaminationDiagnosis = ({ patient, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [medicalHistory, setMedicalHistory] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    familyHistory: '',
    socialHistory: '',
    allergies: '',
    medications: '',
    reviewOfSystems: {}
  });

  // Image annotation state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [annotationMode, setAnnotationMode] = useState('view'); // view, annotate, highlight
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  // AI Diagnosis state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [verifiedDiagnoses, setVerifiedDiagnoses] = useState([]);
  const [diagnosisConfidence, setDiagnosisConfidence] = useState(0);

  // Visual inspection state
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [inspectionType, setInspectionType] = useState('skin'); // skin, eye, wound

  // Physical tests state
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({});
  const [testResults, setTestResults] = useState({});

  // Investigations state
  const [orderedInvestigations, setOrderedInvestigations] = useState([]);
  const [investigationTemplates, setInvestigationTemplates] = useState([]);

  // Wearable integration state
  const [wearableData, setWearableData] = useState({});
  const [deviceStatus, setDeviceStatus] = useState('disconnected');

  // ICD-10 and SNOMED state
  const [selectedCodes, setSelectedCodes] = useState({
    icd10: [],
    snomed: []
  });
  const [codeSearch, setCodeSearch] = useState('');

  const imageCanvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Medical history questions template
  const historyQuestions = {
    cardiovascular: [
      'Do you experience chest pain or discomfort?',
      'Have you noticed shortness of breath?',
      'Do you have any heart palpitations?',
      'Any history of high blood pressure?'
    ],
    respiratory: [
      'Do you have any breathing difficulties?',
      'Any persistent cough?',
      'Do you experience wheezing?',
      'Any history of asthma or lung disease?'
    ],
    neurological: [
      'Do you experience headaches?',
      'Any dizziness or fainting spells?',
      'Numbness or tingling in extremities?',
      'Any seizure history?'
    ],
    gastrointestinal: [
      'Any abdominal pain or discomfort?',
      'Changes in bowel habits?',
      'Nausea or vomiting?',
      'Any acid reflux or heartburn?'
    ]
  };

  // ICD-10 and SNOMED codes database
  const medicalCodes = {
    icd10: [
      { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
      { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
      { code: 'I10', description: 'Essential (primary) hypertension' },
      { code: 'M79.3', description: 'Panniculitis, unspecified' },
      { code: 'R06.02', description: 'Shortness of breath' },
      { code: 'R51', description: 'Headache' },
      { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
      { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
      { code: 'M25.50', description: 'Pain in unspecified joint' }
    ],
    snomed: [
      { code: '38341003', description: 'Hypertensive disorder' },
      { code: '44054006', description: 'Diabetes mellitus type 2' },
      { code: '22298006', description: 'Myocardial infarction' },
      { code: '195967001', description: 'Asthma' },
      { code: '367494008', description: 'Acute kidney injury' },
      { code: '386689009', description: 'Pneumonia' },
      { code: '74400008', description: 'Appendicitis' },
      { code: '39104002', description: 'Ileus' },
      { code: '230690007', description: 'Stroke' },
      { code: '271594007', description: 'Syncope' }
    ]
  };

  // Connected devices simulation
  const availableDevices = [
    { id: 'bp_monitor', name: 'Blood Pressure Monitor', type: 'vital', status: 'connected', icon: Heart },
    { id: 'pulse_ox', name: 'Pulse Oximeter', type: 'vital', status: 'connected', icon: Activity },
    { id: 'glucometer', name: 'Glucometer', type: 'test', status: 'disconnected', icon: Droplets },
    { id: 'thermometer', name: 'Digital Thermometer', type: 'vital', status: 'connected', icon: Thermometer },
    { id: 'ecg', name: 'ECG Monitor', type: 'test', status: 'disconnected', icon: Monitor },
    { id: 'scale', name: 'Digital Scale', type: 'vital', status: 'connected', icon: TrendingUp }
  ];

  // Investigation templates
  const investigationOptions = [
    { 
      category: 'Radiology',
      items: [
        { name: 'Chest X-Ray', code: 'CXR', urgency: 'routine', department: 'Radiology' },
        { name: 'CT Scan Head', code: 'CT-HEAD', urgency: 'urgent', department: 'Radiology' },
        { name: 'MRI Brain', code: 'MRI-BRAIN', urgency: 'routine', department: 'Radiology' },
        { name: 'Ultrasound Abdomen', code: 'US-ABD', urgency: 'routine', department: 'Radiology' },
        { name: 'ECHO Cardiogram', code: 'ECHO', urgency: 'urgent', department: 'Cardiology' }
      ]
    },
    {
      category: 'Laboratory',
      items: [
        { name: 'Complete Blood Count', code: 'CBC', urgency: 'routine', department: 'Lab' },
        { name: 'Comprehensive Metabolic Panel', code: 'CMP', urgency: 'routine', department: 'Lab' },
        { name: 'Lipid Panel', code: 'LIPID', urgency: 'routine', department: 'Lab' },
        { name: 'Thyroid Function Tests', code: 'TFT', urgency: 'routine', department: 'Lab' },
        { name: 'Cardiac Enzymes', code: 'CARDIAC-ENZ', urgency: 'stat', department: 'Lab' },
        { name: 'Urine Analysis', code: 'UA', urgency: 'routine', department: 'Lab' }
      ]
    },
    {
      category: 'Cardiology',
      items: [
        { name: 'ECG 12-Lead', code: 'ECG-12', urgency: 'stat', department: 'Cardiology' },
        { name: 'Stress Test', code: 'STRESS', urgency: 'routine', department: 'Cardiology' },
        { name: 'Holter Monitor', code: 'HOLTER', urgency: 'routine', department: 'Cardiology' }
      ]
    }
  ];

  // Tabs configuration
  const tabs = [
    { id: 'history', name: 'Medical History', icon: Clipboard },
    { id: 'reports', name: 'Reports & Scans', icon: FileImage },
    { id: 'inspection', name: 'Visual Inspection', icon: Eye },
    { id: 'tests', name: 'Physical Tests', icon: Activity },
    { id: 'investigations', name: 'Investigations', icon: Search },
    { id: 'vitals', name: 'Wearable Data', icon: Watch },
    { id: 'diagnosis', name: 'AI Diagnosis', icon: Brain },
    { id: 'codes', name: 'Medical Codes', icon: Database }
  ];

  useEffect(() => {
    // Simulate AI analysis when medical history changes
    if (medicalHistory.chiefComplaint || medicalHistory.historyOfPresentIllness) {
      generateAISuggestions();
    }
  }, [medicalHistory.chiefComplaint, medicalHistory.historyOfPresentIllness]);

  useEffect(() => {
    // Simulate wearable data updates
    const interval = setInterval(() => {
      if (deviceStatus === 'connected') {
        updateWearableData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceStatus]);

  const generateAISuggestions = () => {
    const symptoms = (medicalHistory.chiefComplaint + ' ' + medicalHistory.historyOfPresentIllness).toLowerCase();
    const suggestions = [];

    if (symptoms.includes('chest pain') || symptoms.includes('shortness of breath')) {
      suggestions.push({
        diagnosis: 'Acute Coronary Syndrome',
        confidence: 85,
        reasoning: 'Chest pain with associated symptoms suggests cardiac evaluation needed',
        urgency: 'high',
        recommendations: ['Order ECG', 'Cardiac enzymes', 'Chest X-ray']
      });
    }

    if (symptoms.includes('headache') || symptoms.includes('dizziness')) {
      suggestions.push({
        diagnosis: 'Tension Headache vs. Migraine',
        confidence: 72,
        reasoning: 'Headache pattern suggests primary headache disorder',
        urgency: 'low',
        recommendations: ['Neurological examination', 'Consider CT if red flags present']
      });
    }

    if (symptoms.includes('fever') || symptoms.includes('cough')) {
      suggestions.push({
        diagnosis: 'Upper Respiratory Infection',
        confidence: 78,
        reasoning: 'Fever and cough pattern consistent with viral syndrome',
        urgency: 'low',
        recommendations: ['Complete physical examination', 'Consider chest X-ray if indicated']
      });
    }

    setAiSuggestions(suggestions);
    if (suggestions.length > 0) {
      setDiagnosisConfidence(Math.max(...suggestions.map(s => s.confidence)));
    }
  };

  const handleHistoryChange = (field, value) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      annotations: []
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    toast.success(`${files.length} image(s) uploaded successfully`);
  };

  const startAnnotation = (image) => {
    setSelectedImage(image);
    setAnnotationMode('annotate');
  };

  const addAnnotation = (x, y, type, description) => {
    const annotation = {
      id: Date.now(),
      x,
      y,
      type, // highlight, arrow, text
      description,
      createdAt: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, annotation]);
    
    // Update image annotations
    setUploadedImages(prev => prev.map(img => 
      img.id === selectedImage.id 
        ? { ...img, annotations: [...(img.annotations || []), annotation] }
        : img
    ));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        toast.success('Camera activated for visual inspection');
      }
    } catch (error) {
      toast.error('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      toast.info('Camera deactivated');
    }
  };

  const captureImage = () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const capturedImage = {
        id: Date.now(),
        type: inspectionType,
        dataUrl: canvas.toDataURL('image/jpeg'),
        capturedAt: new Date().toISOString(),
        analysis: `${inspectionType} inspection captured`
      };

      setCapturedImages(prev => [...prev, capturedImage]);
      toast.success(`${inspectionType} inspection image captured`);
    }
  };

  const connectDevice = (deviceId) => {
    setConnectedDevices(prev => {
      if (prev.includes(deviceId)) {
        toast.info('Device disconnected');
        return prev.filter(id => id !== deviceId);
      } else {
        toast.success('Device connected successfully');
        return [...prev, deviceId];
      }
    });
  };

  const simulateVitalReading = (deviceId) => {
    const readings = {
      bp_monitor: { systolic: 120 + Math.floor(Math.random() * 40), diastolic: 80 + Math.floor(Math.random() * 20) },
      pulse_ox: { spo2: 95 + Math.floor(Math.random() * 5), heartRate: 60 + Math.floor(Math.random() * 40) },
      glucometer: { glucose: 80 + Math.floor(Math.random() * 120) },
      thermometer: { temperature: 97.0 + Math.random() * 4 },
      scale: { weight: 120 + Math.floor(Math.random() * 100) }
    };

    const reading = readings[deviceId];
    if (reading) {
      setVitalSigns(prev => ({
        ...prev,
        [deviceId]: {
          ...reading,
          timestamp: new Date().toISOString()
        }
      }));
      toast.success('Vital signs reading taken');
    }
  };

  const orderInvestigation = (investigation) => {
    const order = {
      id: Date.now(),
      ...investigation,
      orderedAt: new Date().toISOString(),
      orderedBy: 'Dr. Current User',
      status: 'ordered',
      priority: investigation.urgency
    };

    setOrderedInvestigations(prev => [...prev, order]);
    toast.success(`${investigation.name} ordered successfully`);
  };

  const updateWearableData = () => {
    const newData = {
      steps: 8000 + Math.floor(Math.random() * 4000),
      heartRate: 60 + Math.floor(Math.random() * 40),
      calories: 1800 + Math.floor(Math.random() * 600),
      activeMinutes: 30 + Math.floor(Math.random() * 60),
      sleepHours: 6.5 + Math.random() * 2,
      lastSync: new Date().toISOString()
    };

    setWearableData(newData);
  };

  const connectWearable = () => {
    setDeviceStatus('connecting');
    toast.info('Connecting to wearable device...');

    setTimeout(() => {
      setDeviceStatus('connected');
      updateWearableData();
      toast.success('Wearable device connected successfully');
    }, 2000);
  };

  const addMedicalCode = (type, code) => {
    setSelectedCodes(prev => ({
      ...prev,
      [type]: prev[type].find(c => c.code === code.code) 
        ? prev[type] 
        : [...prev[type], code]
    }));
    toast.success(`${type.toUpperCase()} code added`);
  };

  const removeMedicalCode = (type, codeToRemove) => {
    setSelectedCodes(prev => ({
      ...prev,
      [type]: prev[type].filter(code => code.code !== codeToRemove.code)
    }));
  };

  const verifyDiagnosis = (suggestion) => {
    setVerifiedDiagnoses(prev => [...prev, {
      ...suggestion,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Dr. Current User'
    }]);
    toast.success('Diagnosis verified and added');
  };

  const saveExamination = () => {
    const examinationData = {
      patient,
      medicalHistory,
      uploadedImages,
      capturedImages,
      vitalSigns,
      testResults,
      orderedInvestigations,
      wearableData,
      aiSuggestions,
      verifiedDiagnoses,
      selectedCodes,
      timestamp: new Date().toISOString()
    };

    onSave && onSave(examinationData);
    toast.success('Examination data saved successfully');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Examination & Diagnosis</h2>
              <p className="text-blue-100">
                Patient: {patient?.name} | Age: {patient?.age} | Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">AI Active</span>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-200px)]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Medical History Tab */}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Chief Complaint
                        </label>
                        <textarea
                          value={medicalHistory.chiefComplaint}
                          onChange={(e) => handleHistoryChange('chiefComplaint', e.target.value)}
                          placeholder="Patient's main concern or reason for visit..."
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          History of Present Illness
                        </label>
                        <textarea
                          value={medicalHistory.historyOfPresentIllness}
                          onChange={(e) => handleHistoryChange('historyOfPresentIllness', e.target.value)}
                          placeholder="Detailed description of current symptoms, onset, duration, severity..."
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Past Medical History
                          </label>
                          <textarea
                            value={medicalHistory.pastMedicalHistory}
                            onChange={(e) => handleHistoryChange('pastMedicalHistory', e.target.value)}
                            placeholder="Previous illnesses, surgeries, hospitalizations..."
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Family History
                          </label>
                          <textarea
                            value={medicalHistory.familyHistory}
                            onChange={(e) => handleHistoryChange('familyHistory', e.target.value)}
                            placeholder="Family history of diseases, genetic conditions..."
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Allergies
                          </label>
                          <textarea
                            value={medicalHistory.allergies}
                            onChange={(e) => handleHistoryChange('allergies', e.target.value)}
                            placeholder="Drug allergies, food allergies, environmental allergies..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-3">
                            Current Medications
                          </label>
                          <textarea
                            value={medicalHistory.medications}
                            onChange={(e) => handleHistoryChange('medications', e.target.value)}
                            placeholder="Current medications, dosages, frequency..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Quick History Questions */}
                      <div className="bg-blue-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick History Questions</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {Object.entries(historyQuestions).map(([system, questions]) => (
                            <div key={system} className="space-y-3">
                              <h4 className="font-medium text-gray-800 capitalize">{system}</h4>
                              {questions.map((question, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{question}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reports & Scans Tab */}
                {activeTab === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Lab Reports, Scans & X-rays</h3>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Reports</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                          <div className="relative">
                            <img 
                              src={image.url} 
                              alt={image.name}
                              className="w-full h-48 object-cover"
                            />
                            {image.annotations && image.annotations.length > 0 && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                {image.annotations.length} annotations
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{image.name}</h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startAnnotation(image)}
                                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                              >
                                <Highlighter className="w-4 h-4 inline mr-1" />
                                Annotate
                              </button>
                              <button className="bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Image Annotation Modal */}
                    {selectedImage && annotationMode === 'annotate' && (
                      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Annotate: {selectedImage.name}</h3>
                            <button
                              onClick={() => setAnnotationMode('view')}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                          
                          <div className="relative">
                            <img
                              src={selectedImage.url}
                              alt={selectedImage.name}
                              className="max-w-full max-h-96 object-contain"
                              onClick={(e) => {
                                if (annotationMode === 'annotate') {
                                  const rect = e.target.getBoundingClientRect();
                                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                                  const description = prompt('Enter annotation description:');
                                  if (description) {
                                    addAnnotation(x, y, 'point', description);
                                  }
                                }
                              }}
                            />

                            {/* Annotation markers overlay */}
                            <div className="absolute inset-0">
                              {selectedImage.annotations?.map((annotation, index) => (
                                <div
                                  key={annotation.id}
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                  style={{
                                    left: `${annotation.x}%`,
                                    top: `${annotation.y}%`
                                  }}
                                  title={annotation.description}
                                >
                                  {annotation.type === 'point' && (
                                    <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
                                  )}
                                  {annotation.type === 'highlight' && (
                                    <div className="w-8 h-8 bg-yellow-400 opacity-50 rounded-full" />
                                  )}
                                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                                    {annotation.description}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Drawing overlay for highlighting */}
                            {annotationMode === 'highlight' && (
                              <canvas
                                ref={imageCanvasRef}
                                className="absolute inset-0 w-full h-full cursor-crosshair"
                                onMouseDown={(e) => setIsDrawing(true)}
                                onMouseMove={(e) => {
                                  if (isDrawing && imageCanvasRef.current) {
                                    const canvas = imageCanvasRef.current;
                                    const ctx = canvas.getContext('2d');
                                    const rect = canvas.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;

                                    ctx.strokeStyle = '#fbbf24';
                                    ctx.lineWidth = 3;
                                    ctx.lineTo(x, y);
                                    ctx.stroke();
                                  }
                                }}
                                onMouseUp={() => setIsDrawing(false)}
                              />
                            )}
                          </div>
                          
                          <div className="flex space-x-4 mt-4">
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                              <Highlighter className="w-4 h-4 inline mr-2" />
                              Highlight Abnormal
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                              <MousePointer className="w-4 h-4 inline mr-2" />
                              Add Arrow
                            </button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                              <Type className="w-4 h-4 inline mr-2" />
                              Add Text
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Visual Inspection Tab */}
                {activeTab === 'inspection' && (
                  <motion.div
                    key="inspection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Visual Inspection</h3>
                      <div className="flex space-x-3">
                        <select
                          value={inspectionType}
                          onChange={(e) => setInspectionType(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="skin">Skin Examination</option>
                          <option value="eye">Eye Examination</option>
                          <option value="wound">Wound Assessment</option>
                          <option value="oral">Oral Examination</option>
                        </select>
                        <button
                          onClick={cameraActive ? stopCamera : startCamera}
                          className={`px-4 py-2 rounded-lg text-white transition-colors ${
                            cameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {cameraActive ? (
                            <>
                              <VideoOff className="w-4 h-4 inline mr-2" />
                              Stop Camera
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 inline mr-2" />
                              Start Camera
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Camera Feed */}
                      <div className="space-y-4">
                        <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video">
                          {cameraActive ? (
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-white">
                              <div className="text-center">
                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Camera not active</p>
                                <p className="text-sm opacity-75">Click "Start Camera" to begin visual inspection</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {cameraActive && (
                          <div className="flex justify-center space-x-4">
                            <button
                              onClick={captureImage}
                              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Camera className="w-5 h-5 inline mr-2" />
                              Capture Image
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Captured Images */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Captured Images</h4>
                        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {capturedImages.map((image) => (
                            <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={image.dataUrl} 
                                alt={`${image.type} inspection`}
                                className="w-full h-24 object-cover"
                              />
                              <div className="p-2">
                                <p className="text-xs font-medium text-gray-900 capitalize">{image.type}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(image.capturedAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Inspection Guidelines */}
                    <div className="bg-blue-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Inspection Guidelines</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Skin Examination</h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Check for lesions, rashes, discoloration</li>
                            <li>• Assess texture and moisture</li>
                            <li>• Look for signs of infection</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Eye Examination</h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Examine conjunctiva for redness</li>
                            <li>• Check pupil size and reactivity</li>
                            <li>• Assess eye movement</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Wound Assessment</h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Document wound size and depth</li>
                            <li>• Check for signs of healing</li>
                            <li>• Assess drainage and odor</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Physical Tests Tab */}
                {activeTab === 'tests' && (
                  <motion.div
                    key="tests"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">Physical Tests & Connected Devices</h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Available Devices */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Available Devices</h4>
                        <div className="space-y-3">
                          {availableDevices.map((device) => {
                            const Icon = device.icon;
                            const isConnected = connectedDevices.includes(device.id);
                            return (
                              <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${
                                    isConnected ? 'bg-green-100' : 'bg-gray-100'
                                  }`}>
                                    <Icon className={`w-5 h-5 ${
                                      isConnected ? 'text-green-600' : 'text-gray-500'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{device.name}</p>
                                    <p className={`text-sm ${
                                      isConnected ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                      {isConnected ? 'Connected' : 'Disconnected'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => connectDevice(device.id)}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${
                                      isConnected 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                  >
                                    {isConnected ? 'Disconnect' : 'Connect'}
                                  </button>
                                  {isConnected && (
                                    <button
                                      onClick={() => simulateVitalReading(device.id)}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                                    >
                                      Take Reading
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Vital Signs Results */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Recent Readings</h4>
                        <div className="space-y-3">
                          {Object.entries(vitalSigns).map(([deviceId, reading]) => {
                            const device = availableDevices.find(d => d.id === deviceId);
                            if (!device) return null;

                            return (
                              <div key={deviceId} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium text-gray-900">{device.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(reading.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {Object.entries(reading).filter(([key]) => key !== 'timestamp').map(([key, value]) => (
                                    <div key={key}>
                                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                      <span className="text-gray-700">{value}</span>
                                      {key === 'systolic' && reading.diastolic && (
                                        <span className="text-gray-700">/{reading.diastolic}</span>
                                      )}
                                      {key === 'temperature' && <span className="text-gray-700">°F</span>}
                                      {key === 'spo2' && <span className="text-gray-700">%</span>}
                                      {key === 'glucose' && <span className="text-gray-700"> mg/dL</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Investigations Tab */}
                {activeTab === 'investigations' && (
                  <motion.div
                    key="investigations"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">Order Investigations</h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Investigation Categories */}
                      <div className="space-y-6">
                        {investigationOptions.map((category) => (
                          <div key={category.category} className="border border-gray-200 rounded-2xl p-4">
                            <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
                            <div className="space-y-2">
                              {category.items.map((investigation) => (
                                <div key={investigation.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{investigation.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {investigation.department} • {investigation.urgency}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => orderInvestigation(investigation)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                  >
                                    Order
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Ordered Investigations */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Ordered Investigations</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {orderedInvestigations.map((investigation) => (
                            <div key={investigation.id} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-900">{investigation.name}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  investigation.urgency === 'stat' ? 'bg-red-100 text-red-800' :
                                  investigation.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {investigation.urgency}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Department: {investigation.department}</p>
                                <p>Ordered: {new Date(investigation.orderedAt).toLocaleString()}</p>
                                <p>Status: {investigation.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Wearable Data Tab */}
                {activeTab === 'vitals' && (
                  <motion.div
                    key="vitals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Wearable Device Integration</h3>
                      <button
                        onClick={connectWearable}
                        disabled={deviceStatus === 'connected'}
                        className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2 ${
                          deviceStatus === 'connected' 
                            ? 'bg-green-500' 
                            : deviceStatus === 'connecting'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        <Bluetooth className="w-4 h-4" />
                        <span>
                          {deviceStatus === 'connected' ? 'Connected' :
                           deviceStatus === 'connecting' ? 'Connecting...' :
                           'Connect Wearable'}
                        </span>
                      </button>
                    </div>

                    {deviceStatus === 'connected' && wearableData.lastSync && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Daily Steps</h4>
                            <Activity className="w-6 h-6" />
                          </div>
                          <p className="text-3xl font-bold">{wearableData.steps?.toLocaleString()}</p>
                          <p className="text-blue-100 text-sm">Today</p>
                        </div>

                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Heart Rate</h4>
                            <Heart className="w-6 h-6" />
                          </div>
                          <p className="text-3xl font-bold">{wearableData.heartRate}</p>
                          <p className="text-red-100 text-sm">BPM</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Calories</h4>
                            <Zap className="w-6 h-6" />
                          </div>
                          <p className="text-3xl font-bold">{wearableData.calories}</p>
                          <p className="text-green-100 text-sm">kcal</p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Active Minutes</h4>
                            <Clock className="w-6 h-6" />
                          </div>
                          <p className="text-3xl font-bold">{wearableData.activeMinutes}</p>
                          <p className="text-purple-100 text-sm">minutes</p>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Sleep</h4>
                            <moon className="w-6 h-6" />
                          </div>
                          <p className="text-3xl font-bold">{wearableData.sleepHours?.toFixed(1)}</p>
                          <p className="text-indigo-100 text-sm">hours</p>
                        </div>

                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Last Sync</h4>
                            <Wifi className="w-6 h-6" />
                          </div>
                          <p className="text-lg font-bold">
                            {new Date(wearableData.lastSync).toLocaleTimeString()}
                          </p>
                          <p className="text-gray-100 text-sm">
                            {new Date(wearableData.lastSync).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {deviceStatus === 'disconnected' && (
                      <div className="text-center py-12">
                        <Watch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Wearable Connected</h4>
                        <p className="text-gray-500 mb-6">
                          Connect a wearable device to monitor patient vitals and activity data
                        </p>
                        <div className="flex justify-center space-x-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Heart className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600">Heart Rate</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Activity className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">Activity</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-600">Sleep</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* AI Diagnosis Tab */}
                {activeTab === 'diagnosis' && (
                  <motion.div
                    key="diagnosis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">AI-Suggested Diagnoses</h3>
                      {diagnosisConfidence > 0 && (
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            AI Confidence: {diagnosisConfidence}%
                          </span>
                        </div>
                      )}
                    </div>

                    {aiSuggestions.length > 0 ? (
                      <div className="space-y-4">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  {suggestion.diagnosis}
                                </h4>
                                <p className="text-gray-600 mb-3">{suggestion.reasoning}</p>
                                
                                <div className="flex items-center space-x-4 mb-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${suggestion.confidence}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">{suggestion.confidence}%</span>
                                  </div>
                                  
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    suggestion.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                    suggestion.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {suggestion.urgency} priority
                                  </span>
                                </div>

                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Recommendations:</h5>
                                  <ul className="space-y-1">
                                    {suggestion.recommendations.map((rec, recIndex) => (
                                      <li key={recIndex} className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => verifyDiagnosis(suggestion)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ml-4"
                              >
                                <Check className="w-4 h-4 inline mr-2" />
                                Verify
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No AI Suggestions Yet</h4>
                        <p className="text-gray-500">
                          Complete the medical history to get AI-powered diagnostic suggestions
                        </p>
                      </div>
                    )}

                    {/* Verified Diagnoses */}
                    {verifiedDiagnoses.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Verified Diagnoses</h4>
                        <div className="space-y-3">
                          {verifiedDiagnoses.map((diagnosis, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-green-800">{diagnosis.diagnosis}</h5>
                                  <p className="text-sm text-green-700">
                                    Verified by {diagnosis.verifiedBy} on {new Date(diagnosis.verifiedAt).toLocaleString()}
                                  </p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Medical Codes Tab */}
                {activeTab === 'codes' && (
                  <motion.div
                    key="codes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Medical Coding (ICD-10 & SNOMED)</h3>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search codes..."
                          value={codeSearch}
                          onChange={(e) => setCodeSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* ICD-10 Codes */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">ICD-10 Diagnosis Codes</h4>
                        
                        {/* Selected ICD-10 Codes */}
                        {selectedCodes.icd10.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Selected ICD-10 Codes:</h5>
                            <div className="space-y-2">
                              {selectedCodes.icd10.map(code => (
                                <div key={code.code} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-blue-800">{code.code}</span>
                                    <span className="ml-3 text-blue-700 text-sm">{code.description}</span>
                                  </div>
                                  <button
                                    onClick={() => removeMedicalCode('icd10', code)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Available ICD-10 Codes */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {medicalCodes.icd10
                            .filter(code => 
                              code.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
                              code.description.toLowerCase().includes(codeSearch.toLowerCase())
                            )
                            .map(code => (
                              <button
                                key={code.code}
                                onClick={() => addMedicalCode('icd10', code)}
                                disabled={selectedCodes.icd10.find(c => c.code === code.code)}
                                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <div className="font-medium text-gray-900">{code.code}</div>
                                <div className="text-sm text-gray-600">{code.description}</div>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* SNOMED Codes */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">SNOMED CT Codes</h4>
                        
                        {/* Selected SNOMED Codes */}
                        {selectedCodes.snomed.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Selected SNOMED Codes:</h5>
                            <div className="space-y-2">
                              {selectedCodes.snomed.map(code => (
                                <div key={code.code} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-green-800">{code.code}</span>
                                    <span className="ml-3 text-green-700 text-sm">{code.description}</span>
                                  </div>
                                  <button
                                    onClick={() => removeMedicalCode('snomed', code)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Available SNOMED Codes */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {medicalCodes.snomed
                            .filter(code => 
                              code.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
                              code.description.toLowerCase().includes(codeSearch.toLowerCase())
                            )
                            .map(code => (
                              <button
                                key={code.code}
                                onClick={() => addMedicalCode('snomed', code)}
                                disabled={selectedCodes.snomed.find(c => c.code === code.code)}
                                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <div className="font-medium text-gray-900">{code.code}</div>
                                <div className="text-sm text-gray-600">{code.description}</div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={saveExamination}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Examination</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExaminationDiagnosis;
