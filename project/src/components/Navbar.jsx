import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Activity,
  Heart,
  Pill,
  Calendar,
  AlertTriangle,
  Brain,
  BarChart3
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { useLayout } from '../context/LayoutContext.jsx';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toggleSidebar } = useLayout();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'AI Diagnosis', href: '/ai-diagnosis', icon: Brain },
    { name: 'Lab Reports', href: '/lab-reports-analysis', icon: Activity },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle, alert: true },
  ];

  const notifications = [
    { icon: Heart, text: 'Daily vitals check due in 30 min', time: '5m ago', dot: 'bg-red-400' },
    { icon: Pill, text: 'Time to take your evening medication', time: '1h ago', dot: 'bg-blue-400' },
    { icon: Calendar, text: 'Dr. Smith consultation — tomorrow 2 PM', time: '3h ago', dot: null },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[60px] bg-white border-b border-slate-200 flex items-center px-4 gap-4">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-base"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className="flex items-center gap-2.5 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-700 text-[15px] text-slate-900 tracking-tight">AI Doctor</span>
      </div>

      <nav className="hidden xl:flex items-center gap-1 ml-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-base ${
                isActive
                  ? 'bg-blue-50 text-[#1E40AF]'
                  : item.alert
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
              {item.alert && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); }}
            className="relative p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-base"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 card shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Notifications</span>
                  <button className="text-xs text-[#1E40AF] hover:underline font-medium">Mark all read</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map((n, i) => {
                    const Icon = n.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-base cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                        {n.dot && <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />}
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                  <button className="text-xs text-[#1E40AF] hover:underline font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-base"
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-800 max-w-[100px] truncate">
              {user?.name || 'Dr. User'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 card shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Dr. User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="nav-link text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/doctor-dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="nav-link text-sm"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Doctor Dashboard
                  </Link>
                  <Link
                    to="/security-privacy"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="nav-link text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </Link>
                </div>
                <div className="p-1.5 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="nav-link text-sm w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
