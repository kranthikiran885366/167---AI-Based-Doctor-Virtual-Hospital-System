import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Moon,
  Sun,
  Coffee,
  Bookmark,
  Pin,
  Camera,
  Image,
  Upload,
  Download,
  Volume2,
  VolumeX,
  Globe,
  Languages,
  Bell,
  BellOff,
  Pause,
  Play,
  Settings,
  Clock,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Plus,
  Minus,
  Edit,
  Trash2,
  Send,
  Share,
  Copy,
  Wifi,
  WifiOff,
  Zap,
  Target,
  Activity,
  User,
  Users,
  MessageSquare,
  FileText,
  Folder,
  Archive,
  Star,
  Heart,
  Flag,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Speaker,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';

const MicroFunctionalityHub = ({ isDarkMode, setIsDarkMode, isOfflineMode, setIsOfflineMode }) => {
  // Voice Notes
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Private Reminders
  const [reminders, setReminders] = useState([
    {
      id: 1,
      text: 'Call patient in 2 weeks for follow-up',
      dueDate: '2024-02-01T10:00:00',
      priority: 'high',
      completed: false,
      patientId: 'P001',
      type: 'follow-up'
    },
    {
      id: 2,
      text: 'Review lab results for Maria Garcia',
      dueDate: '2024-01-18T14:00:00',
      priority: 'urgent',
      completed: false,
      patientId: 'P002',
      type: 'review'
    }
  ]);

  // Pinned Cases
  const [pinnedCases, setPinnedCases] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      priority: 'high',
      chiefComplaint: 'Chest pain',
      lastUpdate: '2024-01-15T14:30:00',
      isPinned: true
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      priority: 'urgent',
      chiefComplaint: 'Severe headache',
      lastUpdate: '2024-01-15T16:45:00',
      isPinned: true
    }
  ]);

  // Break Mode
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(15);
  const [breakTimer, setBreakTimer] = useState(0);
  const [breakReason, setBreakReason] = useState('');

  // Sound Settings
  const [soundSettings, setSoundSettings] = useState({
    newConsultAlert: true,
    emergencyAlert: true,
    reminderSound: true,
    messageSound: true,
    volume: 75,
    customSounds: false
  });

  // Language & Translation
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState([]);

  // Quick Capture
  const [recentCaptures, setRecentCaptures] = useState([]);
  const fileInputRef = useRef(null);

  // Offline Mode
  const [offlineData, setOfflineData] = useState({
    consultations: [],
    notes: [],
    prescriptions: [],
    lastSync: null
  });

  // Color Themes
  const [colorTheme, setColorTheme] = useState('blue');
  const colorThemes = {
    blue: { primary: 'blue-500', secondary: 'blue-100' },
    green: { primary: 'green-500', secondary: 'green-100' },
    purple: { primary: 'purple-500', secondary: 'purple-100' },
    red: { primary: 'red-500', secondary: 'red-100' },
    orange: { primary: 'orange-500', secondary: 'orange-100' }
  };

  // Languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Initialize break timer
  useEffect(() => {
    let interval;
    if (isOnBreak && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            setIsOnBreak(false);
            toast.info('Break time is over!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakTimer]);

  // Voice Note Functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        const newVoiceNote = {
          id: Date.now(),
          audioUrl,
          transcript: currentNote,
          duration: recordingDuration,
          timestamp: new Date().toISOString(),
          patientCase: null
        };
        
        setVoiceNotes(prev => [...prev, newVoiceNote]);
        setCurrentNote('');
        setRecordingDuration(0);
        toast.success('Voice note saved');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast.error('Could not access microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
    }
  };

  const addReminder = (text, dueDate, priority = 'normal', patientId = null) => {
    const newReminder = {
      id: Date.now(),
      text,
      dueDate,
      priority,
      completed: false,
      patientId,
      type: 'custom',
      createdAt: new Date().toISOString()
    };
    
    setReminders(prev => [...prev, newReminder]);
    toast.success('Reminder added');
  };

  const toggleReminderComplete = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted');
  };

  const togglePinCase = (caseId) => {
    setPinnedCases(prev => 
      prev.map(case_ => 
        case_.id === caseId 
          ? { ...case_, isPinned: !case_.isPinned }
          : case_
      )
    );
  };

  const startBreak = (duration, reason = '') => {
    setIsOnBreak(true);
    setBreakDuration(duration);
    setBreakTimer(duration * 60); // Convert to seconds
    setBreakReason(reason);
    toast.info(`Break mode activated for ${duration} minutes`);
  };

  const endBreak = () => {
    setIsOnBreak(false);
    setBreakTimer(0);
    toast.success('Break ended - you\'re back online');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
    toast.success(`${!isDarkMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const captureImage = async () => {
    try {
      // This would typically use camera API
      const capture = {
        id: Date.now(),
        type: 'camera',
        timestamp: new Date().toISOString(),
        filename: `capture_${Date.now()}.jpg`,
        patientCase: null
      };
      
      setRecentCaptures(prev => [...prev, capture]);
      toast.success('Image captured');
    } catch (error) {
      toast.error('Failed to capture image');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const capture = {
        id: Date.now(),
        type: 'upload',
        timestamp: new Date().toISOString(),
        filename: file.name,
        size: file.size,
        fileType: file.type,
        patientCase: null
      };
      
      setRecentCaptures(prev => [...prev, capture]);
      toast.success('File uploaded');
    }
  };

  const translateMessage = async (text, targetLang) => {
    // Simulate translation API call
    const translated = {
      id: Date.now(),
      original: text,
      translated: `[${targetLang.toUpperCase()}] ${text}`,
      sourceLang: currentLanguage,
      targetLang,
      timestamp: new Date().toISOString()
    };
    
    setTranslatedMessages(prev => [...prev, translated]);
    toast.success('Message translated');
    return translated.translated;
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    if (!isOfflineMode) {
      toast.warning('Offline mode enabled - data will sync when back online');
    } else {
      toast.success('Back online - syncing data...');
      // Simulate sync
      setTimeout(() => {
        setOfflineData(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        toast.success('Data synced successfully');
      }, 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Voice Notes */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Voice Notes
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-700 text-sm font-medium">
                Recording... {formatTime(recordingDuration)}
              </span>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add notes while recording..."
              className="w-full mt-2 p-2 border border-red-200 rounded-lg resize-none text-sm"
              rows="2"
            />
          </div>
        )}

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {voiceNotes.slice(-5).map(note => (
            <div key={note.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {new Date(note.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-xs text-gray-500">{formatTime(note.duration)}</span>
              </div>
              {note.transcript && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {note.transcript}
                </p>
              )}
              <audio controls className="w-full mt-2" src={note.audioUrl} />
            </div>
          ))}
        </div>
      </div>

      {/* Private Reminders */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Private Reminders
          </h3>
          <button
            onClick={() => {
              const text = prompt('Reminder text:');
              const date = prompt('Due date (YYYY-MM-DD HH:MM):');
              if (text && date) {
                addReminder(text, new Date(date).toISOString(), 'normal');
              }
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {reminders.filter(r => !r.completed).map(reminder => (
            <div key={reminder.id} className={`p-3 rounded-lg border-l-4 ${
              reminder.priority === 'urgent' ? 'border-red-500 bg-red-50' :
              reminder.priority === 'high' ? 'border-orange-500 bg-orange-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{reminder.text}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(reminder.dueDate).toLocaleString()}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                    {reminder.priority}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleReminderComplete(reminder.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Cases */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pinned Cases
          </h3>
          <Pin className="w-5 h-5 text-yellow-500" />
        </div>

        <div className="space-y-3">
          {pinnedCases.filter(c => c.isPinned).map(case_ => (
            <div key={case_.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {case_.patientName}
                </h4>
                <button
                  onClick={() => togglePinCase(case_.id)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {case_.chiefComplaint}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                  {case_.priority}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(case_.lastUpdate).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Break Mode */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Break Mode
          </h3>
          <Coffee className="w-5 h-5 text-orange-500" />
        </div>

        {isOnBreak ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <Coffee className="w-10 h-10 text-orange-500" />
            </div>
            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              On Break
            </p>
            <p className="text-2xl font-bold text-orange-500 mb-2">
              {formatTime(breakTimer)}
            </p>
            {breakReason && (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {breakReason}
              </p>
            )}
            <button
              onClick={endBreak}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              End Break
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startBreak(15, 'Coffee break')}
                className="p-3 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors text-sm"
              >
                15 min Break
              </button>
              <button
                onClick={() => startBreak(30, 'Lunch break')}
                className="p-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                30 min Break
              </button>
            </div>
            <button
              onClick={() => {
                const duration = prompt('Break duration (minutes):');
                const reason = prompt('Reason (optional):');
                if (duration) startBreak(parseInt(duration), reason || '');
              }}
              className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Custom Break
            </button>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
              Temporarily pause new consultation requests
            </p>
          </div>
        )}
      </div>

      {/* Dark Mode & Themes */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appearance
          </h3>
          <Palette className="w-5 h-5 text-purple-500" />
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Dark Mode
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Color Themes */}
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Color Theme
            </p>
            <div className="flex space-x-2">
              {Object.entries(colorThemes).map(([theme, colors]) => (
                <button
                  key={theme}
                  onClick={() => setColorTheme(theme)}
                  className={`w-8 h-8 rounded-full bg-${colors.primary} ${
                    colorTheme === theme ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language & Translation */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Language
          </h3>
          <Languages className="w-5 h-5 text-green-500" />
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Interface Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Auto-translate messages
            </span>
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`w-12 h-6 rounded-full transition-colors ${
                autoTranslate ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                autoTranslate ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <button
            onClick={() => translateMessage('Hello, how are you feeling today?', 'es')}
            className="w-full p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
          >
            Test Translation
          </button>
        </div>
      </div>

      {/* Quick Capture */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Capture
          </h3>
          <Camera className="w-5 h-5 text-blue-500" />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={captureImage}
              className="flex items-center justify-center space-x-2 p-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm">Camera</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 p-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx"
          />

          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentCaptures.slice(-3).map(capture => (
              <div key={capture.id} className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2">
                  {capture.type === 'camera' ? (
                    <Camera className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Upload className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {capture.filename}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(capture.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sound Alerts
          </h3>
          <Volume2 className="w-5 h-5 text-purple-500" />
        </div>

        <div className="space-y-3">
          {Object.entries(soundSettings).map(([key, value]) => {
            if (key === 'volume') {
              return (
                <div key={key}>
                  <label className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Volume: {value}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setSoundSettings(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              );
            }
            
            if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <button
                    onClick={() => setSoundSettings(prev => ({ ...prev, [key]: !value }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>

      {/* Offline Mode */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Offline Mode
          </h3>
          {isOfflineMode ? <WifiOff className="w-5 h-5 text-red-500" /> : <Wifi className="w-5 h-5 text-green-500" />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Work offline
              </p>
              <p className="text-xs text-gray-500">
                Store data locally and sync later
              </p>
            </div>
            <button
              onClick={toggleOfflineMode}
              className={`w-12 h-6 rounded-full transition-colors ${
                isOfflineMode ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                isOfflineMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {isOfflineMode && (
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Offline Mode Active</span>
              </div>
              <p className="text-xs text-yellow-700">
                {offlineData.consultations.length} consultations stored locally
              </p>
              {offlineData.lastSync && (
                <p className="text-xs text-yellow-600 mt-1">
                  Last sync: {new Date(offlineData.lastSync).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroFunctionalityHub;
