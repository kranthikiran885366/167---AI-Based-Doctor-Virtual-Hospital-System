import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Clock, 
  FileText, 
  Pill,
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,
  ArrowRight,
  Bell,
  Shield,
  Brain,
  Zap,
  Target,
  Award,
  Smartphone,
  Globe,
  ChevronRight,
  Plus,
  BarChart3,
  Eye,
  Download,
  Menu,
  X,
  Home,
  Stethoscope,
  TestTube,
  Camera,
  Microscope,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Star,
  Bookmark,
  History,
  Users,
  MessageSquare,
  Video,
  Phone,
  Mail,
  Map,
  Search,
  Filter,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useUser } from '../context/UserContext.jsx';
import NurseReminders from '../components/NurseReminders.jsx';
import HealthTrends from '../components/HealthTrends.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            delay,
            ease: "easeOut" 
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color, bgGradient }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-l-4 ${color}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-r ${bgGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
          {subtitle}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user, medicalHistory, prescriptions } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [vitals, setVitals] = useState({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygenLevel: 98
  });

  const [healthTrends, setHealthTrends] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Heart Rate',
      data: [72, 75, 70, 78, 72, 74],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  });

  const [symptomsData, setSymptomsData] = useState({
    labels: ['Headache', 'Fever', 'Cough', 'Fatigue', 'Others'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderWidth: 0
    }]
  });

  // Sidebar menu items
  const sidebarMenuItems = [
    {
      category: 'Main',
      items: [
        {
          name: 'Dashboard',
          icon: Home,
          path: '/dashboard',
          active: true,
          badge: null,
          description: 'Overview & Analytics'
        },
        {
          name: 'AI Diagnosis',
          icon: Brain,
          path: '/ai-diagnosis',
          active: false,
          badge: 'AI',
          description: 'Smart Medical Analysis'
        },
        {
          name: 'Medical History',
          icon: FileText,
          path: '/medical-history',
          active: false,
          badge: null,
          description: 'Patient Records'
        }
      ]
    },
    {
      category: 'Doctor Functions',
      items: [
        {
          name: 'Doctor Profile',
          icon: Stethoscope,
          path: '/doctor-profile',
          active: false,
          badge: 'Pro',
          description: 'License & Credentials',
          submenu: [
            { name: 'Personal Info', path: '/doctor-profile?tab=profile' },
            { name: 'Medical License', path: '/doctor-profile?tab=medical' },
            { name: 'Education', path: '/doctor-profile?tab=education' },
            { name: 'Documents', path: '/doctor-profile?tab=documents' },
            { name: 'Availability', path: '/doctor-profile?tab=availability' },
            { name: 'Pricing', path: '/doctor-profile?tab=pricing' }
          ]
        },
        {
          name: 'Patient Management',
          icon: Users,
          path: '/patient-management',
          active: false,
          badge: 'Live',
          description: 'Queue & Appointments',
          submenu: [
            { name: 'Current Queue', path: '/patient-management?tab=queue' },
            { name: 'Scheduled', path: '/patient-management?tab=scheduled' },
            { name: 'History', path: '/patient-management?tab=history' }
          ]
        },
        {
          name: 'Consultation Modes',
          icon: Video,
          path: '/consultation-modes',
          active: false,
          badge: 'HD',
          description: 'Video/Voice/Text/Hybrid',
          submenu: [
            { name: 'Video Call', path: '/consultation-modes?mode=video' },
            { name: 'Audio Call', path: '/consultation-modes?mode=audio' },
            { name: 'Text Chat', path: '/consultation-modes?mode=text' },
            { name: 'Hybrid Mode', path: '/consultation-modes?mode=hybrid' }
          ]
        },
        {
          name: 'Scheduling Management',
          icon: Calendar,
          path: '/scheduling-management',
          active: false,
          badge: 'Live',
          description: 'Calendar & Appointments',
          submenu: [
            { name: 'Day View', path: '/scheduling-management?view=day' },
            { name: 'Week View', path: '/scheduling-management?view=week' },
            { name: 'Month View', path: '/scheduling-management?view=month' },
            { name: 'Waitlist', path: '/scheduling-management?tab=waitlist' }
          ]
        }
      ]
    },
    {
      category: 'Clinical Tools',
      items: [
        {
          name: 'Diagnostics & Testing',
          icon: TestTube,
          path: '/diagnostics-testing',
          active: false,
          badge: 'AI',
          description: 'Lab Orders & Results',
          submenu: [
            { name: 'Order Tests', path: '/diagnostics-testing?tab=order' },
            { name: 'Lab Results', path: '/diagnostics-testing?tab=results' },
            { name: 'Image Analysis', path: '/diagnostics-testing?tab=imaging' },
            { name: 'Patient Videos', path: '/diagnostics-testing?tab=videos' }
          ]
        },
        {
          name: 'Visual Inspection',
          icon: Camera,
          path: '/visual-inspection',
          active: false,
          badge: null,
          description: 'Camera Examinations'
        },
        {
          name: 'Lab Reports',
          icon: Microscope,
          path: '/lab-reports-analysis',
          active: false,
          badge: null,
          description: 'Report Analysis'
        },
        {
          name: 'Prescriptions',
          icon: Pill,
          path: '/prescription',
          active: false,
          badge: null,
          description: 'Digital Prescriptions',
          submenu: [
            { name: 'New Prescription', path: '/prescription?tab=new' },
            { name: 'Drug Database', path: '/prescription?tab=drugs' },
            { name: 'Interactions', path: '/prescription?tab=interactions' },
            { name: 'Templates', path: '/prescription?tab=templates' }
          ]
        }
      ]
    },
    {
      category: 'Emergency & Collaboration',
      items: [
        {
          name: 'Emergency',
          icon: AlertTriangle,
          path: '/emergency',
          active: false,
          badge: '24/7',
          description: 'SOS & Emergency Care',
          urgent: true,
          submenu: [
            { name: 'SOS Alerts', path: '/emergency?tab=sos' },
            { name: 'First Aid Guide', path: '/emergency?tab=firstaid' },
            { name: 'Ambulance Dispatch', path: '/emergency?tab=ambulance' },
            { name: 'Hospital Coordination', path: '/emergency?tab=hospitals' }
          ]
        },
        {
          name: 'Doctor Collaboration',
          icon: Users,
          path: '/collaboration',
          active: false,
          badge: 'Team',
          description: 'Referrals & Consultations',
          submenu: [
            { name: 'Specialist Referrals', path: '/collaboration?tab=referrals' },
            { name: 'Second Opinions', path: '/collaboration?tab=opinions' },
            { name: 'Case Discussions', path: '/collaboration?tab=cases' },
            { name: 'Multi-Doctor Calls', path: '/collaboration?tab=conferences' }
          ]
        }
      ]
    },
    {
      category: 'Documentation & Reports',
      items: [
        {
          name: 'Medical Documentation',
          icon: FileText,
          path: '/medical-documentation',
          active: false,
          badge: null,
          description: 'SOAP Notes & Records',
          submenu: [
            { name: 'SOAP Notes', path: '/medical-documentation?tab=soap' },
            { name: 'Digital Signatures', path: '/medical-documentation?tab=signatures' },
            { name: 'Photo/Video Upload', path: '/medical-documentation?tab=media' },
            { name: 'Export Records', path: '/medical-documentation?tab=export' }
          ]
        },
        {
          name: 'Patient Follow-up',
          icon: Bell,
          path: '/patient-followup',
          active: false,
          badge: 'Auto',
          description: 'Monitoring & Reminders',
          submenu: [
            { name: 'Progress Timeline', path: '/patient-followup?tab=timeline' },
            { name: 'Medication Reminders', path: '/patient-followup?tab=reminders' },
            { name: 'Chronic Conditions', path: '/patient-followup?tab=chronic' },
            { name: 'Wearable Data', path: '/patient-followup?tab=wearables' }
          ]
        },
        {
          name: 'Patient Education',
          icon: BookOpen,
          path: '/patient-education',
          active: false,
          badge: 'New',
          description: 'Educational Content & Plans',
          submenu: [
            { name: 'Content Library', path: '/patient-education?tab=library' },
            { name: 'Custom Content', path: '/patient-education?tab=custom' },
            { name: 'Diet & Exercise Plans', path: '/patient-education?tab=plans' },
            { name: 'Gamification', path: '/patient-education?tab=gamification' },
            { name: 'Create Content', path: '/patient-education?tab=create' }
          ]
        }
      ]
    },
    {
      category: 'Business & Compliance',
      items: [
        {
          name: 'Finance & Earnings',
          icon: DollarSign,
          path: '/finance-earnings',
          active: false,
          badge: null,
          description: 'Billing & Payments',
          submenu: [
            { name: 'Earnings Dashboard', path: '/finance-earnings?tab=dashboard' },
            { name: 'Fee Management', path: '/finance-earnings?tab=fees' },
            { name: 'Payment Processing', path: '/finance-earnings?tab=payments' },
            { name: 'Tax Statements', path: '/finance-earnings?tab=taxes' },
            { name: 'Invoices', path: '/finance-earnings?tab=invoices' }
          ]
        },
        {
          name: 'Admin & Compliance',
          icon: Shield,
          path: '/admin-compliance',
          active: false,
          badge: null,
          description: 'Regulatory & Training',
          submenu: [
            { name: 'HIPAA Compliance', path: '/admin-compliance?tab=hipaa' },
            { name: 'CME Training', path: '/admin-compliance?tab=cme' },
            { name: 'Hospital Notices', path: '/admin-compliance?tab=notices' },
            { name: 'System Training', path: '/admin-compliance?tab=training' }
          ]
        },
        {
          name: 'Security & Privacy',
          icon: Lock,
          path: '/security-privacy',
          active: false,
          badge: 'HIPAA',
          description: 'Authentication & Data Protection',
          submenu: [
            { name: 'Two-Factor Auth', path: '/security-privacy?tab=authentication' },
            { name: 'Session Management', path: '/security-privacy?tab=sessions' },
            { name: 'Access Control', path: '/security-privacy?tab=permissions' },
            { name: 'Audit Logs', path: '/security-privacy?tab=audit' },
            { name: 'Data Privacy', path: '/security-privacy?tab=privacy' }
          ]
        },
        {
          name: 'Advanced Tools',
          icon: Zap,
          path: '/micro-functionalities',
          active: false,
          badge: 'Pro',
          description: 'Micro-Functions & Productivity',
          submenu: [
            { name: 'Voice Notes', path: '/micro-functionalities?tool=voice' },
            { name: 'Quick Translations', path: '/micro-functionalities?tool=translate' },
            { name: 'Pinned Patients', path: '/micro-functionalities?tool=pins' },
            { name: 'Private Reminders', path: '/micro-functionalities?tool=reminders' },
            { name: 'Dark Mode', path: '/micro-functionalities?tool=theme' },
            { name: 'Offline Mode', path: '/micro-functionalities?tool=offline' }
          ]
        }
      ]
    },
    {
      category: 'Personal',
      items: [
        {
          name: 'Profile Settings',
          icon: User,
          path: '/profile',
          active: false,
          badge: null,
          description: 'Account Settings'
        },
        {
          name: 'Bookmarks',
          icon: Bookmark,
          path: '/bookmarks',
          active: false,
          badge: null,
          description: 'Saved Items'
        },
        {
          name: 'Activity History',
          icon: History,
          path: '/history',
          active: false,
          badge: null,
          description: 'Session Logs'
        }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: 'AI Diagnosis',
      description: 'Advanced symptom analysis with machine learning',
      icon: Brain,
      link: '/ai-diagnosis',
      color: 'from-purple-500 to-indigo-600',
      urgent: false,
      stats: '98% Accuracy'
    },
    {
      title: 'Analyze Report',
      description: 'AI-powered medical document processing',
      icon: FileText,
      link: '/report-analyzer',
      color: 'from-emerald-500 to-teal-600',
      urgent: false,
      stats: '5 sec Processing'
    },
    {
      title: 'Smart Prescription',
      description: 'Personalized medication recommendations',
      icon: Pill,
      link: '/prescription',
      color: 'from-blue-500 to-cyan-600',
      urgent: false,
      stats: 'FDA Approved'
    },
    {
      title: 'Emergency Care',
      description: 'Immediate medical assistance available',
      icon: AlertTriangle,
      link: '/emergency',
      color: 'from-red-500 to-pink-600',
      urgent: true,
      stats: '24/7 Available'
    }
  ];

  const recentActivity = [
    { 
      type: 'diagnosis', 
      title: 'AI Diagnosis: Common Cold', 
      time: '2 hours ago', 
      status: 'completed',
      confidence: 85,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      type: 'prescription', 
      title: 'Prescription Generated', 
      time: '1 day ago', 
      status: 'active',
      confidence: 92,
      color: 'bg-green-100 text-green-600'
    },
    { 
      type: 'report', 
      title: 'Blood Test Analysis', 
      time: '3 days ago', 
      status: 'reviewed',
      confidence: 88,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      type: 'emergency', 
      title: 'First Aid Consultation', 
      time: '1 week ago', 
      status: 'resolved',
      confidence: 95,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const upcomingReminders = [
    { title: 'Take Morning Vitamins', time: '8:00 AM', type: 'medication', priority: 'high', icon: Pill },
    { title: 'Drink Water', time: '10:00 AM', type: 'hydration', priority: 'medium', icon: Activity },
    { title: 'Evening Exercise', time: '6:00 PM', type: 'exercise', priority: 'medium', icon: Heart },
    { title: 'Sleep Reminder', time: '10:00 PM', type: 'sleep', priority: 'low', icon: Clock }
  ];

  const healthInsights = [
    {
      type: 'positive',
      message: 'Your heart rate has been stable this week. Great cardiovascular health!',
      icon: Heart,
      color: 'text-green-600',
      bg: 'bg-green-50',
      action: 'View Details'
    },
    {
      type: 'warning',
      message: 'Hydration levels could be improved. Aim for 8 glasses daily.',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      action: 'Set Reminder'
    },
    {
      type: 'info',
      message: 'Your last comprehensive checkup was 3 months ago.',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      action: 'Schedule Now'
    }
  ];

  const healthMetrics = [
    { label: 'Health Score', value: 85, max: 100, color: 'from-green-400 to-blue-500' },
    { label: 'Wellness Index', value: 78, max: 100, color: 'from-purple-400 to-pink-500' },
    { label: 'Recovery Rate', value: 92, max: 100, color: 'from-blue-400 to-indigo-500' }
  ];

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex">
      {/* Enhanced Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-16 z-40 h-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 ${
              sidebarCollapsed ? 'w-20' : 'w-80'
            } transition-all duration-300`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dashboard Menu</h2>
                    <p className="text-sm text-gray-500">Quick access to all features</p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {sidebarCollapsed ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="p-4 h-full overflow-y-auto">
              {sidebarMenuItems.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  {!sidebarCollapsed && (
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                      {category.category}
                    </h3>
                  )}
                  
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const globalIndex = categoryIndex * 100 + itemIndex;
                      
                      return (
                        <div key={itemIndex}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={`relative group`}
                          >
                            <button
                              onClick={() => {
                                if (item.submenu) {
                                  toggleSubmenu(globalIndex);
                                } else {
                                  handleNavigation(item.path);
                                }
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                item.active
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-lg border border-blue-200/50'
                                  : item.urgent
                                  ? 'text-red-600 hover:bg-red-50 animate-pulse'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`relative ${item.urgent ? 'animate-pulse' : ''}`}>
                                <Icon className={`w-6 h-6 ${
                                  item.active ? 'text-blue-600' : 
                                  item.urgent ? 'text-red-600' : 'group-hover:text-blue-500'
                                }`} />
                                {item.badge && (
                                  <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                                    item.badge === 'AI' ? 'bg-purple-500 text-white' :
                                    item.badge === 'New' ? 'bg-green-500 text-white' :
                                    item.badge === '24/7' ? 'bg-red-500 text-white' :
                                    'bg-blue-500 text-white'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              
                              {!sidebarCollapsed && (
                                <>
                                  <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.description}</div>
                                  </div>
                                  
                                  {item.submenu && (
                                    <ChevronDown className={`w-4 h-4 transition-transform ${
                                      activeSubmenu === globalIndex ? 'rotate-180' : ''
                                    }`} />
                                  )}
                                </>
                              )}
                            </button>

                            {/* Collapsed sidebar tooltip */}
                            {sidebarCollapsed && (
                              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                                {item.name}
                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                              </div>
                            )}
                          </motion.div>

                          {/* Submenu */}
                          <AnimatePresence>
                            {item.submenu && activeSubmenu === globalIndex && !sidebarCollapsed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-6 mt-2 space-y-1 overflow-hidden"
                              >
                                {item.submenu.map((subItem, subIndex) => (
                                  <button
                                    key={subIndex}
                                    onClick={() => handleNavigation(subItem.path)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    {subItem.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quick Actions in Sidebar */}
              {!sidebarCollapsed && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Search className="w-5 h-5" />
                      <span>Search Records</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                      <Plus className="w-5 h-5" />
                      <span>New Entry</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                      <Download className="w-5 h-5" />
                      <span>Export Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-20 left-4 z-50 p-3 bg-white shadow-lg rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors lg:hidden ${
          sidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80') : 'lg:ml-0'
      } pt-24 pb-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <AnimatedSection className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <motion.h1 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
                >
                  Welcome back, 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
                    {user?.name || 'Dr. User'}!
                  </span>
                </motion.h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Your AI-powered health dashboard is ready. Monitor your vitals, 
                  track trends, and get personalized insights.
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{currentTime.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg"
                >
                  <Shield className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">AI Protected</div>
                    <div className="text-xs opacity-90">HIPAA Compliant</div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg"
                >
                  <Activity className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Health Score: 85</div>
                    <div className="text-xs opacity-90">Excellent Status</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* Health Metrics Progress */}
          <AnimatedSection delay={0.2} className="mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Metrics Overview</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 251.2" }}
                          animate={{ strokeDasharray: `${(metric.value / metric.max) * 251.2} 251.2` }}
                          transition={{ duration: 2, delay: index * 0.2 }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className="stop-blue-500" />
                            <stop offset="100%" className="stop-purple-500" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">{metric.label}</h3>
                    <p className="text-sm text-gray-500">Out of {metric.max}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Enhanced Health Vitals */}
          <AnimatedSection delay={0.3} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Health Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Heart}
                title="Heart Rate"
                value={`${vitals.heartRate} bpm`}
                subtitle="Normal Range"
                trend="+2% from last week"
                color="border-red-500"
                bgGradient="from-red-500 to-pink-600"
              />
              <StatCard
                icon={Thermometer}
                title="Temperature"
                value={`${vitals.temperature}°F`}
                subtitle="Normal"
                trend="Stable"
                color="border-blue-500"
                bgGradient="from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={Activity}
                title="Blood Pressure"
                value={vitals.bloodPressure}
                subtitle="Optimal"
                trend="Perfect range"
                color="border-purple-500"
                bgGradient="from-purple-500 to-indigo-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Oxygen Level"
                value={`${vitals.oxygenLevel}%`}
                subtitle="Excellent"
                trend="Perfect"
                color="border-green-500"
                bgGradient="from-green-500 to-emerald-600"
              />
            </div>
          </AnimatedSection>

          {/* Enhanced Quick Actions */}
          <AnimatedSection delay={0.4} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI-Powered Health Actions</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={action.link}
                      className={`relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden ${
                        action.urgent ? 'ring-2 ring-red-200 animate-pulse' : ''
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {action.urgent && (
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          {action.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            {action.stats}
                          </span>
                          <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                            <span className="mr-2">Get Started</span>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Enhanced Health Insights */}
          <AnimatedSection delay={0.5} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Health Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className={`${insight.bg} p-6 rounded-3xl border-l-4 ${
                      insight.type === 'positive' ? 'border-green-500' :
                      insight.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
                    } hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        insight.type === 'positive' ? 'bg-green-100' :
                        insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">{insight.message}</p>
                        <button className={`text-sm font-medium ${insight.color} hover:underline`}>
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Health Trends */}
            <AnimatedSection delay={0.6} className="lg:col-span-2">
              <HealthTrends />
            </AnimatedSection>

            {/* Enhanced Symptoms Analysis */}
            <AnimatedSection delay={0.7}>
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Symptoms</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-64 mb-6">
                  <Doughnut 
                    data={symptomsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 20
                          }
                        },
                      },
                    }}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-medium">
                  View Detailed Analysis
                </button>
              </div>
            </AnimatedSection>
          </div>

          {/* Recent Activity & Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Enhanced Recent Activity */}
            <AnimatedSection delay={0.8}>
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent AI Activity</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>AI Confidence: {activity.confidence}%</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Enhanced Upcoming Reminders */}
            <AnimatedSection delay={0.9}>
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Today's Reminders</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingReminders.map((reminder, index) => {
                    const Icon = reminder.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{reminder.title}</div>
                          <div className="text-sm text-gray-500">{reminder.time}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                          reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {reminder.priority}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* AI Nurse Reminders */}
          <AnimatedSection delay={1.0}>
            <NurseReminders />
          </AnimatedSection>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
