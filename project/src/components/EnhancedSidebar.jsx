import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Home,
  BarChart3,
  Brain,
  FileText,
  Microscope,
  Camera,
  TestTube,
  Pill,
  Heart,
  Users,
  Calendar,
  Video,
  AlertTriangle,
  Shield,
  DollarSign,
  Settings,
  BookOpen,
  UserCheck,
  Stethoscope,
  Activity,
  ClipboardList,
  FlaskConical,
  Zap,
  PhoneCall,
  MessageSquare,
  Upload,
  Download,
  Search,
  Filter,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Wifi,
  Database,
  Lock,
  Key,
  CreditCard,
  Receipt,
  PieChart,
  TrendingUp,
  FileCheck,
  UserCog,
  Building,
  Award,
  HelpCircle,
  Star,
  Target,
  Layers,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Archive,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Bell,
  Calendar as CalendarIcon,
  Clock3,
  Timer,
  Bookmark,
  Tag,
  Copy,
  Share2,
  ExternalLink,
  Minimize2,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Menu,
  X,
  Calculator
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout.js';

const EnhancedSidebar = () => {
  const { isSidebarOpen: isOpen, toggleSidebar, isMobile } = useResponsiveLayout();
  const [expandedSections, setExpandedSections] = useState({
    'clinical-workflow': true,
    'patient-management': false,
    'consultation': false,
    'diagnosis': false,
    'treatment': false,
    'monitoring': false,
    'collaboration': false,
    'admin': false,
    'finance': false,
    'security': false,
    'tools': false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNavigation, setFilteredNavigation] = useState(null);

  const location = useLocation();
  const { user } = useUser();

  const navigationStructure = {
    'clinical-workflow': {
      title: 'Clinical Workflow',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Main Health Overview' },
        { name: 'Patient Registration', href: '/medical-registration', icon: UserCheck, description: 'New Patient Setup' },
        { name: 'Medical History', href: '/medical-history', icon: FileText, description: 'Patient History Collection' },
        { name: 'Comprehensive Examination', href: '/examination-features', icon: Activity, description: 'Physical Examination Tools' },
        { name: 'AI Diagnosis', href: '/ai-diagnosis', icon: Brain, description: 'AI-Powered Diagnosis' }
      ]
    },
    'patient-management': {
      title: 'Patient Management',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      items: [
        { name: 'Patient Database', href: '/patient-management', icon: Database, description: 'Patient Records Management' },
        { name: 'Appointment Scheduling', href: '/scheduling-management', icon: Calendar, description: 'Schedule & Manage Appointments' },
        { name: 'Patient Follow-up', href: '/patient-followup', icon: Clock, description: 'Follow-up Care Management' },
        { name: 'Patient Education', href: '/patient-education', icon: BookOpen, description: 'Educational Resources' },
        { name: 'Health Trends', href: '/dashboard', icon: TrendingUp, description: 'Health Analytics & Trends' }
      ]
    },
    'consultation': {
      title: 'Consultation & Communication',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      items: [
        { name: 'Video Consultation', href: '/consultation-modes', icon: Video, description: 'HD Video Calls' },
        { name: 'Emergency Consultation', href: '/emergency', icon: AlertTriangle, description: '24/7 Emergency Care' },
        { name: 'Doctor Collaboration', href: '/collaboration', icon: Users, description: 'Inter-doctor Communication' },
        { name: 'Patient Communication', href: '/collaboration', icon: MessageSquare, description: 'Patient Messaging' },
        { name: 'Telemedicine', href: '/consultation-modes', icon: PhoneCall, description: 'Remote Consultations' }
      ]
    },
    'diagnosis': {
      title: 'Diagnostics & Testing',
      icon: TestTube,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      items: [
        { name: 'Lab Reports Analysis', href: '/lab-reports-analysis', icon: Microscope, description: 'Lab Test Analysis' },
        { name: 'Visual Inspection', href: '/visual-inspection', icon: Camera, description: 'Camera-based Examination' },
        { name: 'Diagnostic Testing', href: '/diagnostics-testing', icon: FlaskConical, description: 'Order & Analyze Tests' },
        { name: 'Medical Imaging', href: '/visual-inspection', icon: Eye, description: 'X-ray, MRI, CT Analysis' },
        { name: 'Report Analyzer', href: '/report-analyzer', icon: FileCheck, description: 'Automated Report Analysis' }
      ]
    },
    'treatment': {
      title: 'Treatment & Prescription',
      icon: Pill,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      items: [
        { name: 'Prescription Management', href: '/prescription', icon: Pill, description: 'Digital Prescriptions' },
        { name: 'Treatment Plans', href: '/prescription', icon: ClipboardList, description: 'Comprehensive Treatment' },
        { name: 'Drug Interactions', href: '/prescription', icon: AlertCircle, description: 'Drug Safety Checks' },
        { name: 'Dosage Calculator', href: '/prescription', icon: Calculator, description: 'Accurate Dosing' },
        { name: 'Pharmacy Integration', href: '/prescription', icon: Building, description: 'Pharmacy Network' }
      ]
    },
    'monitoring': {
      title: 'Monitoring & Follow-up',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      items: [
        { name: 'Vital Signs Monitoring', href: '/patient-followup', icon: Activity, description: 'Real-time Vitals' },
        { name: 'Device Integration', href: '/patient-followup', icon: Wifi, description: 'Medical Device Data' },
        { name: 'Health Alerts', href: '/patient-followup', icon: Bell, description: 'Automated Health Alerts' },
        { name: 'Care Reminders', href: '/patient-followup', icon: Timer, description: 'Medication & Care Reminders' },
        { name: 'Progress Tracking', href: '/patient-followup', icon: Target, description: 'Treatment Progress' }
      ]
    },
    'collaboration': {
      title: 'Collaboration & Referrals',
      icon: UserCog,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      items: [
        { name: 'Doctor Dashboard', href: '/doctor-dashboard', icon: Stethoscope, description: 'Doctor Interface' },
        { name: 'Specialist Referrals', href: '/collaboration', icon: Share2, description: 'Refer to Specialists' },
        { name: 'Medical Teams', href: '/collaboration', icon: Users, description: 'Healthcare Team Coordination' },
        { name: 'Case Discussions', href: '/collaboration', icon: MessageSquare, description: 'Medical Case Reviews' },
        { name: 'Knowledge Sharing', href: '/collaboration', icon: BookOpen, description: 'Medical Knowledge Base' }
      ]
    },
    'admin': {
      title: 'Administration & Compliance',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      items: [
        { name: 'Admin Panel', href: '/admin', icon: UserCog, description: 'System Administration' },
        { name: 'Compliance Management', href: '/admin-compliance', icon: Shield, description: 'HIPAA & Regulatory Compliance' },
        { name: 'Medical Documentation', href: '/medical-documentation', icon: FileText, description: 'Clinical Documentation' },
        { name: 'Quality Assurance', href: '/admin-compliance', icon: Award, description: 'Quality Control' },
        { name: 'Training & Education', href: '/admin-compliance', icon: BookOpen, description: 'Staff Training Programs' }
      ]
    },
    'finance': {
      title: 'Finance & Billing',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      items: [
        { name: 'Billing & Finance', href: '/finance-earnings', icon: CreditCard, description: 'Financial Management' },
        { name: 'Insurance Claims', href: '/finance-earnings', icon: Receipt, description: 'Insurance Processing' },
        { name: 'Revenue Analytics', href: '/finance-earnings', icon: PieChart, description: 'Financial Analytics' },
        { name: 'Payment Processing', href: '/finance-earnings', icon: DollarSign, description: 'Payment Management' },
        { name: 'Financial Reports', href: '/finance-earnings', icon: TrendingUp, description: 'Financial Reporting' }
      ]
    },
    'security': {
      title: 'Security & Privacy',
      icon: Shield,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      items: [
        { name: 'Security Settings', href: '/security-privacy', icon: Lock, description: 'System Security' },
        { name: 'Access Control', href: '/security-privacy', icon: Key, description: 'User Permissions' },
        { name: 'Data Privacy', href: '/security-privacy', icon: Shield, description: 'Privacy Protection' },
        { name: 'Audit Logs', href: '/security-privacy', icon: FileCheck, description: 'Security Auditing' },
        { name: 'Encryption', href: '/security-privacy', icon: Lock, description: 'Data Encryption' }
      ]
    },
    'tools': {
      title: 'Tools & Utilities',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      items: [
        { name: 'Micro Functions', href: '/micro-functionalities', icon: Layers, description: 'Utility Tools' },
        { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark, description: 'Saved References' },
        { name: 'History', href: '/history', icon: Clock, description: 'Activity History' },
        { name: 'Search', href: '/dashboard', icon: Search, description: 'Global Search' },
        { name: 'Profile Settings', href: '/profile', icon: UserCog, description: 'User Profile' }
      ]
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };


  useEffect(() => {
    if (searchTerm) {
      const filtered = {};
      Object.keys(navigationStructure).forEach(sectionKey => {
        const section = navigationStructure[sectionKey];
        const matchingItems = section.items.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingItems.length > 0) {
          filtered[sectionKey] = {
            ...section,
            items: matchingItems
          };
        }
      });
      setFilteredNavigation(filtered);
    } else {
      setFilteredNavigation(null);
    }
  }, [searchTerm]);

  const activeNavigation = filteredNavigation || navigationStructure;

  const sidebarVariants = {
    open: { width: '320px', opacity: 1 },
    closed: { width: '80px', opacity: 0.95 }
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      <motion.div
        initial="open"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-20 bottom-0 z-40 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl overflow-hidden ${
          isMobile ? 'z-50' : ''
        }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Medical Hub</h2>
                  <p className="text-xs text-gray-500">Comprehensive Care</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <div className="space-y-2">
          {Object.keys(activeNavigation).map((sectionKey) => {
            const section = activeNavigation[sectionKey];
            const isExpanded = expandedSections[sectionKey];
            const SectionIcon = section.icon;

            return (
              <div key={sectionKey} className="mb-1">
                {/* Section Header */}
                <button
                  onClick={() => isOpen && toggleSection(sectionKey)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                    isOpen ? 'hover:bg-gray-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${section.bgColor} ${section.borderColor} border`}>
                      <SectionIcon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={contentVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="text-left"
                        >
                          <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                          <p className="text-xs text-gray-500">{section.items.length} features</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Section Items */}
                <AnimatePresence>
                  {isOpen && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 space-y-1 py-2">
                        {section.items.map((item, index) => {
                          const ItemIcon = item.icon;
                          const isActive = location.pathname === item.href;
                          
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={item.href}
                                className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 relative ${
                                  isActive
                                    ? `${section.bgColor} ${section.color} shadow-sm border ${section.borderColor}`
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <ItemIcon className={`w-4 h-4 flex-shrink-0 ${
                                  isActive ? section.color : 'group-hover:text-gray-700'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-sm truncate ${
                                    isActive ? section.color : ''
                                  }`}>
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {item.description}
                                  </p>
                                </div>
                                
                                {/* Active indicator */}
                                {isActive && (
                                  <motion.div
                                    layoutId="activeSidebarItem"
                                    className={`absolute left-0 top-0 bottom-0 w-1 ${section.color.replace('text-', 'bg-')} rounded-r`}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="p-4 border-t border-gray-200/50"
          >
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {user?.name || 'Dr. User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'Medical Professional'}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
};

export default EnhancedSidebar;
