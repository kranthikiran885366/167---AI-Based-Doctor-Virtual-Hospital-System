import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Star,
  Heart,
  Activity,
  Brain,
  Stethoscope,
  Pill,
  TestTube,
  Camera,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  BookOpen,
  Award,
  Lock,
  Shield
} from 'lucide-react';
import { toast } from 'react-toastify';

// Interactive Tutorial Component
export const InteractiveTutorial = ({ isOpen, onClose, page }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorials = {
    dashboard: [
      {
        title: "Welcome to Your Dashboard",
        content: "This is your main health overview. Here you can see your vitals, recent activity, and quick actions.",
        target: ".dashboard-header",
        position: "bottom"
      },
      {
        title: "Live Health Vitals",
        content: "Monitor your real-time health metrics including heart rate, temperature, and blood pressure.",
        target: ".vitals-section",
        position: "top"
      },
      {
        title: "Quick Actions",
        content: "Access key features quickly with these AI-powered health tools.",
        target: ".quick-actions",
        position: "top"
      }
    ],
    'ai-diagnosis': [
      {
        title: "AI Diagnosis Tool",
        content: "Get instant medical analysis by describing your symptoms to our advanced AI system.",
        target: ".diagnosis-form",
        position: "right"
      },
      {
        title: "Symptom Selection",
        content: "Select your symptoms from our comprehensive database or describe them in your own words.",
        target: ".symptom-selector",
        position: "bottom"
      }
    ],
    emergency: [
      {
        title: "Emergency Response",
        content: "Access immediate medical assistance for critical situations.",
        target: ".emergency-types",
        position: "bottom"
      },
      {
        title: "First Aid Instructions",
        content: "Follow step-by-step first aid instructions with audio guidance.",
        target: ".first-aid-steps",
        position: "left"
      }
    ]
  };

  const currentTutorial = tutorials[page] || [];

  const nextStep = () => {
    if (currentStep < currentTutorial.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      toast.success('Tutorial completed! You\'re ready to use the platform.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen || !currentTutorial.length) return null;

  const step = currentTutorial[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Tutorial</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {currentTutorial.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / currentTutorial.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / currentTutorial.length) * 100}%` }}
                className="bg-blue-500 h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h4>
            <p className="text-gray-600 leading-relaxed">{step.content}</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === currentTutorial.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStep === currentTutorial.length - 1 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Quick Help Component
export const QuickHelp = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const helpCategories = {
    'getting-started': {
      title: 'Getting Started',
      icon: Play,
      items: [
        { q: 'How do I use AI Diagnosis?', a: 'Navigate to AI Diagnosis, describe your symptoms, and our AI will provide analysis and recommendations.' },
        { q: 'How accurate is the AI?', a: 'Our AI has 98% accuracy rate based on millions of medical cases and is continuously learning.' },
        { q: 'Is my data secure?', a: 'Yes, we use end-to-end encryption and are HIPAA compliant to protect your medical data.' }
      ]
    },
    'features': {
      title: 'Features',
      icon: Zap,
      items: [
        { q: 'What emergency features are available?', a: 'We provide 24/7 emergency response, first aid guidance, and can connect you to emergency services.' },
        { q: 'Can I get prescriptions?', a: 'Yes, our AI can generate digital prescriptions that can be sent directly to pharmacies.' },
        { q: 'How do I schedule appointments?', a: 'Use the Scheduling Management section to book appointments with healthcare providers.' }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: Settings,
      items: [
        { q: 'The camera won\'t work for visual inspection', a: 'Please ensure you\'ve granted camera permissions and refresh the page.' },
        { q: 'I can\'t access my medical history', a: 'Try logging out and back in. If the issue persists, contact support.' },
        { q: 'Video consultation isn\'t working', a: 'Check your internet connection and ensure microphone/camera permissions are enabled.' }
      ]
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Help Center</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[60vh]">
              {/* Categories */}
              <div className="w-1/3 border-r border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(helpCategories).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors ${
                          selectedCategory === key
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {helpCategories[selectedCategory].items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-2xl p-6"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">{item.q}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Feature Onboarding Component
export const FeatureOnboarding = ({ feature, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = {
    'ai-diagnosis': [
      {
        title: "Welcome to AI Diagnosis",
        content: "Our AI system analyzes your symptoms using advanced machine learning to provide accurate medical insights.",
        icon: Brain,
        color: "from-purple-500 to-indigo-600"
      },
      {
        title: "Describe Your Symptoms",
        content: "Be as detailed as possible when describing your symptoms. Include when they started, severity, and any triggers.",
        icon: MessageSquare,
        color: "from-blue-500 to-cyan-600"
      },
      {
        title: "Get Instant Analysis",
        content: "Our AI will analyze your symptoms and provide potential diagnoses with confidence levels and recommendations.",
        icon: Zap,
        color: "from-green-500 to-emerald-600"
      }
    ],
    'emergency': [
      {
        title: "Emergency Response System",
        content: "Access immediate medical assistance for critical situations with step-by-step guidance.",
        icon: Phone,
        color: "from-red-500 to-pink-600"
      },
      {
        title: "First Aid Instructions",
        content: "Follow audio-guided first aid instructions for common emergency situations.",
        icon: Heart,
        color: "from-orange-500 to-red-600"
      }
    ]
  };

  const steps = onboardingSteps[feature] || [];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  if (!isOpen || !steps.length) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
        >
          <div className="text-center">
            <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Icon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-8">{step.content}</p>

            <div className="flex items-center justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>

              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Floating Help Button
export const FloatingHelpButton = ({ onHelpClick, onTutorialClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-3"
          >
            <button
              onClick={onTutorialClick}
              className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-blue-600"
            >
              <Play className="w-5 h-5" />
              <span className="font-medium">Tutorial</span>
            </button>
            
            <button
              onClick={onHelpClick}
              className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-blue-600"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Help Center</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

// Success/Completion Animations
export const SuccessAnimation = ({ isVisible, title, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Interactive Tooltips
export const InteractiveTooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap ${positionClasses[position]}`}
          >
            {content}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
