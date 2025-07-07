import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Brain
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const Diagnosis = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Doctor assistant. I'll help you analyze your symptoms and provide medical guidance. Please describe your symptoms in detail.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('symptoms');
  const [diagnosisData, setDiagnosisData] = useState({
    symptoms: [],
    severity: '',
    duration: '',
    diagnosis: null,
    confidence: 0,
    recommendations: []
  });

  const { addMedicalRecord } = useUser();

  const commonSymptoms = [
    { name: 'Fever', icon: Thermometer, color: 'text-red-500' },
    { name: 'Headache', icon: Brain, color: 'text-purple-500' },
    { name: 'Cough', icon: Activity, color: 'text-blue-500' },
    { name: 'Sore Throat', icon: Heart, color: 'text-green-500' },
    { name: 'Fatigue', icon: Clock, color: 'text-yellow-500' },
    { name: 'Nausea', icon: AlertTriangle, color: 'text-orange-500' }
  ];

  const severityLevels = [
    { level: 'mild', label: 'Mild', color: 'bg-green-100 text-green-800' },
    { level: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
    { level: 'severe', label: 'Severe', color: 'bg-red-100 text-red-800' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    let response = '';
    let newDiagnosis = null;

    if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      response = "I understand you're experiencing fever. This could indicate various conditions. Can you tell me:\n\n• What's your current temperature?\n• How long have you had the fever?\n• Any other symptoms like headache, body aches, or chills?";
    } else if (lowerInput.includes('headache') || lowerInput.includes('head pain')) {
      response = "Headaches can have many causes. To help with diagnosis:\n\n• Where exactly is the pain located?\n• How would you rate the pain (1-10)?\n• Are you experiencing any nausea or sensitivity to light?";
    } else if (lowerInput.includes('cough')) {
      response = "A cough can be concerning. Please tell me:\n\n• Is it a dry cough or are you producing mucus?\n• How long have you been coughing?\n• Any shortness of breath or chest pain?";
    } else if (lowerInput.includes('38') || lowerInput.includes('102')) {
      newDiagnosis = {
        condition: 'Viral Infection',
        confidence: 85,
        severity: 'moderate',
        recommendations: [
          'Rest and stay hydrated',
          'Take paracetamol for fever reduction',
          'Monitor temperature regularly',
          'Seek medical attention if symptoms worsen'
        ]
      };
      response = `Based on your symptoms, I suspect you may have a **Viral Infection** (85% confidence).\n\n**Immediate Recommendations:**\n• Rest and stay hydrated\n• Take paracetamol for fever reduction\n• Monitor temperature regularly\n• Seek medical attention if symptoms worsen\n\n**When to seek emergency care:**\n• Temperature above 103°F (39.4°C)\n• Difficulty breathing\n• Severe dehydration\n• Symptoms lasting more than 7 days`;
    } else {
      response = "I understand your concern. Could you provide more specific details about your symptoms? This will help me give you a more accurate assessment. You can also select from the common symptoms below or use the voice input feature.";
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
      diagnosis: newDiagnosis
    };
  };

  const handleSymptomClick = (symptom) => {
    setInputMessage(prev => prev + (prev ? ', ' : '') + symptom.name);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info('Voice recording stopped');
    } else {
      setIsRecording(true);
      toast.info('Voice recording started - speak now');
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('I have been having fever and headache for the past 2 days');
        toast.success('Voice input captured');
      }, 3000);
    }
  };

  const saveDiagnosis = () => {
    if (diagnosisData.diagnosis) {
      addMedicalRecord({
        type: 'diagnosis',
        diagnosis: diagnosisData.diagnosis,
        symptoms: inputMessage,
        messages: messages,
        timestamp: new Date().toISOString()
      });
      toast.success('Diagnosis saved to your medical history');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Medical Diagnosis</h1>
          <p className="text-gray-600">
            Describe your symptoms and get instant medical guidance from our AI system
          </p>
        </motion.div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    {message.diagnosis && (
                      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Diagnosis Result</h4>
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                            {message.diagnosis.confidence}% confident
                          </span>
                        </div>
                        <p className="text-blue-600 font-medium mb-2">{message.diagnosis.condition}</p>
                        <div className="space-y-1">
                          {message.diagnosis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{rec}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={saveDiagnosis}
                          className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Save to Medical History
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            {/* Common Symptoms */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Common Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => {
                  const Icon = symptom.icon;
                  return (
                    <button
                      key={symptom.name}
                      onClick={() => handleSymptomClick(symptom)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className={`w-4 h-4 ${symptom.color}`} />
                      <span className="text-sm">{symptom.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis Summary */}
        {diagnosisData.diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnosis Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Condition</h4>
                <p className="text-blue-600 font-medium">{diagnosisData.diagnosis.condition}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Confidence Level</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${diagnosisData.diagnosis.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{diagnosisData.diagnosis.confidence}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;