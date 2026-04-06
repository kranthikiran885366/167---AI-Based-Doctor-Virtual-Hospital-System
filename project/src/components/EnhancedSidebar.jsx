import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  PhoneCall,
  MessageSquare,
  Search,
  Clock,
  Database,
  Lock,
  CreditCard,
  TrendingUp,
  FileCheck,
  UserCog,
  Bookmark,
  ChevronDown,
  X,
  Zap
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { useLayout } from '../context/LayoutContext.jsx';

const sections = [
  {
    key: 'core',
    label: 'Overview',
    items: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ]
  },
  {
    key: 'clinical',
    label: 'Clinical',
    items: [
      { name: 'AI Diagnosis', href: '/ai-diagnosis', icon: Brain },
      { name: 'Lab Reports', href: '/lab-reports-analysis', icon: Microscope },
      { name: 'Visual Inspection', href: '/visual-inspection', icon: Camera },
      { name: 'Diagnostics', href: '/diagnostics-testing', icon: TestTube },
      { name: 'Report Analyzer', href: '/report-analyzer', icon: FileCheck },
    ]
  },
  {
    key: 'patients',
    label: 'Patients',
    items: [
      { name: 'Patient Management', href: '/patient-management', icon: Users },
      { name: 'Registration', href: '/medical-registration', icon: UserCheck },
      { name: 'Medical History', href: '/medical-history', icon: FileText },
      { name: 'Scheduling', href: '/scheduling-management', icon: Calendar },
      { name: 'Follow-up', href: '/patient-followup', icon: Clock },
      { name: 'Education', href: '/patient-education', icon: BookOpen },
    ]
  },
  {
    key: 'consult',
    label: 'Consultation',
    items: [
      { name: 'Video Call', href: '/video-consultation', icon: Video },
      { name: 'Consultation Modes', href: '/consultation-modes', icon: PhoneCall },
      { name: 'Emergency', href: '/emergency', icon: AlertTriangle, urgent: true },
      { name: 'Doctor Collaboration', href: '/doctor-collaboration', icon: MessageSquare },
      { name: 'Collaboration', href: '/collaboration', icon: Users },
      { name: 'Doctor Dashboard', href: '/doctor-dashboard', icon: Stethoscope },
    ]
  },
  {
    key: 'treatment',
    label: 'Treatment',
    items: [
      { name: 'Prescriptions', href: '/prescription', icon: Pill },
      { name: 'Advanced Rx', href: '/advanced-prescription', icon: Pill },
      { name: 'Examination', href: '/examination-features', icon: Activity },
      { name: 'Full Examination', href: '/comprehensive-examination', icon: Activity },
      { name: 'Documentation', href: '/medical-documentation', icon: ClipboardList },
      { name: 'Calculators', href: '/medical-calculators', icon: TrendingUp },
    ]
  },
  {
    key: 'admin',
    label: 'Admin & Finance',
    items: [
      { name: 'Admin Panel', href: '/admin', icon: UserCog },
      { name: 'Compliance', href: '/admin-compliance', icon: Shield },
      { name: 'Finance & Earnings', href: '/finance-earnings', icon: DollarSign },
      { name: 'Billing', href: '/billing-finance', icon: CreditCard },
      { name: 'Security', href: '/security-privacy', icon: Lock },
    ]
  },
  {
    key: 'tools',
    label: 'Tools',
    items: [
      { name: 'Micro Functions', href: '/micro-functionalities', icon: Zap },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
      { name: 'History', href: '/history', icon: Clock },
      { name: 'Doctor Profile', href: '/doctor-profile', icon: UserCheck },
      { name: 'Profile', href: '/profile', icon: Settings },
    ]
  }
];

const SidebarSection = ({ section, isOpen, isExpanded, onToggle }) => {
  const location = useLocation();

  return (
    <div className="mb-1">
      {isOpen ? (
        <button
          onClick={() => onToggle(section.key)}
          className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group"
        >
          <span className="section-label">{section.label}</span>
          <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {(isExpanded || !isOpen) && (
          <motion.div
            initial={isOpen ? { height: 0 } : false}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href + item.name}
                    to={item.href}
                    title={!isOpen ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-base relative ${
                      isActive
                        ? 'bg-blue-50 text-[#1E40AF]'
                        : item.urgent
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#1E40AF] rounded-r"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="truncate"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.urgent && isOpen && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-soft flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EnhancedSidebar = () => {
  const { isSidebarOpen: isOpen, toggleSidebar, isMobile } = useLayout();
  const { user } = useUser();
  const [expanded, setExpanded] = useState({
    core: true, clinical: true, patients: false,
    consult: false, treatment: false, admin: false, tools: false
  });
  const [search, setSearch] = useState('');

  const toggleSection = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSections = search.trim()
    ? sections.map(s => ({
        ...s,
        items: s.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
      })).filter(s => s.items.length > 0)
    : sections;

  return (
    <>
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}

      <motion.aside
        animate={{ width: isOpen ? 260 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-[60px] bottom-0 z-40 bg-white border-r border-slate-200 flex flex-col overflow-hidden"
      >
        {isOpen && (
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E40AF]/30 focus:border-[#1E40AF] text-slate-700 placeholder-slate-400 transition-base"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2 space-y-3">
          {filteredSections.map((section) => (
            <SidebarSection
              key={section.key}
              section={section}
              isOpen={isOpen}
              isExpanded={expanded[section.key] !== false}
              onToggle={toggleSection}
            />
          ))}
        </nav>

        {isOpen && (
          <div className="px-3 py-3 border-t border-slate-100">
            <div className="flex items-center gap-2.5 px-1">
              <div className="relative flex-shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Dr. User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Medical Professional'}</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default EnhancedSidebar;
