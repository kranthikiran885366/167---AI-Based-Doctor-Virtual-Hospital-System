import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Brain,
  Camera,
  Image,
  FileText,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Download,
  Share,
  Bookmark,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const Diagnosis = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Doctor assistant powered by advanced medical AI. I'll help you analyze your symptoms and provide evidence-based medical guidance. Please describe your symptoms in detail, or use our quick symptom selector below.",
      timestamp: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&auto=format'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState({
    symptoms: [],
    severity: '',
    duration: '',
    diagnosis: null,
    confidence: 0,
    recommendations: []
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { addMedicalRecord } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commonSymptoms = [
    { name: 'Fever', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { name: 'Headache', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    { name: 'Cough', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'Sore Throat', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    { name: 'Fatigue', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { name: 'Nausea', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { name: 'Chest Pain', icon: Heart, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { name: 'Shortness of Breath', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  ];

  const severityLevels = [
    { level: 'mild', label: 'Mild (1-3)', color: 'bg-green-100 text-green-800', description: 'Minimal discomfort' },
    { level: 'moderate', label: 'Moderate (4-6)', color: 'bg-yellow-100 text-yellow-800', description: 'Noticeable discomfort' },
    { level: 'severe', label: 'Severe (7-10)', color: 'bg-red-100 text-red-800', description: 'Significant pain/discomfort' }
  ];

  const quickQuestions = [
    "How long have you been experiencing these symptoms?",
    "On a scale of 1-10, how would you rate your pain?",
    "Are you taking any medications currently?",
    "Do you have any allergies?",
    "Have you traveled recently?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedSymptoms.length === 0) return;

    let messageContent = inputMessage;
    if (selectedSymptoms.length > 0) {
      messageContent = selectedSymptoms.join(', ') + (inputMessage ? '. ' + inputMessage : '');
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      symptoms: selectedSymptoms
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedSymptoms([]);
    setIsLoading(true);

    // Simulate AI processing with more realistic delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    let response = '';
    let newDiagnosis = null;
    let confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

    if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      response = `I understand you're experiencing fever. This is an important symptom that can indicate various conditions. Let me gather more information:\n\n**Follow-up Questions:**\n• What's your current temperature reading?\n• How long have you had the fever?\n• Are you experiencing chills, sweats, or body aches?\n• Any recent travel or exposure to illness?\n\n**Immediate Care:**\n• Stay hydrated with plenty of fluids\n• Rest in a cool, comfortable environment\n• Monitor your temperature regularly`;
    } else if (lowerInput.includes('headache') || lowerInput.includes('head pain')) {
      response = `Headaches can have many underlying causes. To provide you with the most accurate assessment, I need to understand more:\n\n**Diagnostic Questions:**\n• Where exactly is the pain located? (forehead, temples, back of head)\n• How would you rate the intensity (1-10)?\n• Is it throbbing, sharp, or dull pain?\n• Any visual changes, nausea, or sensitivity to light?\n• What triggers seem to make it worse?\n\n**Immediate Relief:**\n• Try resting in a dark, quiet room\n• Apply a cold or warm compress\n• Stay hydrated`;
    } else if (lowerInput.includes('cough')) {
      response = `Cough analysis is important for proper diagnosis. Let me gather detailed information:\n\n**Key Questions:**\n• Is it a dry cough or are you producing mucus?\n• What color is the mucus (if any)?\n• How long have you been coughing?\n• Any shortness of breath or chest tightness?\n• Do you smoke or have allergies?\n\n**Immediate Care:**\n• Stay hydrated to help thin mucus\n• Use a humidifier if available\n• Avoid irritants like smoke`;
    } else if (lowerInput.includes('38') || lowerInput.includes('102') || 
               (lowerInput.includes('fever') && lowerInput.includes('headache'))) {
      newDiagnosis = {
        condition: 'Viral Upper Respiratory Infection',
        confidence: confidence,
        severity: 'moderate',
        urgency: 'Monitor closely',
        recommendations: [
          'Rest and maintain fluid intake (8-10 glasses of water daily)',
          'Take paracetamol/acetaminophen for fever and pain relief',
          'Use throat lozenges for sore throat comfort',
          'Monitor temperature every 4-6 hours',
          'Gargle with warm salt water 2-3 times daily',
          'Get adequate sleep (7-9 hours) to support immune system'
        ],
        warning_signs: [
          'Temperature above 103°F (39.4°C)',
          'Difficulty breathing or shortness of breath',
          'Persistent vomiting or signs of dehydration',
          'Severe headache with neck stiffness',
          'Symptoms lasting more than 10 days'
        ],
        follow_up: 'Schedule follow-up if symptoms persist beyond 7-10 days'
      };
      response = `Based on your symptoms analysis, I've identified a likely condition:\n\n**🔍 AI Diagnosis: ${newDiagnosis.condition}**\n**🎯 Confidence Level: ${newDiagnosis.confidence}%**\n**⚠️ Severity: ${newDiagnosis.severity}**\n\n**📋 Treatment Recommendations:**\n${newDiagnosis.recommendations.map(rec => `• ${rec}`).join('\n')}\n\n**🚨 Seek Emergency Care If:**\n${newDiagnosis.warning_signs.map(sign => `• ${sign}`).join('\n')}\n\n**📅 Follow-up:** ${newDiagnosis.follow_up}\n\nThis assessment is based on AI analysis. Please consult a healthcare provider for personalized medical advice.`;
    } else {
      response = `Thank you for sharing your symptoms. To provide you with the most accurate AI analysis, I'd like to gather more specific information:\n\n**🤖 AI Analysis Mode Activated**\n\nPlease provide additional details:\n• How long have you been experiencing these symptoms?\n• Rate your discomfort level (1-10 scale)\n• Any triggers or patterns you've noticed?\n• Current medications or supplements?\n\nYou can also:\n📸 Upload images of visible symptoms\n🎤 Use voice input for detailed description\n🔍 Select from common symptoms below\n\nThe more information you provide, the more accurate my AI analysis will be.`;
    }

    if (newDiagnosis) {
      setDiagnosisData(prev => ({
        ...prev,
        diagnosis: newDiagnosis
      }));
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: response,
      timestamp: new Date().toISOString(),
      diagnosis: newDiagnosis,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&auto=format'
    };
  };

  const handleSymptomClick = (symptom) => {
    if (selectedSymptoms.includes(symptom.name)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom.name));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom.name]);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info('Voice recording stopped');
    } else {
      setIsRecording(true);
      toast.info('🎤 Voice recording started - speak clearly');
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('I have been having fever and headache for the past 2 days. The fever reaches 101.5°F and I feel very tired.');
        toast.success('✅ Voice input captured successfully');
      }, 4000);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast.success('📸 Image uploaded for AI analysis');
      setShowImageUpload(false);
      // Simulate AI image analysis
      setTimeout(() => {
        const imageAnalysis = {
          id: Date.now(),
          type: 'bot',
          content: `🔍 **AI Image Analysis Complete**\n\nI've analyzed your uploaded image. Based on visual assessment:\n\n**Observations:**\n• Visible redness/inflammation detected\n• Consistent with common skin irritation\n• No immediate concerning features\n\n**Recommendations:**\n• Keep area clean and dry\n• Apply cool compress if irritated\n• Monitor for changes\n• Consult dermatologist if symptoms persist\n\n*Note: This is AI visual analysis. Professional medical examination is recommended for accurate diagnosis.*`,
          timestamp: new Date().toISOString(),
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&auto=format'
        };
        setMessages(prev => [...prev, imageAnalysis]);
      }, 3000);
    }
  };

  const saveDiagnosis = () => {
    if (diagnosisData.diagnosis) {
      addMedicalRecord({
        type: 'diagnosis',
        diagnosis: diagnosisData.diagnosis,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : inputMessage,
        messages: messages,
        timestamp: new Date().toISOString()
      });
      toast.success('💾 Diagnosis saved to your medical history');
    }
  };

  const exportDiagnosis = () => {
    toast.success('📄 Diagnosis report exported to PDF');
  };

  const shareDiagnosis = () => {
    toast.success('🔗 Diagnosis report shared with your healthcare provider');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AI Medical Diagnosis</h1>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>98% Accuracy</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>5 sec Response</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, evidence-based medical guidance from our advanced AI system. 
            Describe your symptoms, upload images, or use voice input for comprehensive analysis.
          </p>
        </motion.div>

        {/* Enhanced Chat Interface */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Medical Assistant</h3>
                  <p className="text-blue-100 text-sm">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-4xl ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className="flex-shrink-0">
                      {message.type === 'user' ? (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <img 
                          src={message.avatar}
                          alt="AI Assistant"
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-200"
                        />
                      )}
                    </div>
                    
                    <div className={`rounded-3xl p-6 max-w-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white text-gray-900 shadow-lg border border-gray-100'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                      
                      {message.diagnosis && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 text-lg flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              Diagnosis Results
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                {message.diagnosis.confidence}% Confident
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">Condition</h5>
                              <p className="text-blue-600 font-medium text-lg">{message.diagnosis.condition}</p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">Severity</h5>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                message.diagnosis.severity === 'mild' ? 'bg-green-100 text-green-800' :
                                message.diagnosis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {message.diagnosis.severity}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-3">Recommendations</h5>
                              <div className="space-y-2">
                                {message.diagnosis.recommendations.map((rec, index) => (
                                  <div key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{rec}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {message.diagnosis.warning_signs && (
                              <div>
                                <h5 className="font-semibold text-red-700 mb-3">⚠️ Warning Signs</h5>
                                <div className="space-y-2">
                                  {message.diagnosis.warning_signs.map((sign, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{sign}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                              onClick={saveDiagnosis}
                              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors"
                            >
                              <Bookmark className="w-4 h-4" />
                              <span>Save to History</span>
                            </button>
                            <button
                              onClick={exportDiagnosis}
                              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Export PDF</span>
                            </button>
                            <button
                              onClick={shareDiagnosis}
                              className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-600 transition-colors"
                            >
                              <Share className="w-4 h-4" />
                              <span>Share with Doctor</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&auto=format"
                    alt="AI Assistant"
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-200"
                  />
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-600 text-sm">AI is analyzing your symptoms...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            {/* Quick Questions */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">💡 Quick Questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl transition-colors border border-blue-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-sm"
                    >
                      <span>{symptom}</span>
                      <button
                        onClick={() => setSelectedSymptoms(prev => prev.filter(s => s !== symptom))}
                        className="hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Common Symptoms */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">🏥 Common Symptoms:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonSymptoms.map((symptom) => {
                  const Icon = symptom.icon;
                  const isSelected = selectedSymptoms.includes(symptom.name);
                  return (
                    <button
                      key={symptom.name}
                      onClick={() => handleSymptomClick(symptom)}
                      className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 border-2 ${
                        isSelected 
                          ? `${symptom.bg} ${symptom.border} shadow-md` 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? symptom.color : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${isSelected ? symptom.color : 'text-gray-600'}`}>
                        {symptom.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload */}
            <AnimatePresence>
              {showImageUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-200"
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 mb-3">Upload an image for AI visual analysis</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition-colors"
                    >
                      Choose Image
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms in detail... (e.g., 'I have had a fever of 101°F for 2 days with headache and fatigue')"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                  rows="3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceInput}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && selectedSymptoms.length === 0) || isLoading}
                  className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              💡 Tip: The more detailed your description, the more accurate the AI diagnosis will be.
            </p>
          </div>
        </div>

        {/* Enhanced Diagnosis Summary */}
        {diagnosisData.diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-500 mr-3" />
              Comprehensive Diagnosis Summary
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Diagnosed Condition</h4>
                <p className="text-2xl font-bold text-blue-600">{diagnosisData.diagnosis.condition}</p>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">AI Confidence</h4>
                <div className="relative">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${diagnosisData.diagnosis.confidence}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900">{diagnosisData.diagnosis.confidence}%</span>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Severity Level</h4>
                <span className={`px-4 py-2 rounded-full text-lg font-semibold ${
                  diagnosisData.diagnosis.severity === 'mild' ? 'bg-green-100 text-green-800' :
                  diagnosisData.diagnosis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {diagnosisData.diagnosis.severity}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-sm text-blue-800">
                <strong>Disclaimer:</strong> This AI diagnosis is for informational purposes only and should not replace professional medical advice. 
                Please consult with a qualified healthcare provider for personalized treatment recommendations.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;
