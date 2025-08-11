import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  FileText, 
  Pill, 
  AlertTriangle,
  User,
  LogOut,
  Bell,
  Settings,
  ChevronDown,
  Activity,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const navItems = [
    { name: 'Home', href: '/', icon: Home, description: 'AI Virtual Hospital' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Health Overview' },
    { name: 'AI Diagnosis', href: '/ai-diagnosis', icon: Brain, description: 'AI-Powered Diagnosis' },
    { name: 'Medical History', href: '/medical-history', icon: FileText, description: 'Patient History Collection' },
    { name: 'Lab Reports', href: '/lab-reports-analysis', icon: Microscope, description: 'Report Analysis & Annotation' },
    { name: 'Visual Inspection', href: '/visual-inspection', icon: Camera, description: 'Camera-based Examination' },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle, description: '24/7 Urgent Care' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                <Stethoscope className="w-7 h-7 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Activity className="w-2.5 h-2.5 text-white animate-pulse" />
                </div>
              </div>
            </div>
            <div className="group-hover:transform group-hover:scale-105 transition-all duration-300">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Doctor
              </h1>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-500 font-medium">MVK Solutions</p>
                <Shield className="w-3 h-3 text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center space-x-2"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-lg border border-blue-200/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-blue-600' : 'group-hover:text-blue-500'
                    } ${item.name === 'Emergency' ? 'animate-pulse' : ''}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                    
                    {/* Hover tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.description}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Enhanced User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                3
              </span>
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="p-2 space-y-1">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Health Check Reminder</p>
                        <p className="text-xs text-gray-500">Time for your daily vitals check</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <Pill className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Medication Reminder</p>
                        <p className="text-xs text-gray-500">Take your evening medication</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-sm">{user?.name || 'Dr. User'}</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">Premium</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name || 'Dr. User'}</p>
                          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        to="/doctor-dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Stethoscope className="w-5 h-5" />
                        <span>Doctor Dashboard</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Preferences</span>
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {/* User Profile in Mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl mb-4"
              >
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'Dr. User'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </motion.div>

              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''}`} />
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 px-4 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-6 h-6" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
