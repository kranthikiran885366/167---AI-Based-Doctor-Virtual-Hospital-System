import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  Activity,
  Thermometer,
  Brain,
  Zap,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  InteractiveButton,
  PageNavigation,
  InteractiveCard
} from '../components/EnhancedNavigation.jsx';
import {
  InteractiveTooltip,
  SuccessAnimation
} from '../components/InteractiveFeatures.jsx';

const Emergency = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [location, setLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const emergencyTypes = [
    {
      id: 'heart_attack',
      title: 'Heart Attack',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      urgency: 'critical',
      description: 'Chest pain, shortness of breath, nausea'
    },
    {
      id: 'choking',
      title: 'Choking',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      urgency: 'critical',
      description: 'Cannot breathe, speak, or cough'
    },
    {
      id: 'seizure',
      title: 'Seizure',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      urgency: 'high',
      description: 'Uncontrolled shaking, loss of consciousness'
    },
    {
      id: 'severe_bleeding',
      title: 'Severe Bleeding',
      icon: Zap,
      color: 'from-red-600 to-red-700',
      urgency: 'critical',
      description: 'Heavy bleeding that won\'t stop'
    },
    {
      id: 'burns',
      title: 'Burns',
      icon: Thermometer,
      color: 'from-yellow-500 to-orange-500',
      urgency: 'high',
      description: 'Severe burns from heat, chemicals, or electricity'
    },
    {
      id: 'poisoning',
      title: 'Poisoning',
      icon: Shield,
      color: 'from-green-600 to-green-700',
      urgency: 'critical',
      description: 'Ingested harmful substances'
    }
  ];

  const emergencyGuides = {
    heart_attack: {
      title: 'Heart Attack Emergency Response',
      steps: [
        {
          title: 'Call Emergency Services',
          instruction: 'Call 108 (India) or your local emergency number immediately',
          duration: null,
          critical: true
        },
        {
          title: 'Keep Person Calm',
          instruction: 'Help the person sit down and stay calm. Loosen tight clothing.',
          duration: null,
          critical: false
        },
        {
          title: 'Give Aspirin (if available)',
          instruction: 'If the person is conscious and not allergic, give 1 aspirin to chew',
          duration: null,
          critical: false
        },
        {
          title: 'Monitor Breathing',
          instruction: 'Check if the person is breathing normally. Be ready to perform CPR.',
          duration: null,
          critical: true
        },
        {
          title: 'CPR if Needed',
          instruction: 'If person becomes unconscious and stops breathing, start CPR',
          duration: 30,
          critical: true
        }
      ]
    },
    choking: {
      title: 'Choking Emergency Response',
      steps: [
        {
          title: 'Assess the Situation',
          instruction: 'Ask "Are you choking?" If they can\'t speak, cough, or breathe, act immediately',
          duration: null,
          critical: true
        },
        {
          title: 'Back Blows',
          instruction: 'Give 5 sharp back blows between shoulder blades with heel of hand',
          duration: 10,
          critical: true
        },
        {
          title: 'Abdominal Thrusts',
          instruction: 'Give 5 abdominal thrusts (Heimlich maneuver) upward and inward',
          duration: 10,
          critical: true
        },
        {
          title: 'Repeat Cycle',
          instruction: 'Continue alternating 5 back blows and 5 abdominal thrusts',
          duration: null,
          critical: true
        },
        {
          title: 'Call for Help',
          instruction: 'If object doesn\'t dislodge after 3 cycles, call 108 immediately',
          duration: null,
          critical: true
        }
      ]
    },
    seizure: {
      title: 'Seizure Emergency Response',
      steps: [
        {
          title: 'Ensure Safety',
          instruction: 'Move dangerous objects away from the person. Do NOT restrain them.',
          duration: null,
          critical: true
        },
        {
          title: 'Protect the Head',
          instruction: 'Place something soft under their head if possible',
          duration: null,
          critical: false
        },
        {
          title: 'Turn to Side',
          instruction: 'Gently turn person to their side to prevent choking on saliva',
          duration: null,
          critical: true
        },
        {
          title: 'Time the Seizure',
          instruction: 'Note the time - call 108 if seizure lasts more than 5 minutes',
          duration: 300,
          critical: true
        },
        {
          title: 'Stay with Person',
          instruction: 'Stay calm and remain with the person until they recover',
          duration: null,
          critical: false
        }
      ]
    },
    severe_bleeding: {
      title: 'Severe Bleeding Emergency Response',
      steps: [
        {
          title: 'Call Emergency Services',
          instruction: 'Call 108 immediately for severe bleeding',
          duration: null,
          critical: true
        },
        {
          title: 'Apply Direct Pressure',
          instruction: 'Press firmly on the wound with clean cloth or bandage',
          duration: null,
          critical: true
        },
        {
          title: 'Elevate if Possible',
          instruction: 'Raise the injured area above heart level if no fracture suspected',
          duration: null,
          critical: false
        },
        {
          title: 'Add More Bandages',
          instruction: 'If blood soaks through, add more bandages on top. Don\'t remove original.',
          duration: null,
          critical: true
        },
        {
          title: 'Treat for Shock',
          instruction: 'Keep person warm and lying down. Monitor breathing.',
          duration: null,
          critical: false
        }
      ]
    },
    burns: {
      title: 'Burns Emergency Response',
      steps: [
        {
          title: 'Remove from Heat Source',
          instruction: 'Get person away from heat source. Stop, drop, and roll if on fire.',
          duration: null,
          critical: true
        },
        {
          title: 'Cool the Burn',
          instruction: 'Run cool (not cold) water over burn for 10-20 minutes',
          duration: 600,
          critical: true
        },
        {
          title: 'Remove Jewelry',
          instruction: 'Remove rings, watches before swelling starts. Don\'t remove stuck clothing.',
          duration: null,
          critical: false
        },
        {
          title: 'Cover Loosely',
          instruction: 'Cover with sterile gauze or clean cloth. Don\'t use ice or butter.',
          duration: null,
          critical: false
        },
        {
          title: 'Seek Medical Help',
          instruction: 'Call 108 for large burns, burns on face/hands/feet, or chemical burns',
          duration: null,
          critical: true
        }
      ]
    },
    poisoning: {
      title: 'Poisoning Emergency Response',
      steps: [
        {
          title: 'Call Poison Control',
          instruction: 'Call 108 or Poison Control immediately. Have container/label ready.',
          duration: null,
          critical: true
        },
        {
          title: 'Assess Consciousness',
          instruction: 'Check if person is conscious and breathing normally',
          duration: null,
          critical: true
        },
        {
          title: 'Do NOT Induce Vomiting',
          instruction: 'Unless specifically told by poison control, do not make person vomit',
          duration: null,
          critical: true
        },
        {
          title: 'Remove from Mouth',
          instruction: 'If poison is still in mouth, rinse mouth and remove any remaining substance',
          duration: null,
          critical: false
        },
        {
          title: 'Monitor Vitals',
          instruction: 'Keep person calm and monitor breathing until help arrives',
          duration: null,
          critical: true
        }
      ]
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    // Get user location for emergency services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerSeconds(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const callEmergency = () => {
    const emergencyNumber = '108'; // India emergency number
    window.open(`tel:${emergencyNumber}`);
    toast.success('Calling emergency services...');
  };

  const shareLocation = () => {
    if (location) {
      const locationText = `Emergency! I need help at: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: locationText,
        });
      } else {
        navigator.clipboard.writeText(locationText);
        toast.success('Location copied to clipboard');
      }
    } else {
      toast.error('Location not available');
    }
  };

  const selectEmergency = (emergency) => {
    setSelectedEmergency(emergency);
    setCurrentStep(0);
    resetTimer();
    
    // Automatically speak the first instruction
    const guide = emergencyGuides[emergency.id];
    if (guide && guide.steps[0]) {
      speakInstruction(guide.steps[0].instruction);
    }
  };

  const nextStep = () => {
    const guide = emergencyGuides[selectedEmergency.id];
    if (currentStep < guide.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      speakInstruction(guide.steps[newStep].instruction);
      
      // Start timer for timed steps
      if (guide.steps[newStep].duration) {
        resetTimer();
        startTimer();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      const guide = emergencyGuides[selectedEmergency.id];
      speakInstruction(guide.steps[newStep].instruction);
      
      // Start timer for timed steps
      if (guide.steps[newStep].duration) {
        resetTimer();
        startTimer();
      }
    }
  };

  if (selectedEmergency) {
    const guide = emergencyGuides[selectedEmergency.id];
    const currentStepData = guide.steps[currentStep];
    
    return (
      <div className="min-h-screen bg-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Emergency Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedEmergency(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Emergency Types
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={callEmergency}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 108</span>
                </button>
                <button
                  onClick={shareLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Share Location</span>
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">{guide.title}</h1>
              <p className="text-gray-600">Follow these steps carefully. Stay calm and act quickly.</p>
            </div>
          </motion.div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  currentStepData.critical ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {currentStep + 1}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
              {currentStepData.critical && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Critical Step
                </span>
              )}
            </div>

            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentStepData.instruction}
              </p>
            </div>

            {/* Timer for timed steps */}
            {currentStepData.duration && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-4 bg-gray-100 rounded-lg p-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div className="text-2xl font-mono font-bold text-gray-900">
                    {formatTime(timerSeconds)}
                  </div>
                  <div className="flex space-x-2">
                    {!isTimerRunning ? (
                      <button
                        onClick={startTimer}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={stopTimer}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {currentStepData.duration && (
                  <p className="text-sm text-gray-500 mt-2">
                    Target duration: {Math.floor(currentStepData.duration / 60)}:{(currentStepData.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            )}

            {/* Voice Controls */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4">
                {!isSpeaking ? (
                  <button
                    onClick={() => speakInstruction(currentStepData.instruction)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Read Aloud</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Reading</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous Step
              </button>
              
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {guide.steps.length}
              </div>
              
              <button
                onClick={nextStep}
                disabled={currentStep === guide.steps.length - 1}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Step
              </button>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / guide.steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / guide.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency First Aid</h1>
          <p className="text-gray-600 mb-6">
            Select your emergency type for immediate step-by-step guidance
          </p>
          
          {/* Quick Emergency Call */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={callEmergency}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
              <span>Call 108 Emergency</span>
            </button>
            <button
              onClick={shareLocation}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              <MapPin className="w-5 h-5" />
              <span>Share My Location</span>
            </button>
          </div>
        </motion.div>

        {/* Emergency Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyTypes.map((emergency, index) => {
            const Icon = emergency.icon;
            return (
              <motion.div
                key={emergency.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => selectEmergency(emergency)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${emergency.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {emergency.title}
                </h3>
                
                <p className="text-gray-600 text-center text-sm mb-4">
                  {emergency.description}
                </p>
                
                <div className="flex items-center justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    emergency.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                    emergency.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {emergency.urgency.toUpperCase()} PRIORITY
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Emergency Guidelines</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Always call emergency services (108) for serious emergencies</li>
                <li>• This app provides first aid guidance but doesn't replace professional medical care</li>
                <li>• Stay calm and follow instructions step by step</li>
                <li>• If you're unsure about the severity, always err on the side of caution</li>
                <li>• Keep emergency contacts readily available</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;
