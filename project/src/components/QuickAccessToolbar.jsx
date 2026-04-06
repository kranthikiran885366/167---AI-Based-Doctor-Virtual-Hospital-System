import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Bell,
  Clock,
  Users,
  FileText,
  Stethoscope,
  AlertTriangle,
  Video,
  Pill,
  Camera,
  Calendar,
  Heart,
  Brain,
  Activity,
  Phone,
  MessageSquare,
  Bookmark,
  Settings,
  ChevronUp,
  ChevronDown,
  Zap,
  Star,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Share2
} from 'lucide-react';

const QuickAccessToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const predefinedActions = [
    {
      id: 'new-patient',
      title: 'New Patient',
      description: 'Register new patient',
      icon: Plus,
      path: '/medical-registration',
      color: 'blue',
      category: 'patient',
      priority: 'high'
    },
    {
      id: 'emergency',
      title: 'Emergency',
      description: 'Emergency consultation',
      icon: AlertTriangle,
      path: '/emergency',
      color: 'red',
      category: 'urgent',
      priority: 'critical'
    },
    {
      id: 'video-call',
      title: 'Video Call',
      description: 'Start consultation',
      icon: Video,
      path: '/consultation-modes',
      color: 'green',
      category: 'consultation',
      priority: 'high'
    },
    {
      id: 'prescription',
      title: 'Prescription',
      description: 'Create prescription',
      icon: Pill,
      path: '/prescription',
      color: 'purple',
      category: 'treatment',
      priority: 'medium'
    },
    {
      id: 'diagnosis',
      title: 'AI Diagnosis',
      description: 'AI-powered diagnosis',
      icon: Brain,
      path: '/ai-diagnosis',
      color: 'indigo',
      category: 'diagnosis',
      priority: 'high'
    },
    {
      id: 'lab-reports',
      title: 'Lab Reports',
      description: 'Analyze lab results',
      icon: FileText,
      path: '/lab-reports-analysis',
      color: 'orange',
      category: 'analysis',
      priority: 'medium'
    },
    {
      id: 'vitals',
      title: 'Vital Signs',
      description: 'Monitor vitals',
      icon: Heart,
      path: '/examination-features',
      color: 'pink',
      category: 'monitoring',
      priority: 'high'
    },
    {
      id: 'camera',
      title: 'Visual Exam',
      description: 'Camera examination',
      icon: Camera,
      path: '/visual-inspection',
      color: 'teal',
      category: 'examination',
      priority: 'medium'
    },
    {
      id: 'schedule',
      title: 'Schedule',
      description: 'Manage appointments',
      icon: Calendar,
      path: '/scheduling-management',
      color: 'yellow',
      category: 'management',
      priority: 'low'
    },
    {
      id: 'patients',
      title: 'Patients',
      description: 'Patient management',
      icon: Users,
      path: '/patient-management',
      color: 'cyan',
      category: 'management',
      priority: 'medium'
    }
  ];

  const utilityActions = [
    {
      id: 'search',
      title: 'Global Search',
      description: 'Search everything',
      icon: Search,
      action: () => setIsExpanded(!isExpanded),
      color: 'gray'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View alerts',
      icon: Bell,
      action: () => console.log('Show notifications'),
      color: 'yellow',
      badge: 3
    },
    {
      id: 'refresh',
      title: 'Refresh',
      description: 'Reload data',
      icon: RefreshCw,
      action: () => window.location.reload(),
      color: 'blue'
    },
    {
      id: 'share',
      title: 'Share',
      description: 'Share current page',
      icon: Share2,
      action: () => navigator.share?.({ url: window.location.href }),
      color: 'green'
    }
  ];

  useEffect(() => {
    // Load user's customized quick actions from localStorage
    const savedActions = localStorage.getItem('quickActions');
    if (savedActions) {
      setQuickActions(JSON.parse(savedActions));
    } else {
      // Default to high priority actions
      const defaultActions = predefinedActions.filter(action => 
        action.priority === 'critical' || action.priority === 'high'
      ).slice(0, 6);
      setQuickActions(defaultActions);
    }

    // Load recent actions
    const savedRecentActions = localStorage.getItem('recentActions');
    if (savedRecentActions) {
      setRecentActions(JSON.parse(savedRecentActions));
    }
  }, []);

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path);
      
      // Add to recent actions
      const newRecentActions = [
        action,
        ...recentActions.filter(ra => ra.id !== action.id)
      ].slice(0, 5);
      
      setRecentActions(newRecentActions);
      localStorage.setItem('recentActions', JSON.stringify(newRecentActions));
    } else if (action.action) {
      action.action();
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
      red: 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
      green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
      indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      orange: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200',
      pink: 'text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200',
      teal: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200',
      yellow: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      cyan: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
      gray: 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Recent Actions */}
              {recentActions.length > 0 && (
                <div className="p-4 border-b border-gray-200/50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Recent Actions</span>
                  </h4>
                  <div className="flex space-x-2">
                    {recentActions.slice(0, 4).map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action)}
                          className={`p-3 rounded-xl border transition-all duration-200 ${getColorClasses(action.color)}`}
                          title={action.description}
                        >
                          <ActionIcon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Actions by Category */}
              <div className="p-4 max-h-80 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>All Actions</span>
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {predefinedActions.map((action) => {
                    const ActionIcon = action.icon;
                    const isActive = location.pathname === action.path;
                    
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                          isActive 
                            ? getColorClasses(action.color) + ' ring-2 ring-offset-2'
                            : getColorClasses(action.color)
                        }`}
                        title={action.description}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <ActionIcon className="w-6 h-6" />
                          <span className="text-xs font-medium text-center">{action.title}</span>
                          {action.priority === 'critical' && (
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toolbar */}
        <div className="p-3">
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              const isActive = location.pathname === action.path;
              
              return (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActionClick(action)}
                  className={`relative p-3 rounded-xl border transition-all duration-200 ${
                    isActive 
                      ? getColorClasses(action.color) + ' ring-2 ring-offset-1'
                      : getColorClasses(action.color)
                  }`}
                  title={action.description}
                >
                  <ActionIcon className="w-5 h-5" />
                  {action.priority === 'critical' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                  )}
                </motion.button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Utility Actions */}
            {utilityActions.map((action) => {
              const ActionIcon = action.icon;
              
              return (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActionClick(action)}
                  className={`relative p-3 rounded-xl border transition-all duration-200 ${getColorClasses(action.color)}`}
                  title={action.description}
                >
                  <ActionIcon className="w-5 h-5" />
                  {action.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {action.badge}
                    </div>
                  )}
                </motion.button>
              );
            })}

            {/* Expand/Collapse Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 rounded-xl border text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200 transition-all duration-200"
              title={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Emergency */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
        onClick={() => navigate('/emergency')}
        className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center group"
        title="Emergency - Click for immediate assistance"
      >
        <AlertTriangle className="w-8 h-8 group-hover:animate-pulse" />
        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
      </motion.button>
    </motion.div>
  );
};

export default QuickAccessToolbar;
