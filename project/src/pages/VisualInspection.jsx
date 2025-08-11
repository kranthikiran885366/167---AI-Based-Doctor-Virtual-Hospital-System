import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Flashlight,
  FlashlightOff,
  Maximize,
  Minimize,
  Download,
  Save,
  Share,
  Eye,
  Ruler,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Archive,
  Plus,
  X,
  Play,
  Pause,
  Square,
  Settings,
  Info,
  History,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const VisualInspection = () => {
  const { user, addMedicalRecord } = useUser();
  const [isStreaming, setIsStreaming] = useState(false);
  const [inspectionType, setInspectionType] = useState('skin');
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [cameraSettings, setCameraSettings] = useState({
    facingMode: 'environment',
    zoom: 1,
    brightness: 0,
    contrast: 0,
    saturation: 0
  });
  const [measurements, setMeasurements] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: user?.name || '',
    age: '',
    bodyPart: '',
    symptoms: ''
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const inspectionTypes = [
    {
      id: 'skin',
      name: 'Skin Examination',
      description: 'Dermatological assessment for lesions, rashes, and abnormalities',
      guidelines: [
        'Use adequate lighting',
        'Examine entire body systematically',
        'Note size, color, texture, and borders',
        'Check for asymmetry and changes'
      ],
      commonFindings: ['Mole', 'Rash', 'Lesion', 'Scar', 'Birthmark', 'Inflammation']
    },
    {
      id: 'eye',
      name: 'Eye Examination',
      description: 'Ophthalmological inspection for external eye conditions',
      guidelines: [
        'Check pupil size and reactivity',
        'Examine conjunctiva for redness',
        'Assess eye movement and tracking',
        'Look for discharge or tearing'
      ],
      commonFindings: ['Conjunctivitis', 'Ptosis', 'Stye', 'Chalazion', 'Corneal abrasion']
    },
    {
      id: 'wound',
      name: 'Wound Assessment',
      description: 'Comprehensive wound evaluation and healing progress',
      guidelines: [
        'Measure wound dimensions',
        'Assess wound bed color',
        'Check for signs of infection',
        'Document drainage characteristics'
      ],
      commonFindings: ['Healing', 'Infected', 'Necrotic', 'Granulating', 'Epithelializing']
    },
    {
      id: 'oral',
      name: 'Oral Examination',
      description: 'Oral cavity and dental assessment',
      guidelines: [
        'Use proper lighting',
        'Examine all oral structures',
        'Check for lesions or abnormalities',
        'Assess gum health'
      ],
      commonFindings: ['Dental caries', 'Gingivitis', 'Oral lesion', 'Tongue abnormality']
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal Inspection',
      description: 'Assessment of joints, muscles, and skeletal structures',
      guidelines: [
        'Observe symmetry and alignment',
        'Check for swelling or deformity',
        'Assess range of motion',
        'Look for signs of inflammation'
      ],
      commonFindings: ['Swelling', 'Deformity', 'Bruising', 'Atrophy', 'Asymmetry']
    }
  ];

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraSettings.facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStreaming(true);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
      setIsRecording(false);
      toast.info('Camera stopped');
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !isStreaming) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    const capturedImage = {
      id: Date.now(),
      type: inspectionType,
      dataUrl: imageData,
      timestamp: new Date().toISOString(),
      patient: patientInfo.name,
      bodyPart: patientInfo.bodyPart,
      notes: inspectionNotes,
      measurements: [],
      annotations: [],
      analysis: null
    };

    setCapturedImages(prev => [...prev, capturedImage]);
    setSelectedImage(capturedImage);
    toast.success('Image captured successfully');
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const recording = {
          id: Date.now(),
          type: inspectionType,
          url,
          blob,
          timestamp: new Date().toISOString(),
          patient: patientInfo.name,
          duration: 0 // Will be calculated
        };

        setRecordings(prev => [...prev, recording]);
        setCurrentRecording(recording);
        toast.success('Recording saved successfully');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Unable to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Recording stopped');
    }
  };

  const analyzeImage = async (image) => {
    setIsAnalyzing(true);
    setSelectedImage(image);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysis = generateMockAnalysis(image);
      
      // Update image with analysis
      setCapturedImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, analysis } : img
      ));
      
      setAnalysisResults(analysis);
      
      // Save to medical records
      addMedicalRecord({
        type: 'visual_inspection',
        inspectionType: image.type,
        analysis,
        image: image.dataUrl,
        timestamp: new Date().toISOString()
      });

      toast.success('Image analysis completed');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (image) => {
    const analysisTemplates = {
      skin: {
        findings: [
          'Normal skin texture and color',
          'No visible lesions or abnormalities',
          'Good skin hydration',
          'No signs of inflammation'
        ],
        concerns: [],
        recommendations: [
          'Continue regular skin care routine',
          'Use sunscreen for UV protection',
          'Monitor for any changes'
        ],
        confidence: 94,
        riskLevel: 'low'
      },
      eye: {
        findings: [
          'Clear conjunctiva',
          'Normal pupil size and reactivity',
          'No visible discharge',
          'Good eye movement'
        ],
        concerns: [],
        recommendations: [
          'Maintain good eye hygiene',
          'Regular eye examinations',
          'Protect eyes from strain'
        ],
        confidence: 96,
        riskLevel: 'low'
      },
      wound: {
        findings: [
          'Clean wound edges',
          'Good granulation tissue',
          'No signs of infection',
          'Appropriate healing progress'
        ],
        concerns: [],
        recommendations: [
          'Continue current wound care',
          'Keep wound clean and dry',
          'Monitor for signs of infection',
          'Follow-up in 1 week'
        ],
        confidence: 91,
        riskLevel: 'low'
      }
    };

    return analysisTemplates[image.type] || analysisTemplates.skin;
  };

  const addMeasurement = (startX, startY, endX, endY) => {
    const measurement = {
      id: Date.now(),
      startX,
      startY,
      endX,
      endY,
      length: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
      unit: 'pixels',
      timestamp: new Date().toISOString()
    };

    setMeasurements(prev => [...prev, measurement]);
  };

  const deleteImage = (imageId) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
      setAnalysisResults(null);
    }
    toast.success('Image deleted');
  };

  const exportImage = (image) => {
    const link = document.createElement('a');
    link.download = `inspection_${image.type}_${new Date(image.timestamp).toISOString().split('T')[0]}.jpg`;
    link.href = image.dataUrl;
    link.click();
    toast.success('Image exported');
  };

  const saveInspectionReport = () => {
    const report = {
      id: Date.now(),
      patient: patientInfo,
      inspectionType,
      images: capturedImages,
      recordings,
      notes: inspectionNotes,
      timestamp: new Date().toISOString(),
      examiner: user?.name || 'Doctor'
    };

    localStorage.setItem('inspectionReports', JSON.stringify([
      ...JSON.parse(localStorage.getItem('inspectionReports') || '[]'),
      report
    ]));

    addMedicalRecord({
      type: 'inspection_report',
      data: report,
      timestamp: new Date().toISOString()
    });

    toast.success('Inspection report saved successfully');
  };

  const currentInspection = inspectionTypes.find(type => type.id === inspectionType);

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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Visual Inspection</h1>
              <p className="text-xl text-gray-600">Real-time Camera-based Medical Examination</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Body Part/Area"
                  value={patientInfo.bodyPart}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, bodyPart: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Symptoms/Concerns"
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Inspection Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Inspection Type</h3>
              <div className="space-y-2">
                {inspectionTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setInspectionType(type.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      inspectionType === type.id
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } border`}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Camera Controls</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isStreaming ? stopCamera : startCamera}
                    className={`flex-1 py-3 px-4 rounded-lg text-white transition-colors ${
                      isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isStreaming ? (
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

                {isStreaming && (
                  <>
                    <div className="flex space-x-2">
                      <button
                        onClick={captureImage}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Camera className="w-4 h-4 inline mr-2" />
                        Capture
                      </button>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors ${
                          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4 inline mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 inline mr-2" />
                            Record
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Camera Mode</label>
                      <select
                        value={cameraSettings.facingMode}
                        onChange={(e) => setCameraSettings(prev => ({ ...prev, facingMode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="environment">Back Camera</option>
                        <option value="user">Front Camera</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Inspection Guidelines */}
            {currentInspection && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Inspection Guidelines</h3>
                <div className="space-y-3">
                  <h4 className="font-medium text-purple-800">{currentInspection.name}</h4>
                  <p className="text-sm text-gray-600">{currentInspection.description}</p>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Guidelines:</h5>
                    <ul className="space-y-1">
                      {currentInspection.guidelines.map((guideline, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Common Findings:</h5>
                    <div className="flex flex-wrap gap-1">
                      {currentInspection.commonFindings.map((finding, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {finding}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Camera & Video */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                {/* Video Display */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">REC</span>
                    </div>
                  )}

                  {/* Camera Status */}
                  {!isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Camera Not Active</p>
                        <p className="text-gray-300">Click "Start Camera" to begin inspection</p>
                      </div>
                    </div>
                  )}

                  {/* Inspection Type Overlay */}
                  {isStreaming && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentInspection?.name}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Notes</label>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="Document your observations, findings, and notes during the examination..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={saveInspectionReport}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Report</span>
                  </button>
                  <button
                    onClick={() => toast.info('Export functionality will generate PDF report')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => toast.info('Share functionality will send to EMR system')}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                  >
                    <Share className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Captured Images & Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Captured Images */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Captured Images ({capturedImages.length})
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {capturedImages.map((image) => (
                  <div
                    key={image.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedImage?.id === image.id
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={image.dataUrl}
                        alt={`${image.type} inspection`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm capitalize">{image.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(image.timestamp).toLocaleString()}
                        </p>
                        {image.analysis && (
                          <div className="flex items-center space-x-1 mt-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">Analyzed</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        {!image.analysis && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              analyzeImage(image);
                            }}
                            disabled={isAnalyzing}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Search className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportImage(image);
                          }}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(image.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {capturedImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No images captured yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResults ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Confidence</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {analysisResults.confidence}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Risk Level</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      analysisResults.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      analysisResults.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysisResults.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Findings</h4>
                    <ul className="space-y-1">
                      {analysisResults.findings.map((finding, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysisResults.concerns.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Concerns
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-start">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-1 mr-2 flex-shrink-0" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {analysisResults.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="w-3 h-3 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing image...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select an image and click analyze for AI insights</p>
                </div>
              </div>
            )}

            {/* Recordings */}
            {recordings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recordings ({recordings.length})</h3>
                
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm capitalize">{recording.type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(recording.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = recording.url;
                              link.download = `inspection_${recording.type}_${new Date(recording.timestamp).toISOString().split('T')[0]}.webm`;
                              link.click();
                            }}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualInspection;
