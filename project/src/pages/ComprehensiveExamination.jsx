import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  FileText,
  Camera,
  Microscope,
  Heart,
  Activity,
  Brain,
  Eye,
  Thermometer,
  Monitor,
  TestTube,
  Upload,
  Download,
  Save,
  Send,
  Plus,
  Minus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Wifi,
  WifiOff,
  Zap,
  Target,
  Settings,
  Archive,
  Share,
  Copy,
  Printer,
  Smartphone,
  Tablet,
  Watch,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const ComprehensiveExamination = ({ patient, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [isConnectedToDevices, setIsConnectedToDevices] = useState(false);
  const [selectedExaminationType, setSelectedExaminationType] = useState('general');
  
  const [medicalHistory, setMedicalHistory] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    familyHistory: '',
    socialHistory: '',
    allergies: '',
    currentMedications: '',
    reviewOfSystems: {
      constitutional: '',
      cardiovascular: '',
      respiratory: '',
      gastrointestinal: '',
      genitourinary: '',
      musculoskeletal: '',
      neurological: '',
      psychiatric: '',
      endocrine: '',
      hematologic: '',
      allergic: '',
      integumentary: ''
    }
  });

  const [physicalExamination, setPhysicalExamination] = useState({
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: '',
      painScale: ''
    },
    generalAppearance: '',
    headEyesEarNoseThroat: '',
    cardiovascular: '',
    respiratory: '',
    abdominal: '',
    musculoskeletal: '',
    neurological: '',
    skin: '',
    lymphatic: '',
    psychiatric: ''
  });

  const [labReports, setLabReports] = useState([]);
  const [imagingStudies, setImageStudies] = useState([]);
  const [visualInspections, setVisualInspections] = useState([]);
  const [wearableData, setWearableData] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);

  const [aiDiagnosisResults, setAiDiagnosisResults] = useState([]);
  const [verifiedDiagnoses, setVerifiedDiagnoses] = useState([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState([]);
  const [clinicalDecisionSupport, setClinicalDecisionSupport] = useState([]);

  const [diagnosisCodes, setDiagnosisCodes] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');

  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [annotationMode, setAnnotationMode] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const examinationTypes = [
    { id: 'general', name: 'General Physical Examination', icon: Stethoscope },
    { id: 'cardiac', name: 'Cardiac Examination', icon: Heart },
    { id: 'respiratory', name: 'Respiratory Examination', icon: Activity },
    { id: 'neurological', name: 'Neurological Examination', icon: Brain },
    { id: 'ophthalmological', name: 'Eye Examination', icon: Eye },
    { id: 'dermatological', name: 'Skin Examination', icon: User }
  ];

  const medicalHistoryQuestions = {
    cardiovascular: [
      'Do you experience chest pain or discomfort?',
      'Have you noticed any shortness of breath?',
      'Do you have palpitations or irregular heartbeat?',
      'Have you experienced fainting or dizziness?',
      'Do you have swelling in your legs or ankles?'
    ],
    respiratory: [
      'Do you have a cough? If yes, is it productive?',
      'Do you experience shortness of breath?',
      'Have you had any wheezing?',
      'Do you have chest pain when breathing?',
      'Have you coughed up blood?'
    ],
    gastrointestinal: [
      'Do you have abdominal pain?',
      'Have you experienced nausea or vomiting?',
      'Have you noticed changes in bowel habits?',
      'Do you have difficulty swallowing?',
      'Have you seen blood in stool or vomit?'
    ]
  };

  const icdCodes = [
    { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings', category: 'General' },
    { code: 'I25.9', description: 'Chronic ischemic heart disease, unspecified', category: 'Cardiovascular' },
    { code: 'J44.0', description: 'Chronic obstructive pulmonary disease with acute lower respiratory infection', category: 'Respiratory' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine' },
    { code: 'I10', description: 'Essential hypertension', category: 'Cardiovascular' },
    { code: 'M79.3', description: 'Panniculitis, unspecified', category: 'Musculoskeletal' },
    { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus', category: 'Neurological' },
    { code: 'K59.00', description: 'Constipation, unspecified', category: 'Gastrointestinal' }
  ];

  const deviceTypes = [
    { id: 'bp_monitor', name: 'Blood Pressure Monitor', icon: Heart, connected: true },
    { id: 'pulse_oximeter', name: 'Pulse Oximeter', icon: Activity, connected: true },
    { id: 'glucometer', name: 'Blood Glucose Monitor', icon: TestTube, connected: false },
    { id: 'thermometer', name: 'Digital Thermometer', icon: Thermometer, connected: true },
    { id: 'ecg', name: 'ECG Machine', icon: Monitor, connected: false },
    { id: 'smart_watch', name: 'Smartwatch/Fitness Tracker', icon: Watch, connected: true }
  ];

  useEffect(() => {
    if (medicalHistory.chiefComplaint || medicalHistory.historyOfPresentIllness) {
      generateAIDiagnosis();
    }
  }, [medicalHistory.chiefComplaint, medicalHistory.historyOfPresentIllness]);

  useEffect(() => {
    const connectedDevicesList = deviceTypes.filter(device => device.connected);
    setConnectedDevices(connectedDevicesList);
  }, []);

  const generateAIDiagnosis = () => {
    const symptoms = (medicalHistory.chiefComplaint + ' ' + medicalHistory.historyOfPresentIllness).toLowerCase();
    const suggestions = [];

    if (symptoms.includes('chest pain') || symptoms.includes('shortness of breath')) {
      suggestions.push({
        diagnosis: 'Acute Coronary Syndrome',
        confidence: 85,
        severity: 'high',
        urgency: 'urgent',
        recommendations: ['ECG', 'Cardiac enzymes', 'Chest X-ray'],
        differentials: ['Pulmonary embolism', 'Pneumothorax', 'Esophageal spasm'],
        riskFactors: ['Age', 'Gender', 'Smoking history', 'Family history']
      });
    }

    if (symptoms.includes('headache') || symptoms.includes('migraine')) {
      suggestions.push({
        diagnosis: 'Primary Headache Disorder',
        confidence: 78,
        severity: 'moderate',
        urgency: 'routine',
        recommendations: ['Neurological examination', 'Consider imaging if red flags'],
        differentials: ['Tension headache', 'Migraine', 'Cluster headache'],
        riskFactors: ['Stress', 'Sleep patterns', 'Hormonal factors']
      });
    }

    if (symptoms.includes('fever') || symptoms.includes('cough')) {
      suggestions.push({
        diagnosis: 'Upper Respiratory Infection',
        confidence: 82,
        severity: 'mild',
        urgency: 'routine',
        recommendations: ['Physical examination', 'Consider throat culture if indicated'],
        differentials: ['Viral URI', 'Bacterial pharyngitis', 'Bronchitis'],
        riskFactors: ['Season', 'Exposure history', 'Immunocompromised state']
      });
    }

    setAiDiagnosisResults(suggestions);
    
    if (suggestions.length > 0) {
      const clinicalSupport = suggestions.map(suggestion => ({
        diagnosis: suggestion.diagnosis,
        evidenceLevel: 'Moderate',
        guidelines: [`Follow ${suggestion.diagnosis} clinical pathway`, 'Consider specialist referral if severe'],
        contradictions: ['Rule out serious causes first', 'Consider patient comorbidities'],
        drugInteractions: ['Check current medications', 'Consider allergies']
      }));
      setClinicalDecisionSupport(clinicalSupport);
    }
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: type,
        annotations: [],
        abnormalFindings: [],
        reportStatus: 'pending_review'
      };

      if (type === 'lab') {
        setLabReports(prev => [...prev, fileData]);
      } else if (type === 'imaging') {
        setImageStudies(prev => [...prev, fileData]);
      }
    });
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const connectToDevice = async (deviceId) => {
    try {
      const device = deviceTypes.find(d => d.id === deviceId);
      
      if (deviceId === 'bp_monitor') {
        const mockReading = {
          systolic: 120 + Math.floor(Math.random() * 40),
          diastolic: 80 + Math.floor(Math.random() * 20),
          heartRate: 60 + Math.floor(Math.random() * 40),
          timestamp: new Date().toISOString()
        };
        
        setPhysicalExamination(prev => ({
          ...prev,
          vitalSigns: {
            ...prev.vitalSigns,
            bloodPressure: `${mockReading.systolic}/${mockReading.diastolic}`,
            heartRate: mockReading.heartRate.toString()
          }
        }));
        
        toast.success(`Blood pressure reading: ${mockReading.systolic}/${mockReading.diastolic} mmHg`);
      } else if (deviceId === 'pulse_oximeter') {
        const mockReading = {
          oxygenSaturation: 95 + Math.floor(Math.random() * 5),
          heartRate: 60 + Math.floor(Math.random() * 40),
          timestamp: new Date().toISOString()
        };
        
        setPhysicalExamination(prev => ({
          ...prev,
          vitalSigns: {
            ...prev.vitalSigns,
            oxygenSaturation: mockReading.oxygenSaturation.toString(),
            heartRate: mockReading.heartRate.toString()
          }
        }));
        
        toast.success(`Oxygen saturation: ${mockReading.oxygenSaturation}%`);
      } else if (deviceId === 'thermometer') {
        const mockReading = {
          temperature: (97.5 + Math.random() * 3).toFixed(1),
          timestamp: new Date().toISOString()
        };
        
        setPhysicalExamination(prev => ({
          ...prev,
          vitalSigns: {
            ...prev.vitalSigns,
            temperature: mockReading.temperature
          }
        }));
        
        toast.success(`Temperature: ${mockReading.temperature}°F`);
      }
      
    } catch (error) {
      toast.error(`Failed to connect to ${device?.name}`);
    }
  };

  const performVisualInspection = (type) => {
    const inspection = {
      id: Date.now(),
      type,
      timestamp: new Date().toISOString(),
      findings: '',
      images: [],
      abnormalities: [],
      recommendations: []
    };

    setVisualInspections(prev => [...prev, inspection]);
    toast.success(`${type} examination started`);
  };

  const addAnnotation = (x, y, text, type = 'finding') => {
    const annotation = {
      id: Date.now(),
      x,
      y,
      text,
      type,
      timestamp: new Date().toISOString(),
      severity: 'normal'
    };
    
    setAnnotations(prev => [...prev, annotation]);
    toast.success('Annotation added');
  };

  const verifyDiagnosis = (suggestion) => {
    const verified = {
      ...suggestion,
      verifiedBy: 'Current Doctor',
      verifiedAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    setVerifiedDiagnoses(prev => [...prev, verified]);
    toast.success('Diagnosis verified and confirmed');
  };

  const addDifferentialDiagnosis = (diagnosis) => {
    const differential = {
      id: Date.now(),
      diagnosis,
      probability: 'moderate',
      supportingEvidence: [],
      contraindications: [],
      testsNeeded: []
    };
    
    setDifferentialDiagnoses(prev => [...prev, differential]);
  };

  const orderInvestigation = (testType, urgency = 'routine') => {
    const investigation = {
      id: Date.now(),
      type: testType,
      urgency,
      orderedAt: new Date().toISOString(),
      orderedBy: 'Current Doctor',
      status: 'ordered',
      expectedResults: null,
      instructions: ''
    };
    
    toast.success(`${testType} ordered with ${urgency} priority`);
  };

  const calculateBMI = () => {
    const weight = parseFloat(physicalExamination.vitalSigns.weight);
    const height = parseFloat(physicalExamination.vitalSigns.height);
    
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      setPhysicalExamination(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          bmi
        }
      }));
    }
  };

  const saveExamination = () => {
    const examinationData = {
      patient,
      medicalHistory,
      physicalExamination,
      labReports,
      imagingStudies,
      visualInspections,
      aiDiagnosisResults,
      verifiedDiagnoses,
      differentialDiagnoses,
      diagnosisCodes,
      treatmentPlan,
      followUpInstructions,
      timestamp: new Date().toISOString(),
      examiner: 'Current Doctor'
    };

    onSave && onSave(examinationData);
    toast.success('Comprehensive examination saved');
  };

  const tabs = [
    { id: 'history', name: 'Medical History', icon: FileText },
    { id: 'physical', name: 'Physical Exam', icon: Stethoscope },
    { id: 'reports', name: 'Lab Reports & Imaging', icon: Microscope },
    { id: 'visual', name: 'Visual Inspection', icon: Camera },
    { id: 'devices', name: 'Connected Devices', icon: Monitor },
    { id: 'ai_diagnosis', name: 'AI Diagnosis', icon: Brain },
    { id: 'codes', name: 'Diagnosis Codes', icon: TestTube }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Comprehensive Examination & Diagnosis</h2>
              <p className="text-blue-100">Patient: {patient?.name || 'Unknown'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(95vh-120px)]">
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Medical History Collection</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Chief Complaint</label>
                      <textarea
                        value={medicalHistory.chiefComplaint}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                        placeholder="What is the main reason for today's visit?"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">History of Present Illness</label>
                      <textarea
                        value={medicalHistory.historyOfPresentIllness}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                        placeholder="Detailed description of current symptoms, onset, duration, severity..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Past Medical History</label>
                      <textarea
                        value={medicalHistory.pastMedicalHistory}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
                        placeholder="Previous illnesses, surgeries, hospitalizations..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Family History</label>
                      <textarea
                        value={medicalHistory.familyHistory}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, familyHistory: e.target.value }))}
                        placeholder="Family medical history, genetic conditions..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Allergies</label>
                      <textarea
                        value={medicalHistory.allergies}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, allergies: e.target.value }))}
                        placeholder="Drug allergies, food allergies, environmental allergies..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Current Medications</label>
                      <textarea
                        value={medicalHistory.currentMedications}
                        onChange={(e) => setMedicalHistory(prev => ({ ...prev, currentMedications: e.target.value }))}
                        placeholder="Current medications, dosages, frequency..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">System-Specific Questions</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(medicalHistoryQuestions).map(([system, questions]) => (
                        <div key={system} className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2 capitalize">{system}</h5>
                          <div className="space-y-2">
                            {questions.slice(0, 3).map((question, index) => (
                              <p key={index} className="text-sm text-gray-600">{question}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'physical' && (
                <motion.div
                  key="physical"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Physical Examination</h3>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">Vital Signs</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                        <input
                          type="number"
                          value={physicalExamination.vitalSigns.temperature}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="98.6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (mmHg)</label>
                        <input
                          type="text"
                          value={physicalExamination.vitalSigns.bloodPressure}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                        <input
                          type="number"
                          value={physicalExamination.vitalSigns.heartRate}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="72"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Oxygen Saturation (%)</label>
                        <input
                          type="number"
                          value={physicalExamination.vitalSigns.oxygenSaturation}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, oxygenSaturation: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="98"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          value={physicalExamination.vitalSigns.weight}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                          }))}
                          onBlur={calculateBMI}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                        <input
                          type="number"
                          value={physicalExamination.vitalSigns.height}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, height: e.target.value }
                          }))}
                          onBlur={calculateBMI}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="170"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                        <input
                          type="text"
                          value={physicalExamination.vitalSigns.bmi}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                          placeholder="Auto-calculated"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pain Scale (0-10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={physicalExamination.vitalSigns.painScale}
                          onChange={(e) => setPhysicalExamination(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, painScale: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">General Appearance</label>
                      <textarea
                        value={physicalExamination.generalAppearance}
                        onChange={(e) => setPhysicalExamination(prev => ({
                          ...prev,
                          generalAppearance: e.target.value
                        }))}
                        placeholder="Patient appears well, alert, oriented, in no acute distress..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Cardiovascular</label>
                      <textarea
                        value={physicalExamination.cardiovascular}
                        onChange={(e) => setPhysicalExamination(prev => ({
                          ...prev,
                          cardiovascular: e.target.value
                        }))}
                        placeholder="Regular rate and rhythm, no murmurs, rubs, or gallops..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Respiratory</label>
                      <textarea
                        value={physicalExamination.respiratory}
                        onChange={(e) => setPhysicalExamination(prev => ({
                          ...prev,
                          respiratory: e.target.value
                        }))}
                        placeholder="Clear to auscultation bilaterally, no wheezes, rales, or rhonchi..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">Neurological</label>
                      <textarea
                        value={physicalExamination.neurological}
                        onChange={(e) => setPhysicalExamination(prev => ({
                          ...prev,
                          neurological: e.target.value
                        }))}
                        placeholder="Alert and oriented x3, cranial nerves intact, motor strength 5/5..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">Examination Templates</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {examinationTypes.map(exam => {
                        const Icon = exam.icon;
                        return (
                          <button
                            key={exam.id}
                            onClick={() => setSelectedExaminationType(exam.id)}
                            className={`p-4 rounded-lg border transition-colors ${
                              selectedExaminationType === exam.id
                                ? 'border-purple-500 bg-purple-100'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'devices' && (
                <motion.div
                  key="devices"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Connected Medical Devices</h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deviceTypes.map(device => {
                      const Icon = device.icon;
                      return (
                        <div key={device.id} className={`p-6 rounded-lg border-2 ${
                          device.connected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <Icon className={`w-8 h-8 ${device.connected ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{device.name}</h4>
                          <p className={`text-sm mb-4 ${device.connected ? 'text-green-700' : 'text-gray-600'}`}>
                            {device.connected ? 'Connected' : 'Not Connected'}
                          </p>
                          <button
                            onClick={() => connectToDevice(device.id)}
                            disabled={!device.connected}
                            className={`w-full py-2 px-4 rounded-lg transition-colors ${
                              device.connected
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {device.connected ? 'Get Reading' : 'Unavailable'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Wearable Data Integration</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Heart Rate Variability</h5>
                        <div className="h-24 bg-gradient-to-r from-red-200 to-red-300 rounded-lg flex items-center justify-center">
                          <span className="text-red-800 font-semibold">Live Data Visualization</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Sleep Pattern</h5>
                        <div className="h-24 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
                          <span className="text-blue-800 font-semibold">7.5 hrs last night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai_diagnosis' && (
                <motion.div
                  key="ai_diagnosis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">AI-Powered Diagnosis & Clinical Decision Support</h3>

                  {aiDiagnosisResults.length > 0 ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Diagnostic Suggestions</h4>
                        <div className="space-y-4">
                          {aiDiagnosisResults.map((suggestion, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-lg font-semibold text-gray-900">{suggestion.diagnosis}</h5>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    suggestion.severity === 'high' ? 'bg-red-100 text-red-800' :
                                    suggestion.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {suggestion.severity}
                                  </span>
                                  <span className="text-sm font-medium text-blue-600">
                                    {suggestion.confidence}% confidence
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2">Recommended Tests</h6>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {suggestion.recommendations.map((rec, i) => (
                                      <li key={i}>• {rec}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2">Differential Diagnoses</h6>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {suggestion.differentials.map((diff, i) => (
                                      <li key={i}>• {diff}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2">Risk Factors</h6>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {suggestion.riskFactors.map((risk, i) => (
                                      <li key={i}>• {risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => verifyDiagnosis(suggestion)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Verify Diagnosis
                                </button>
                                <button
                                  onClick={() => addDifferentialDiagnosis(suggestion.diagnosis)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  Add as Differential
                                </button>
                                <button
                                  onClick={() => orderInvestigation(suggestion.recommendations[0], suggestion.urgency)}
                                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                  Order Tests
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {verifiedDiagnoses.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-green-900 mb-4">Verified Diagnoses</h4>
                          <div className="space-y-3">
                            {verifiedDiagnoses.map((diagnosis, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-semibold text-gray-900">{diagnosis.diagnosis}</h5>
                                  <span className="text-sm text-green-600">Verified</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                  Verified by {diagnosis.verifiedBy} on {new Date(diagnosis.verifiedAt).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No AI Analysis Available</h4>
                      <p className="text-gray-500">Complete the medical history to get AI diagnostic suggestions</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => orderInvestigation('ECG', 'urgent')}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
              >
                Order ECG
              </button>
              <button
                onClick={() => orderInvestigation('Blood Test', 'routine')}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Order Lab Tests
              </button>
              <button
                onClick={() => orderInvestigation('Chest X-ray', 'routine')}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Order Imaging
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

export default ComprehensiveExamination;
