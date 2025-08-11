import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Save, 
  Download, 
  Upload, 
  Camera, 
  Mic, 
  MicOff,
  Play, 
  Pause, 
  Square,
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock, 
  Calendar,
  User,
  Stethoscope,
  Activity,
  Brain,
  Heart,
  Pill,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  Star,
  Printer,
  Mail,
  Share,
  Paperclip,
  Image,
  Video,
  FileAudio,
  FilePdf,
  Signature,
  Shield,
  Lock,
  Unlock,
  Send,
  MessageSquare,
  Archive
} from 'lucide-react';
import { toast } from 'react-toastify';

const MedicalDocumentation = ({ patient, consultation, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('soap');
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [documentTemplate, setDocumentTemplate] = useState('general');
  const [isSigned, setIsSigned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const signaturePadRef = useRef(null);

  const templates = [
    { id: 'general', name: 'General Consultation', icon: Stethoscope },
    { id: 'cardiology', name: 'Cardiology', icon: Heart },
    { id: 'neurology', name: 'Neurology', icon: Brain },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle },
    { id: 'followup', name: 'Follow-up', icon: Clock },
    { id: 'procedure', name: 'Procedure Note', icon: Activity }
  ];

  const icdCodes = [
    { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings' },
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'R06.02', description: 'Shortness of breath' },
    { code: 'R51', description: 'Headache' },
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'R05', description: 'Cough' },
    { code: 'K59.00', description: 'Constipation, unspecified' },
    { code: 'R11.10', description: 'Vomiting, unspecified' }
  ];

  const [selectedIcdCodes, setSelectedIcdCodes] = useState([]);
  const [searchIcd, setSearchIcd] = useState('');

  // Timer for recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    toast.info('Voice recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    const voiceNote = {
      id: Date.now(),
      duration: recordingDuration,
      timestamp: new Date().toISOString(),
      title: `Voice Note ${voiceNotes.length + 1}`
    };
    setVoiceNotes(prev => [...prev, voiceNote]);
    setRecordingDuration(0);
    toast.success('Voice note saved');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const attachment = {
        id: Date.now(),
        name: `Photo_${Date.now()}.jpg`,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
        isPhoto: true
      };
      
      setAttachments(prev => [...prev, attachment]);
      toast.success('Photo captured and attached');
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    toast.info('Attachment removed');
  };

  const toggleIcdCode = (code) => {
    setSelectedIcdCodes(prev => 
      prev.find(c => c.code === code.code)
        ? prev.filter(c => c.code !== code.code)
        : [...prev, code]
    );
  };

  const saveDocument = () => {
    if (!soapNotes.subjective && !soapNotes.objective && !soapNotes.assessment && !soapNotes.plan) {
      toast.error('Please fill in at least one SOAP section');
      return;
    }

    const document = {
      id: Date.now(),
      patient: patient,
      consultation: consultation,
      template: documentTemplate,
      soapNotes: soapNotes,
      icdCodes: selectedIcdCodes,
      attachments: attachments,
      voiceNotes: voiceNotes,
      signatures: signatures,
      isSigned: isSigned,
      isLocked: isLocked,
      createdAt: new Date().toISOString(),
      createdBy: 'Dr. John Smith' // In real app, get from auth
    };

    onSave && onSave(document);
    toast.success('Medical document saved successfully');
  };

  const lockDocument = () => {
    setIsLocked(true);
    toast.success('Document locked - no further edits allowed');
  };

  const signDocument = () => {
    setIsSigned(true);
    const signature = {
      id: Date.now(),
      signedBy: 'Dr. John Smith',
      signedAt: new Date().toISOString(),
      ipAddress: '192.168.1.1' // In real app, get actual IP
    };
    setSignatures(prev => [...prev, signature]);
    toast.success('Document digitally signed');
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5" />;
    if (type.includes('pdf')) return <FilePdf className="w-5 h-5" />;
    return <Paperclip className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'soap', name: 'SOAP Notes', icon: FileText },
    { id: 'codes', name: 'ICD Codes', icon: Activity },
    { id: 'attachments', name: 'Attachments', icon: Paperclip },
    { id: 'voice', name: 'Voice Notes', icon: Mic },
    { id: 'signatures', name: 'Signatures', icon: Signature }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Medical Documentation</h2>
              <p className="text-indigo-100">
                Patient: {patient?.name} | Date: {new Date().toLocaleDateString()} | 
                Template: {templates.find(t => t.id === documentTemplate)?.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isLocked && (
                <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Locked</span>
                </div>
              )}
              {isSigned && (
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <Signature className="w-4 h-4" />
                  <span className="text-sm">Signed</span>
                </div>
              )}
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
          {/* Sidebar - Templates & Quick Actions */}
          <div className="w-1/4 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Document Templates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Document Templates</h3>
                <div className="space-y-2">
                  {templates.map(template => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setDocumentTemplate(template.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          documentTemplate === template.id
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{template.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLocked}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Upload Files</span>
                  </button>
                  
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isLocked}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Take Photo</span>
                  </button>
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLocked}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left disabled:opacity-50 ${
                      isRecording ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-500" />}
                    <span className="text-sm">
                      {isRecording ? `Recording ${formatTime(recordingDuration)}` : 'Voice Note'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {patient?.name}</div>
                  <div><span className="font-medium">Age:</span> {patient?.age}</div>
                  <div><span className="font-medium">Gender:</span> {patient?.gender}</div>
                  <div><span className="font-medium">Allergies:</span> {patient?.allergies?.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
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
                {/* SOAP Notes */}
                {activeTab === 'soap' && (
                  <motion.div
                    key="soap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6">
                      {/* Subjective */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Subjective (Patient's History & Symptoms)
                        </label>
                        <textarea
                          value={soapNotes.subjective}
                          onChange={(e) => setSoapNotes(prev => ({ ...prev, subjective: e.target.value }))}
                          disabled={isLocked}
                          placeholder="Patient reports... Chief complaint... History of present illness... Review of systems..."
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      {/* Objective */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Objective (Physical Examination & Findings)
                        </label>
                        <textarea
                          value={soapNotes.objective}
                          onChange={(e) => setSoapNotes(prev => ({ ...prev, objective: e.target.value }))}
                          disabled={isLocked}
                          placeholder="Vital signs... Physical examination findings... Laboratory results... Diagnostic test results..."
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      {/* Assessment */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Assessment (Diagnosis & Clinical Reasoning)
                        </label>
                        <textarea
                          value={soapNotes.assessment}
                          onChange={(e) => setSoapNotes(prev => ({ ...prev, assessment: e.target.value }))}
                          disabled={isLocked}
                          placeholder="Primary diagnosis... Differential diagnosis... Clinical impression... Prognosis..."
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      {/* Plan */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Plan (Treatment & Follow-up)
                        </label>
                        <textarea
                          value={soapNotes.plan}
                          onChange={(e) => setSoapNotes(prev => ({ ...prev, plan: e.target.value }))}
                          disabled={isLocked}
                          placeholder="Treatment plan... Medications prescribed... Follow-up instructions... Patient education... Referrals..."
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ICD Codes */}
                {activeTab === 'codes' && (
                  <motion.div
                    key="codes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">ICD-10 Diagnosis Codes</h3>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search ICD codes..."
                          value={searchIcd}
                          onChange={(e) => setSearchIcd(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Selected Codes */}
                    {selectedIcdCodes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Selected Codes:</h4>
                        <div className="space-y-2">
                          {selectedIcdCodes.map(code => (
                            <div key={code.code} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                              <div>
                                <span className="font-medium text-indigo-800">{code.code}</span>
                                <span className="ml-3 text-indigo-700">{code.description}</span>
                              </div>
                              <button
                                onClick={() => toggleIcdCode(code)}
                                disabled={isLocked}
                                className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Codes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Available Codes:</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {icdCodes
                          .filter(code => 
                            code.code.toLowerCase().includes(searchIcd.toLowerCase()) ||
                            code.description.toLowerCase().includes(searchIcd.toLowerCase())
                          )
                          .map(code => (
                            <button
                              key={code.code}
                              onClick={() => toggleIcdCode(code)}
                              disabled={isLocked || selectedIcdCodes.find(c => c.code === code.code)}
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <div className="font-medium text-gray-900">{code.code}</div>
                              <div className="text-sm text-gray-600">{code.description}</div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Attachments */}
                {activeTab === 'attachments' && (
                  <motion.div
                    key="attachments"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Attached Files</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLocked}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                          Upload Files
                        </button>
                        <button
                          onClick={() => cameraInputRef.current?.click()}
                          disabled={isLocked}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          Take Photo
                        </button>
                      </div>
                    </div>

                    {attachments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attachments.map(attachment => (
                          <div key={attachment.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  {getFileIcon(attachment.type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 truncate">{attachment.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {!isLocked && (
                                <button
                                  onClick={() => removeAttachment(attachment.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            {attachment.isPhoto && (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No attachments yet</p>
                        <p className="text-sm text-gray-400">Upload files or take photos to attach to this consultation</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Voice Notes */}
                {activeTab === 'voice' && (
                  <motion.div
                    key="voice"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Voice Notes</h3>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isLocked}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg disabled:opacity-50 transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>{isRecording ? `Stop Recording (${formatTime(recordingDuration)})` : 'Start Recording'}</span>
                      </button>
                    </div>

                    {voiceNotes.length > 0 ? (
                      <div className="space-y-4">
                        {voiceNotes.map(note => (
                          <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Mic className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{note.title}</h4>
                                  <p className="text-sm text-gray-500">
                                    Duration: {formatTime(note.duration)} • {new Date(note.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                  <Play className="w-4 h-4" />
                                </button>
                                {!isLocked && (
                                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No voice notes recorded</p>
                        <p className="text-sm text-gray-400">Record voice notes during consultation for quick documentation</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Signatures */}
                {activeTab === 'signatures' && (
                  <motion.div
                    key="signatures"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Digital Signatures</h3>
                      {!isSigned && !isLocked && (
                        <button
                          onClick={signDocument}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Sign Document
                        </button>
                      )}
                    </div>

                    {signatures.length > 0 ? (
                      <div className="space-y-4">
                        {signatures.map(signature => (
                          <div key={signature.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Signature className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-green-800">Digitally Signed</h4>
                                <p className="text-sm text-green-700">
                                  By: {signature.signedBy} • {new Date(signature.signedAt).toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600">IP: {signature.ipAddress}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Signature className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Document not signed</p>
                        <p className="text-sm text-gray-400">Digital signature required to finalize this document</p>
                      </div>
                    )}
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
              <button
                onClick={() => toast.info('Sent via email')}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              
              <button
                onClick={() => toast.info('Downloading PDF...')}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              
              <button
                onClick={() => toast.info('Printing document...')}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isLocked && !isSigned && (
                <button
                  onClick={lockDocument}
                  className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Document</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={saveDocument}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </motion.div>
    </div>
  );
};

export default MedicalDocumentation;
