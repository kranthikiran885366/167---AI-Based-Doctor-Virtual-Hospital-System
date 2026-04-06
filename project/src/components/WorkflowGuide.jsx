import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  CheckCircle,
  Circle,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Clock,
  Users,
  Stethoscope,
  FileText,
  Brain,
  Pill,
  Heart,
  Activity,
  X,
  HelpCircle,
  Target,
  Zap,
  Award,
  TrendingUp,
  Eye,
  TestTube,
  ClipboardList,
  Calendar,
  AlertTriangle,
  PhoneCall,
  Video,
  Settings
} from 'lucide-react';

const WorkflowGuide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const location = useLocation();
  const navigate = useNavigate();

  const medicalWorkflows = {
    'patient-intake': {
      title: 'Patient Intake Workflow',
      description: 'Complete patient registration and initial assessment',
      icon: Users,
      color: 'blue',
      estimatedTime: '15-20 minutes',
      steps: [
        {
          id: 'registration',
          title: 'Patient Registration',
          description: 'Collect basic patient information and demographics',
          path: '/medical-registration',
          icon: FileText,
          duration: '5 min'
        },
        {
          id: 'medical-history',
          title: 'Medical History Collection',
          description: 'Gather comprehensive medical background',
          path: '/medical-history',
          icon: BookOpen,
          duration: '10 min'
        },
        {
          id: 'vital-signs',
          title: 'Initial Vital Signs',
          description: 'Record baseline measurements',
          path: '/examination-features',
          icon: Activity,
          duration: '5 min'
        }
      ]
    },
    'diagnosis-workflow': {
      title: 'Diagnostic Workflow',
      description: 'Systematic approach to patient diagnosis',
      icon: Brain,
      color: 'purple',
      estimatedTime: '30-45 minutes',
      steps: [
        {
          id: 'examination',
          title: 'Physical Examination',
          description: 'Comprehensive physical assessment',
          path: '/examination-features',
          icon: Stethoscope,
          duration: '15 min'
        },
        {
          id: 'visual-inspection',
          title: 'Visual Inspection',
          description: 'Camera-based examination and documentation',
          path: '/visual-inspection',
          icon: Eye,
          duration: '10 min'
        },
        {
          id: 'lab-analysis',
          title: 'Lab Reports Analysis',
          description: 'Review and analyze laboratory results',
          path: '/lab-reports-analysis',
          icon: TestTube,
          duration: '10 min'
        },
        {
          id: 'ai-diagnosis',
          title: 'AI-Assisted Diagnosis',
          description: 'Leverage AI for diagnostic support',
          path: '/ai-diagnosis',
          icon: Brain,
          duration: '10 min'
        }
      ]
    },
    'treatment-workflow': {
      title: 'Treatment Planning Workflow',
      description: 'Create comprehensive treatment plans',
      icon: Pill,
      color: 'green',
      estimatedTime: '20-30 minutes',
      steps: [
        {
          id: 'prescription',
          title: 'Prescription Management',
          description: 'Create and manage patient prescriptions',
          path: '/prescription',
          icon: Pill,
          duration: '15 min'
        },
        {
          id: 'treatment-plan',
          title: 'Treatment Plan Creation',
          description: 'Develop comprehensive care plan',
          path: '/prescription',
          icon: ClipboardList,
          duration: '10 min'
        },
        {
          id: 'follow-up',
          title: 'Follow-up Scheduling',
          description: 'Schedule monitoring and follow-up care',
          path: '/patient-followup',
          icon: Calendar,
          duration: '5 min'
        }
      ]
    },
    'emergency-workflow': {
      title: 'Emergency Response Workflow',
      description: 'Rapid assessment and emergency care',
      icon: AlertTriangle,
      color: 'red',
      estimatedTime: '10-15 minutes',
      priority: 'urgent',
      steps: [
        {
          id: 'triage',
          title: 'Emergency Triage',
          description: 'Rapid assessment and prioritization',
          path: '/emergency',
          icon: AlertTriangle,
          duration: '2 min'
        },
        {
          id: 'vital-assessment',
          title: 'Vital Signs Assessment',
          description: 'Critical vital signs monitoring',
          path: '/emergency',
          icon: Heart,
          duration: '3 min'
        },
        {
          id: 'emergency-consultation',
          title: 'Emergency Consultation',
          description: 'Immediate medical consultation',
          path: '/emergency',
          icon: PhoneCall,
          duration: '10 min'
        }
      ]
    },
    'consultation-workflow': {
      title: 'Telemedicine Consultation Workflow',
      description: 'Virtual patient consultation process',
      icon: Video,
      color: 'indigo',
      estimatedTime: '25-35 minutes',
      steps: [
        {
          id: 'pre-consultation',
          title: 'Pre-Consultation Setup',
          description: 'Prepare for video consultation',
          path: '/consultation-modes',
          icon: Settings,
          duration: '5 min'
        },
        {
          id: 'video-consultation',
          title: 'Video Consultation',
          description: 'Conduct virtual patient meeting',
          path: '/consultation-modes',
          icon: Video,
          duration: '20 min'
        },
        {
          id: 'documentation',
          title: 'Session Documentation',
          description: 'Document consultation findings',
          path: '/medical-documentation',
          icon: FileText,
          duration: '10 min'
        }
      ]
    }
  };

  const workflowRouteMapping = {
    '/medical-registration': 'patient-intake',
    '/medical-history': 'patient-intake',
    '/examination-features': 'diagnosis-workflow',
    '/visual-inspection': 'diagnosis-workflow',
    '/lab-reports-analysis': 'diagnosis-workflow',
    '/ai-diagnosis': 'diagnosis-workflow',
    '/prescription': 'treatment-workflow',
    '/patient-followup': 'treatment-workflow',
    '/emergency': 'emergency-workflow',
    '/consultation-modes': 'consultation-workflow',
    '/medical-documentation': 'consultation-workflow'
  };

  useEffect(() => {
    const workflowId = workflowRouteMapping[location.pathname];
    if (workflowId) {
      setCurrentWorkflow(workflowId);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname]);

  const handleStepClick = (step) => {
    navigate(step.path);
    setCompletedSteps(prev => new Set([...prev, step.id]));
  };

  const markStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const workflow = currentWorkflow ? medicalWorkflows[currentWorkflow] : null;

  if (!isVisible || !workflow) return null;

  const WorkflowIcon = workflow.icon;
  const completedCount = workflow.steps.filter(step => completedSteps.has(step.id)).length;
  const progress = (completedCount / workflow.steps.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-4 top-24 bottom-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-30 overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r from-${workflow.color}-500 to-${workflow.color}-600 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <WorkflowIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{workflow.title}</h3>
                  {workflow.priority === 'urgent' && (
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-medium text-yellow-300">URGENT</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-4">{workflow.description}</p>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{completedCount}/{workflow.steps.length} steps</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-white h-2 rounded-full"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{workflow.estimatedTime}</span>
              </div>
              {progress === 100 && (
                <div className="flex items-center space-x-1 text-green-300">
                  <Award className="w-4 h-4" />
                  <span>Complete!</span>
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {workflow.steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = location.pathname === step.path;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isCurrent
                      ? `border-${workflow.color}-300 bg-${workflow.color}-50 shadow-lg`
                      : isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isCurrent
                        ? `bg-${workflow.color}-100`
                        : isCompleted
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <StepIcon className={`w-5 h-5 ${
                          isCurrent ? `text-${workflow.color}-600` : 'text-gray-600'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold text-sm ${
                          isCurrent ? `text-${workflow.color}-900` : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                        <span className="text-xs text-gray-500">{step.duration}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                      
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-1 mt-2"
                        >
                          <PlayCircle className={`w-4 h-4 text-${workflow.color}-600`} />
                          <span className={`text-xs font-medium text-${workflow.color}-600`}>
                            Current Step
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {!isCompleted && !isCurrent && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
            {progress === 100 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Workflow Complete!</span>
                </div>
                <button
                  onClick={() => setCompletedSteps(new Set())}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset Progress
                </button>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Need Help?</span>
                </button>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>Step-by-step guidance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkflowGuide;
