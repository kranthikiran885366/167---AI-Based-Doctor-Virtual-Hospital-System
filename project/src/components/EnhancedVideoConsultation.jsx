import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Camera,
  Settings,
  Monitor,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Share,
  Record,
  StopCircle,
  Play,
  Pause,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Signal,
  User,
  Clock,
  Calendar,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Eye,
  Thermometer,
  Send,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Layers,
  Move3D,
  ZoomIn,
  ZoomOut,
  MoreVertical,
  Grid,
  Split,
  Maximize2
} from 'lucide-react';
import { toast } from 'react-toastify';
import ARAnatomyOverlay from './ARAnatomyOverlay';

const EnhancedVideoConsultation = ({ patient, onClose }) => {
  // Core consultation state
  const [consultationMode, setConsultationMode] = useState('video');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('high');
  const [bandwidth, setBandwidth] = useState(1000);
  
  // Audio/Video controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  // Layout and view controls
  const [viewMode, setViewMode] = useState('standard'); // standard, split-screen, picture-in-picture, grid
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitScreenLayout, setSplitScreenLayout] = useState('horizontal'); // horizontal, vertical
  const [activeCamera, setActiveCamera] = useState(0); // For multi-camera support
  const [availableCameras, setAvailableCameras] = useState([]);
  
  // Multi-camera and screen sharing
  const [cameraStreams, setCameraStreams] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [documentCamera, setDocumentCamera] = useState(null);
  
  // Medical tools integration
  const [showAROverlay, setShowAROverlay] = useState(false);
  const [medicalTools, setMedicalTools] = useState({
    stethoscope: false,
    otoscope: false,
    dermascope: false,
    ophthalmoscope: false
  });
  
  // Image and document handling
  const [capturedImages, setCapturedImages] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentAnnotations, setDocumentAnnotations] = useState([]);
  
  // Chat and notes
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [voiceNotes, setVoiceNotes] = useState([]);
  
  // Medical calculators
  const [showCalculators, setShowCalculators] = useState(false);
  const [calculatorResults, setCalculatorResults] = useState({});
  
  // Scan viewer
  const [currentScan, setCurrentScan] = useState(null);
  const [scanZoom, setScanZoom] = useState(100);
  const [scanAnnotations, setScanAnnotations] = useState([]);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const documentCameraRef = useRef(null);
  const chatContainerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Initialize cameras and devices
  useEffect(() => {
    initializeDevices();
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const initializeDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      
      // Initialize default camera
      if (cameras.length > 0) {
        initializeCamera(cameras[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
      toast.error('Failed to access camera devices');
    }
  };

  const initializeCamera = async (deviceId, streamIndex = 0) => {
    try {
      const constraints = {
        video: { 
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: isAudioEnabled
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (streamIndex === 0) {
        localVideoRef.current.srcObject = stream;
      } else {
        // Handle additional camera streams
        setCameraStreams(prev => {
          const newStreams = [...prev];
          newStreams[streamIndex] = stream;
          return newStreams;
        });
      }
      
      setIsCallActive(true);
      toast.success(`Camera ${streamIndex + 1} initialized`);
    } catch (error) {
      console.error('Error initializing camera:', error);
      toast.error('Failed to initialize camera');
    }
  };

  const addSecondaryCamera = async () => {
    if (availableCameras.length < 2) {
      toast.warning('Only one camera available');
      return;
    }
    
    const secondaryCamera = availableCameras[1];
    await initializeCamera(secondaryCamera.deviceId, 1);
    toast.success('Secondary camera (document cam) added');
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = stream;
      }
      
      toast.success('Screen sharing started');
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast.error('Failed to start screen sharing');
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      toast.info('Screen sharing stopped');
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = localVideoRef.current;
    
    if (video && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      const newImage = {
        id: Date.now(),
        data: imageData,
        timestamp: new Date().toISOString(),
        type: 'consultation-capture',
        camera: activeCamera + 1
      };
      
      setCapturedImages(prev => [...prev, newImage]);
      toast.success('Image captured');
    }
  };

  const switchCamera = (cameraIndex) => {
    if (cameraIndex < availableCameras.length) {
      setActiveCamera(cameraIndex);
      initializeCamera(availableCameras[cameraIndex].deviceId);
    }
  };

  const toggleSplitScreen = () => {
    setViewMode(viewMode === 'split-screen' ? 'standard' : 'split-screen');
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const document = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          data: e.target.result,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        setSharedDocuments(prev => [...prev, document]);
        setCurrentDocument(document);
        toast.success('Document uploaded and shared');
      };
      reader.readAsDataURL(file);
    }
  };

  const annotateDocument = (x, y, text, type = 'note') => {
    if (!currentDocument) return;
    
    const annotation = {
      id: Date.now(),
      x,
      y,
      text,
      type,
      timestamp: new Date().toISOString(),
      documentId: currentDocument.id
    };
    
    setDocumentAnnotations(prev => [...prev, annotation]);
    toast.success('Annotation added');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'Doctor',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Medical calculators
  const calculateBMI = (weight, height) => {
    const bmi = weight / ((height / 100) * (height / 100));
    const category = bmi < 18.5 ? 'Underweight' : 
                    bmi < 25 ? 'Normal' : 
                    bmi < 30 ? 'Overweight' : 'Obese';
    return { bmi: bmi.toFixed(1), category };
  };

  const calculateDosage = (weight, medication, indication) => {
    // Simplified dosage calculation
    const dosages = {
      'paracetamol': { adult: 500, pediatric: 10 },
      'ibuprofen': { adult: 400, pediatric: 5 },
      'amoxicillin': { adult: 500, pediatric: 20 }
    };
    
    const drug = dosages[medication.toLowerCase()];
    if (!drug) return null;
    
    if (weight < 12) { // Pediatric
      return `${Math.round(drug.pediatric * weight)} mg`;
    } else {
      return `${drug.adult} mg`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span className="font-semibold">Enhanced Video Consultation</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4" />
              <span>{patient?.name || 'Patient'}</span>
            </div>
            {isCallActive && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Controls */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-1 rounded bg-white/20 text-white text-sm"
            >
              <option value="standard">Standard</option>
              <option value="split-screen">Split Screen</option>
              <option value="picture-in-picture">PiP</option>
              <option value="grid">Grid View</option>
            </select>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-white/20 rounded"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 relative">
            {viewMode === 'split-screen' ? (
              <div className={`h-full flex ${splitScreenLayout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
                {/* Patient Video */}
                <div className="flex-1 relative bg-gray-900">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
                    Patient View
                  </div>
                </div>
                
                {/* Medical Notes/Documents Side */}
                <div className="flex-1 bg-white overflow-hidden">
                  {currentDocument ? (
                    <div className="h-full relative">
                      <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-1 rounded">
                        {currentDocument.name}
                      </div>
                      
                      {/* Document Viewer */}
                      {currentDocument.type.startsWith('image/') ? (
                        <div className="relative h-full">
                          <img
                            src={currentDocument.data}
                            alt={currentDocument.name}
                            className="w-full h-full object-contain"
                            style={{ transform: `scale(${scanZoom / 100})` }}
                          />
                          
                          {/* Zoom Controls */}
                          <div className="absolute bottom-4 left-4 flex space-x-2">
                            <button
                              onClick={() => setScanZoom(Math.max(50, scanZoom - 25))}
                              className="p-2 bg-black/70 text-white rounded"
                            >
                              <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-2 bg-black/70 text-white rounded text-sm">
                              {scanZoom}%
                            </span>
                            <button
                              onClick={() => setScanZoom(Math.min(300, scanZoom + 25))}
                              className="p-2 bg-black/70 text-white rounded"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Document: {currentDocument.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full p-6 overflow-y-auto">
                      <h3 className="font-semibold text-gray-900 mb-4">Medical Notes</h3>
                      <textarea
                        value={quickNotes}
                        onChange={(e) => setQuickNotes(e.target.value)}
                        placeholder="Enter consultation notes..."
                        className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {/* Quick Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setShowAROverlay(true)}
                          className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200"
                        >
                          <Brain className="w-4 h-4 inline mr-1" />
                          AR Anatomy
                        </button>
                        <button
                          onClick={() => setShowCalculators(true)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                        >
                          <Calculator className="w-4 h-4 inline mr-1" />
                          Calculators
                        </button>
                        <button
                          onClick={captureImage}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                        >
                          <Camera className="w-4 h-4 inline mr-1" />
                          Capture
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Standard View
              <div className="h-full bg-gray-900 relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    You {availableCameras.length > 1 && `(Cam ${activeCamera + 1})`}
                  </div>
                  
                  {/* Camera Switcher */}
                  {availableCameras.length > 1 && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {availableCameras.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => switchCamera(index)}
                          className={`w-6 h-6 rounded text-xs font-bold ${
                            activeCamera === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-black/50 text-white'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Secondary Camera (Document Cam) */}
                {cameraStreams[1] && (
                  <div className="absolute bottom-4 left-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-lg">
                    <video
                      ref={documentCameraRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      srcObject={cameraStreams[1]}
                    />
                    <div className="absolute top-2 left-2 text-white text-xs bg-yellow-600 px-2 py-1 rounded">
                      Document Cam
                    </div>
                    <button
                      onClick={captureImage}
                      className="absolute bottom-2 right-2 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Screen Share */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-green-400 shadow-lg">
                    <video
                      ref={screenShareRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 text-white text-xs bg-green-600 px-2 py-1 rounded">
                      Screen Share
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Call Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Core Controls */}
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-600' : 'bg-gray-600'}`}
                  >
                    <Share className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-gray-600'}`}
                  >
                    {isRecording ? <StopCircle className="w-5 h-5" /> : <Record className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Advanced Controls */}
                  <button
                    onClick={addSecondaryCamera}
                    className="p-3 bg-yellow-600 rounded-full hover:bg-yellow-700"
                    title="Add Document Camera"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={toggleSplitScreen}
                    className="p-3 bg-blue-600 rounded-full hover:bg-blue-700"
                    title="Toggle Split Screen"
                  >
                    <Split className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowAROverlay(true)}
                    className="p-3 bg-purple-600 rounded-full hover:bg-purple-700"
                    title="AR Anatomy Overlay"
                  >
                    <Layers className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-3 bg-red-600 rounded-full hover:bg-red-700"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {['Chat', 'Notes', 'Tools', 'Images'].map((tab) => (
                <button
                  key={tab}
                  className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {/* File Upload */}
              <div className="p-4 border-b border-gray-200">
                <label className="block">
                  <input
                    type="file"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <div className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload Medical Document</span>
                  </div>
                </label>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'Doctor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender === 'Doctor'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AR Anatomy Overlay */}
      {showAROverlay && (
        <ARAnatomyOverlay
          onClose={() => setShowAROverlay(false)}
          patientData={patient}
          consultationMode="live"
        />
      )}
    </div>
  );
};

export default EnhancedVideoConsultation;
