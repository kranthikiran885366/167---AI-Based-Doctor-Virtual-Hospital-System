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
  Send, 
  Share, 
  Users, 
  Monitor, 
  Camera, 
  Settings, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Download, 
  Upload, 
  FileText, 
  Image, 
  PenTool, 
  Circle, 
  Square, 
  ArrowRight, 
  Save, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square as StopIcon, 
  Globe,
  Languages,
  Clock, 
  User, 
  Heart, 
  Activity, 
  Stethoscope,
  Eye,
  EyeOff,
  Zap,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Minus,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';

const ConsultationModes = () => {
  const [activeMode, setActiveMode] = useState('video');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [currentTool, setCurrentTool] = useState('pen');
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [bandwidth, setBandwidth] = useState('high');

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'patient',
      message: 'Hello Doctor, I\'m ready for the consultation',
      timestamp: '09:00 AM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'doctor',
      message: 'Good morning! How are you feeling today?',
      timestamp: '09:01 AM',
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Patient state
  const [currentPatient, setCurrentPatient] = useState({
    name: 'John Smith',
    age: 45,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    chiefComplaint: 'Chest pain and shortness of breath',
    vitals: {
      heartRate: 88,
      bloodPressure: '140/90',
      temperature: 98.6,
      oxygenSaturation: 97
    }
  });

  // Multi-doctor state
  const [connectedDoctors, setConnectedDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&auto=format'
    }
  ]);

  // File sharing state
  const [sharedFiles, setSharedFiles] = useState([
    {
      id: 1,
      name: 'ECG_Report_Jan2024.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadedBy: 'patient',
      timestamp: '09:05 AM'
    },
    {
      id: 2,
      name: 'Chest_Xray.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedBy: 'doctor',
      timestamp: '09:10 AM'
    }
  ]);

  // Whiteboard state
  const [annotations, setAnnotations] = useState([]);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.success(`Video ${!isVideoOn ? 'enabled' : 'disabled'}`);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.success(`Audio ${!isAudioOn ? 'enabled' : 'disabled'}`);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.success(`Recording ${!isRecording ? 'started' : 'stopped'}`);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.success(`Screen sharing ${!isScreenSharing ? 'started' : 'stopped'}`);
  };

  const endCall = () => {
    toast.success('Consultation ended');
    // Reset all states
    setIsVideoOn(false);
    setIsAudioOn(false);
    setIsRecording(false);
    setIsScreenSharing(false);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'doctor',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const shareFile = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const newFile = {
        id: sharedFiles.length + 1,
        name: file.name,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: 'doctor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSharedFiles(prev => [...prev, newFile]);
    });
    toast.success('File shared successfully');
  };

  const addAnnotation = (x, y) => {
    const newAnnotation = {
      id: Date.now(),
      x,
      y,
      tool: currentTool,
      color: '#ff0000'
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const clearAnnotations = () => {
    setAnnotations([]);
    toast.success('Annotations cleared');
  };

  const inviteDoctor = () => {
    const newDoctor = {
      id: connectedDoctors.length + 1,
      name: 'Dr. Michael Brown',
      specialization: 'Pulmonology',
      status: 'connecting',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format'
    };
    setConnectedDoctors([...connectedDoctors, newDoctor]);
    toast.success('Doctor invitation sent');
  };

  const adaptToBandwidth = (quality) => {
    setBandwidth(quality);
    setConnectionQuality(quality === 'high' ? 'excellent' : quality === 'medium' ? 'good' : 'poor');
    toast.success(`Quality adjusted to ${quality} bandwidth`);
  };

  const translateMessage = (message) => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      toast.success('Message translated');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      {/* Header Bar */}
      <div className="bg-white shadow-lg border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={currentPatient.avatar}
              alt={currentPatient.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentPatient.name}</h2>
              <p className="text-sm text-gray-600">{currentPatient.age} years • {currentPatient.chiefComplaint}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Call Duration */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(callDuration)}</span>
            </div>
            
            {/* Connection Quality */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              connectionQuality === 'excellent' ? 'bg-green-100 text-green-800' :
              connectionQuality === 'good' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <Signal className="w-4 h-4" />
              <span className="capitalize">{connectionQuality}</span>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg animate-pulse">
                <Record className="w-4 h-4" />
                <span>Recording</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Video/Content Area */}
        <div className={`flex-1 relative ${showChatPanel ? 'mr-80' : ''} transition-all duration-300`}>
          
          {/* Mode Selector */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <div className="flex space-x-2">
                {[
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'audio', label: 'Audio', icon: Phone },
                  { id: 'text', label: 'Text', icon: MessageSquare },
                  { id: 'hybrid', label: 'Hybrid', icon: Monitor }
                ].map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeMode === mode.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Patient Vitals Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Live Vitals</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{currentPatient.vitals.heartRate} bpm</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span>{currentPatient.vitals.bloodPressure}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Stethoscope className="w-3 h-3 text-green-500" />
                  <span>{currentPatient.vitals.temperature}°F</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-purple-500" />
                  <span>{currentPatient.vitals.oxygenSaturation}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Video/Content Display */}
          <div className="h-full relative bg-gray-900">
            {activeMode === 'video' || activeMode === 'hybrid' ? (
              <div className="h-full flex">
                {/* Main Video */}
                <div className="flex-1 relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    style={{ 
                      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                      display: isVideoOn ? 'block' : 'none'
                    }}
                  />
                  {!isVideoOn && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                      <div className="text-center text-white">
                        <VideoOff className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-xl font-semibold">Video is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Doctor Self View */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white">
                      <User className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Screen Share Overlay */}
                  {isScreenSharing && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center">
                        <Monitor className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                        <p className="text-gray-900 font-semibold">Screen Sharing Active</p>
                        <p className="text-sm text-gray-600">Sharing medical images and documents</p>
                      </div>
                    </div>
                  )}

                  {/* Whiteboard Overlay */}
                  {showWhiteboard && (
                    <div className="absolute inset-0 bg-white/95">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair"
                        onClick={(e) => {
                          const rect = canvasRef.current.getBoundingClientRect();
                          addAnnotation(e.clientX - rect.left, e.clientY - rect.top);
                        }}
                      />
                      
                      {/* Whiteboard Tools */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-white rounded-xl p-3 shadow-lg flex items-center space-x-3">
                          <button
                            onClick={() => setCurrentTool('pen')}
                            className={`p-2 rounded-lg transition-colors ${
                              currentTool === 'pen' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <PenTool className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setCurrentTool('circle')}
                            className={`p-2 rounded-lg transition-colors ${
                              currentTool === 'circle' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Circle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setCurrentTool('square')}
                            className={`p-2 rounded-lg transition-colors ${
                              currentTool === 'square' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Square className="w-5 h-5" />
                          </button>
                          <button
                            onClick={clearAnnotations}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowWhiteboard(false)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-Doctor Panel */}
                {connectedDoctors.length > 1 && (
                  <div className="w-64 bg-gray-800 p-4 space-y-4">
                    <h3 className="text-white font-semibold mb-4">Connected Doctors</h3>
                    {connectedDoctors.map(doctor => (
                      <div key={doctor.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{doctor.name}</p>
                            <p className="text-gray-300 text-xs">{doctor.specialization}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            doctor.status === 'active' ? 'bg-green-500' :
                            doctor.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeMode === 'audio' ? (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white">
                <div className="text-center">
                  <Phone className="w-24 h-24 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-2">Audio Consultation</h2>
                  <p className="text-xl opacity-90">Connected with {currentPatient.name}</p>
                  <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-white/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Call Quality</h4>
                      <p className="capitalize">{connectionQuality}</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="font-mono">{formatTime(callDuration)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-700 text-white">
                <div className="text-center">
                  <MessageSquare className="w-24 h-24 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-2">Text Consultation</h2>
                  <p className="text-xl opacity-90">Chatting with {currentPatient.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-center space-x-4">
              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-colors ${
                  isAudioOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <Monitor className="w-6 h-6" />
              </button>

              {/* Whiteboard */}
              <button
                onClick={() => setShowWhiteboard(!showWhiteboard)}
                className={`p-4 rounded-full transition-colors ${
                  showWhiteboard ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <PenTool className="w-6 h-6" />
              </button>

              {/* Recording */}
              <button
                onClick={toggleRecording}
                className={`p-4 rounded-full transition-colors ${
                  isRecording ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <Record className="w-6 h-6" />
              </button>

              {/* File Share */}
              <label className="p-4 bg-gray-700 text-white hover:bg-gray-600 rounded-full cursor-pointer transition-colors">
                <Upload className="w-6 h-6" />
                <input
                  type="file"
                  multiple
                  onChange={shareFile}
                  className="hidden"
                />
              </label>

              {/* Invite Doctor */}
              <button
                onClick={inviteDoctor}
                className="p-4 bg-green-500 text-white hover:bg-green-600 rounded-full transition-colors"
              >
                <Users className="w-6 h-6" />
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                className="p-4 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChatPanel && (
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Consultation Chat</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsTranslating(!isTranslating)}
                    className={`p-2 rounded-lg transition-colors ${
                      isTranslating ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Languages className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowChatPanel(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'doctor'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Shared Files */}
              {sharedFiles.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Shared Files</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {sharedFiles.map(file => (
                      <div key={file.id} className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate">{file.name}</p>
                          <p className="text-gray-500 text-xs">{file.size} • {file.timestamp}</p>
                        </div>
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        {!showChatPanel && (
          <button
            onClick={() => setShowChatPanel(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bandwidth Adaptation Modal */}
      <AnimatePresence>
        {connectionQuality === 'poor' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md"
            >
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Poor Connection Detected</h3>
                <p className="text-gray-600 mb-6">
                  Would you like to switch to a lower quality mode for better stability?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => adaptToBandwidth('low')}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Switch to Audio Only
                  </button>
                  <button
                    onClick={() => adaptToBandwidth('medium')}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reduce Quality
                  </button>
                  <button
                    onClick={() => setConnectionQuality('good')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Keep Current
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultationModes;
