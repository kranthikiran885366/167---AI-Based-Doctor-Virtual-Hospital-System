import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Video, 
  MessageSquare, 
  FileText, 
  Calendar,
  Bell,
  Clock,
  Activity,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  Phone,
  Camera,
  Mic,
  MicOff,
  Share,
  Edit,
  Send,
  Plus,
  Search,
  Filter,
  Star,
  Heart,
  Stethoscope,
  Pill,
  Download,
  Upload,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Printer,
  Mail,
  PhoneCall,
  MessageCircle,
  VideoIcon,
  Headphones
} from 'lucide-react';
import { toast } from 'react-toastify';
import ExaminationDiagnosis from '../components/ExaminationDiagnosis.jsx';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      priority: 'critical',
      status: 'waiting',
      appointmentTime: '10:30 AM',
      waitTime: '15 min',
      symptoms: 'Chest pain, difficulty breathing',
      aiPreDiagnosis: 'Possible cardiac event - requires immediate attention',
      vitals: { bp: '180/100', hr: '95', temp: '98.6', o2: '94%' },
      allergies: ['Penicillin'],
      medications: ['Lisinopril', 'Metformin'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&auto=format'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      priority: 'normal',
      status: 'scheduled',
      appointmentTime: '11:00 AM',
      waitTime: '0 min',
      symptoms: 'Headache, fatigue',
      aiPreDiagnosis: 'Likely tension headache or stress-related symptoms',
      vitals: { bp: '120/80', hr: '72', temp: '98.2', o2: '98%' },
      allergies: ['Sulfa drugs'],
      medications: ['Birth control'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b55c?w=50&h=50&fit=crop&auto=format'
    },
    {
      id: 3,
      name: 'Mike Davis',
      age: 28,
      gender: 'Male',
      priority: 'normal',
      status: 'in-consultation',
      appointmentTime: '10:00 AM',
      waitTime: '30 min',
      symptoms: 'Fever, cough',
      aiPreDiagnosis: 'Upper respiratory infection, viral likely',
      vitals: { bp: '115/75', hr: '88', temp: '101.2', o2: '97%' },
      allergies: ['None known'],
      medications: ['None'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&auto=format'
    }
  ]);

  const [currentPatient, setCurrentPatient] = useState(null);
  const [consultationMode, setConsultationMode] = useState('video');
  const [isInConsultation, setIsInConsultation] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [earnings, setEarnings] = useState({
    today: 850,
    week: 4200,
    month: 18500,
    total: 156000
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'emergency', message: 'Emergency consultation request from John Smith', time: '2 min ago', urgent: true },
    { id: 2, type: 'appointment', message: 'New appointment scheduled for 2:00 PM', time: '15 min ago', urgent: false },
    { id: 3, type: 'result', message: 'Lab results available for Sarah Johnson', time: '1 hour ago', urgent: false }
  ]);

  const tabs = [
    { id: 'queue', name: 'Patient Queue', icon: Users, count: patients.length },
    { id: 'consultation', name: 'Active Consultation', icon: Video, count: 0 },
    { id: 'prescriptions', name: 'Prescriptions', icon: Pill, count: 5 },
    { id: 'documents', name: 'Documentation', icon: FileText, count: 12 },
    { id: 'earnings', name: 'Earnings', icon: DollarSign, count: 0 },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle, count: 1 }
  ];

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePatientAction = (patientId, action) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: action === 'accept' ? 'accepted' : 'rejected' }
        : patient
    ));
    
    if (action === 'accept') {
      const patient = patients.find(p => p.id === patientId);
      setCurrentPatient(patient);
      toast.success(`Consultation accepted for ${patient.name}`);
    } else {
      toast.info('Consultation request rejected');
    }
  };

  const startConsultation = (patient) => {
    setCurrentPatient(patient);
    setIsInConsultation(true);
    setActiveTab('consultation');
    setCallStatus('calling');
    
    // Simulate call connection
    setTimeout(() => {
      setCallStatus('connected');
      setCallDuration(0);
      toast.success(`Connected with ${patient.name}`);
    }, 3000);
  };

  const endConsultation = () => {
    setCallStatus('ended');
    setIsInConsultation(false);
    setCallDuration(0);
    setIsRecording(false);
    
    // Update patient status
    if (currentPatient) {
      setPatients(prev => prev.map(patient => 
        patient.id === currentPatient.id 
          ? { ...patient, status: 'completed' }
          : patient
      ));
    }
    
    toast.success('Consultation completed');
    setCurrentPatient(null);
    setActiveTab('queue');
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentPatient) {
      const message = {
        id: Date.now(),
        sender: 'doctor',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(isRecording ? 'Recording stopped' : 'Recording started');
  };

  const prescribeMedication = (medication) => {
    toast.success(`${medication} added to prescription`);
  };

  const PatientCard = ({ patient }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
        patient.priority === 'critical' 
          ? 'border-red-500 bg-red-50/30' 
          : 'border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={patient.avatar} 
            alt={patient.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
            <p className="text-gray-500">{patient.age} years, {patient.gender}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{patient.appointmentTime}</span>
              <span className="text-sm text-orange-600">Wait: {patient.waitTime}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {patient.priority === 'critical' && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              CRITICAL
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            patient.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
            patient.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
            patient.status === 'in-consultation' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {patient.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Symptoms:</h4>
          <p className="text-gray-600 text-sm">{patient.symptoms}</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1 flex items-center">
            <Stethoscope className="w-4 h-4 mr-2" />
            AI Pre-Diagnosis:
          </h4>
          <p className="text-blue-700 text-sm">{patient.aiPreDiagnosis}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-medium text-gray-700">BP</div>
            <div className="text-gray-600">{patient.vitals.bp}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-medium text-gray-700">HR</div>
            <div className="text-gray-600">{patient.vitals.hr}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-medium text-gray-700">Temp</div>
            <div className="text-gray-600">{patient.vitals.temp}°F</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="font-medium text-gray-700">O2</div>
            <div className="text-gray-600">{patient.vitals.o2}</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {patient.status === 'waiting' && (
          <>
            <button
              onClick={() => handlePatientAction(patient.id, 'accept')}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handlePatientAction(patient.id, 'reject')}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </>
        )}
        
        {(patient.status === 'accepted' || patient.status === 'scheduled') && (
          <button
            onClick={() => startConsultation(patient)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Start Consultation</span>
          </button>
        )}
        
        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const ConsultationInterface = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Video Call Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={currentPatient?.avatar} 
              alt={currentPatient?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{currentPatient?.name}</h3>
              <p className="text-blue-100 text-sm">
                {callStatus === 'calling' ? 'Connecting...' : 
                 callStatus === 'connected' ? `Connected - ${formatTime(callDuration)}` : 
                 'Call ended'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs">REC</span>
              </div>
            )}
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {consultationMode}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 p-6">
        {/* Video Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
            {callStatus === 'connected' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{currentPatient?.name}</p>
                  <p className="text-gray-300">Video consultation in progress</p>
                </div>
              </div>
            ) : callStatus === 'calling' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-pulse">
                    <Phone className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <p className="text-lg font-medium">Connecting to {currentPatient?.name}...</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Call ended</p>
                </div>
              </div>
            )}
            
            {/* Picture-in-picture (Doctor's view) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
              <div className="flex items-center justify-center h-full text-white text-xs">
                Your Camera
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 bg-gray-100 p-4 rounded-2xl">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={`p-3 rounded-full transition-colors ${
                !cameraEnabled ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-200 transition-colors">
              <Share className="w-5 h-5" />
            </button>
            
            <button className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-200 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
            
            <button
              onClick={endConsultation}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex space-x-2">
            {['video', 'voice', 'chat'].map((mode) => (
              <button
                key={mode}
                onClick={() => setConsultationMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  consultationMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mode === 'video' && <Video className="w-4 h-4 inline mr-2" />}
                {mode === 'voice' && <Headphones className="w-4 h-4 inline mr-2" />}
                {mode === 'chat' && <MessageCircle className="w-4 h-4 inline mr-2" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chat and Tools */}
        <div className="space-y-6">
          {/* Real-time Chat */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Chat</h4>
            <div className="h-64 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'doctor'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <span className="text-xs font-medium">Notes</span>
              </button>
              <button className="bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <Pill className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <span className="text-xs font-medium">Prescribe</span>
              </button>
              <button className="bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <Upload className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <span className="text-xs font-medium">Upload</span>
              </button>
              <button className="bg-white p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <span className="text-xs font-medium">Schedule</span>
              </button>
            </div>
          </div>

          {/* Patient Vitals */}
          {currentPatient && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Current Vitals</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-900">{currentPatient.vitals.bp}</div>
                  <div className="text-xs text-gray-500">Blood Pressure</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-900">{currentPatient.vitals.hr}</div>
                  <div className="text-xs text-gray-500">Heart Rate</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-900">{currentPatient.vitals.temp}°F</div>
                  <div className="text-xs text-gray-500">Temperature</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-900">{currentPatient.vitals.o2}</div>
                  <div className="text-xs text-gray-500">Oxygen Sat.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
              <p className="text-gray-600">Manage consultations, patients, and medical practice</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Online</span>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Earnings Display */}
              <div className="bg-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-gray-900">${earnings.today}</span>
                  <span className="text-gray-500 text-sm">today</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Patient Queue */}
              {activeTab === 'queue' && (
                <motion.div
                  key="queue"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Patient Queue</h2>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {patients.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Active Consultation */}
              {activeTab === 'consultation' && (
                <motion.div
                  key="consultation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {currentPatient ? (
                    <ConsultationInterface />
                  ) : (
                    <div className="text-center py-12">
                      <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Consultation</h3>
                      <p className="text-gray-500 mb-6">Start a consultation from the patient queue</p>
                      <button
                        onClick={() => setActiveTab('queue')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Go to Patient Queue
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Other tabs content would go here */}
              {activeTab !== 'queue' && activeTab !== 'consultation' && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    {activeTab === 'prescriptions' && <Pill className="w-16 h-16 mx-auto" />}
                    {activeTab === 'documents' && <FileText className="w-16 h-16 mx-auto" />}
                    {activeTab === 'earnings' && <DollarSign className="w-16 h-16 mx-auto" />}
                    {activeTab === 'emergency' && <AlertTriangle className="w-16 h-16 mx-auto" />}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {tabs.find(t => t.id === activeTab)?.name}
                  </h3>
                  <p className="text-gray-500">This section is under development</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
