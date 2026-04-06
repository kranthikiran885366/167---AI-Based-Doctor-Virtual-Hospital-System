import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Pin, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Settings, 
  Save, 
  Download, 
  Upload, 
  FileText, 
  Camera, 
  Clock, 
  Phone, 
  Calendar, 
  User, 
  Heart, 
  Target, 
  Coffee, 
  PlayCircle, 
  PauseCircle, 
  Tag, 
  Languages, 
  Wifi, 
  WifiOff, 
  Archive, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Bookmark, 
  Star, 
  Flag, 
  Zap, 
  Lightbulb, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Send,
  Filter,
  Search,
  Plus,
  Minus,
  RotateCcw,
  Share,
  Monitor,
  Smartphone
} from 'lucide-react';
import { toast } from 'react-toastify';

const MicroFunctionalities = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [pinnedPatients, setPinnedPatients] = useState([]);
  const [privateReminders, setPrivateReminders] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);
  const voiceRef = useRef(null);

  // Sample data
  const [patientList, setPatientList] = useState([
    {
      id: 1,
      name: 'John Smith',
      urgency: 'high',
      lastVisit: '2024-01-10',
      notes: 'Chest pain follow-up',
      pinned: false,
      color: '#ff6b6b'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      urgency: 'critical',
      lastVisit: '2024-01-12',
      notes: 'Emergency consultation',
      pinned: true,
      color: '#ff4757'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      urgency: 'normal',
      lastVisit: '2024-01-08',
      notes: 'Routine checkup',
      pinned: false,
      color: '#2ed573'
    }
  ]);

  const [consultationImages, setConsultationImages] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: 'John Smith',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&auto=format',
      timestamp: '2024-01-15 14:30:00',
      notes: 'Skin condition on left arm'
    }
  ]);

  const [offlineQueue, setOfflineQueue] = useState([]);

  const soundAlerts = {
    newConsult: new Audio('/sounds/notification.mp3'),
    emergency: new Audio('/sounds/emergency.mp3'),
    reminder: new Audio('/sounds/gentle.mp3')
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const urgencyColors = {
    critical: '#ff4757',
    high: '#ff6b6b',
    normal: '#2ed573',
    low: '#3742fa'
  };

  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const startVoiceNote = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info('Voice recording started');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setVoiceNote(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        toast.error('Voice recognition error');
      };

      recognition.onend = () => {
        setIsRecording(false);
        toast.success('Voice note saved');
      };

      voiceRef.current = recognition;
      recognition.start();
    } else {
      toast.error('Voice recognition not supported');
    }
  };

  const stopVoiceNote = () => {
    if (voiceRef.current && isRecording) {
      voiceRef.current.stop();
    }
  };

  const saveVoiceNote = () => {
    if (voiceNote.trim()) {
      const newNote = {
        id: Date.now(),
        content: voiceNote,
        timestamp: new Date().toISOString(),
        type: 'voice'
      };
      setQuickNotes(prev => [...prev, newNote]);
      setVoiceNote('');
      toast.success('Voice note saved');
    }
  };

  const pinPatient = (patientId) => {
    setPatientList(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, pinned: !patient.pinned }
        : patient
    ));
    
    const patient = patientList.find(p => p.id === patientId);
    toast.success(`${patient.name} ${patient.pinned ? 'unpinned' : 'pinned'}`);
  };

  const addPrivateReminder = (reminderData) => {
    const reminder = {
      id: Date.now(),
      ...reminderData,
      timestamp: new Date().toISOString()
    };
    setPrivateReminders(prev => [...prev, reminder]);
    toast.success('Private reminder set');
  };

  const translateText = async (text, targetLang) => {
    // Simulate translation
    toast.info(`Translating to ${targetLang}...`);
    setTimeout(() => {
      toast.success('Text translated');
    }, 1000);
  };

  const attachImageToRecord = (patientId, imageFile) => {
    const newImage = {
      id: Date.now(),
      patientId,
      patientName: patientList.find(p => p.id === patientId)?.name,
      image: URL.createObjectURL(imageFile),
      timestamp: new Date().toISOString(),
      notes: ''
    };
    setConsultationImages(prev => [...prev, newImage]);
    toast.success('Image attached to patient record');
  };

  const toggleBreakMode = () => {
    setIsBreakMode(!isBreakMode);
    toast.success(`Break mode ${!isBreakMode ? 'activated' : 'deactivated'}`);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    toast.success(`Offline mode ${!isOfflineMode ? 'enabled' : 'disabled'}`);
  };

  const playCustomAlert = (type) => {
    if (soundEnabled && soundAlerts[type]) {
      soundAlerts[type].play().catch(() => {
        // Fallback for browsers that block autoplay
        toast.info(`${type} alert triggered`);
      });
    }
  };

  const syncOfflineData = () => {
    if (offlineQueue.length > 0) {
      toast.info('Syncing offline data...');
      setTimeout(() => {
        setOfflineQueue([]);
        toast.success('Offline data synced successfully');
      }, 2000);
    } else {
      toast.info('No offline data to sync');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    } pt-24 pb-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Advanced Doctor Tools
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Micro-functionalities for enhanced productivity and workflow
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Break Mode Toggle */}
              <button
                onClick={toggleBreakMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBreakMode 
                    ? 'bg-orange-500 text-white' 
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Coffee className="w-5 h-5" />
                <span>{isBreakMode ? 'On Break' : 'Break Mode'}</span>
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Tools Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {/* Voice Notes */}
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Voice Note</h3>
              <Mic className={`w-6 h-6 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            
            <textarea
              value={voiceNote}
              onChange={(e) => setVoiceNote(e.target.value)}
              placeholder="Voice note content will appear here..."
              className={`w-full h-20 p-3 border rounded-lg resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 placeholder-gray-500'
              }`}
            />
            
            <div className="flex space-x-2 mt-3">
              {!isRecording ? (
                <button
                  onClick={startVoiceNote}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopVoiceNote}
                  className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Stop
                </button>
              )}
              <button
                onClick={saveVoiceNote}
                disabled={!voiceNote.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language & Translation</h3>
              <Languages className="w-6 h-6 text-blue-500" />
            </div>
            
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => translateText('Sample text', currentLanguage)}
              className="w-full mt-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Test Translation
            </button>
          </div>

          {/* Sound Alerts */}
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sound Alerts</h3>
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 text-green-500" />
              ) : (
                <VolumeX className="w-6 h-6 text-red-500" />
              )}
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enable sound alerts
                </span>
              </label>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => playCustomAlert('newConsult')}
                  className="py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Test New Consult
                </button>
                <button
                  onClick={() => playCustomAlert('emergency')}
                  className="py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Test Emergency
                </button>
              </div>
            </div>
          </div>

          {/* Offline Mode */}
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Offline Mode</h3>
              {isOfflineMode ? (
                <WifiOff className="w-6 h-6 text-orange-500" />
              ) : (
                <Wifi className="w-6 h-6 text-green-500" />
              )}
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isOfflineMode}
                  onChange={(e) => setIsOfflineMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Store and sync later
                </span>
              </label>
              
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Queue: {offlineQueue.length} items
              </div>
              
              <button
                onClick={syncOfflineData}
                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Sync Now
              </button>
            </div>
          </div>
        </div>

        {/* Pinned Patients */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Pinned Patients (Quick Access)
            </h3>
            <Pin className="w-6 h-6 text-blue-500" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {patientList.map(patient => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border-l-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
                style={{ borderLeftColor: urgencyColors[patient.urgency] }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {patient.notes}
                    </p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        patient.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                        patient.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        patient.urgency === 'normal' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {patient.urgency}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => pinPatient(patient.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      patient.pinned 
                        ? 'bg-blue-500 text-white' 
                        : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private Reminders */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Private Reminders
            </h3>
            <Bell className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Reminder
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Reminder title..."
                  className={`w-full p-3 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 placeholder-gray-500'
                  }`}
                />
                <input
                  type="datetime-local"
                  className={`w-full p-3 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                />
                <button
                  onClick={() => addPrivateReminder({
                    title: 'Call patient in 2 weeks',
                    datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                  })}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Set Reminder
                </button>
              </div>
            </div>
            
            <div>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Upcoming Reminders
              </h4>
              <div className="space-y-2">
                {privateReminders.length === 0 ? (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No reminders set
                  </p>
                ) : (
                  privateReminders.map(reminder => (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {reminder.title}
                          </h5>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(reminder.datetime).toLocaleString()}
                          </p>
                        </div>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Images */}
        <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Consultation Images (Instant Attach)
            </h3>
            <Camera className="w-6 h-6 text-green-500" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultationImages.map(image => (
              <div key={image.id} className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <img
                  src={image.image}
                  alt="Consultation"
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {image.patientName}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {image.notes}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(image.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Add New Image */}
            <label className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:bg-gray-700' 
                : 'border-gray-300'
            }`}>
              <Camera className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Attach Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    attachImageToRecord(1, e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroFunctionalities;
