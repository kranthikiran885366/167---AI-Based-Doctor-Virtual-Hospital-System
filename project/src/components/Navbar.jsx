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
  Brain,
  Camera,
  Microscope,
  Zap,
  TestTube,
  Search,
  HelpCircle,
  Globe,
  Star,
  Clock,
  Calendar
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { useLayout } from '../context/LayoutContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toggleSidebar, isMobile } = useLayout();

  // Professional navigation items with cleaner structure
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Health Analytics & Overview' },
    { name: 'AI Diagnosis', href: '/ai-diagnosis', icon: Brain, description: 'AI-Powered Medical Diagnosis' },
    { name: 'Lab Reports', href: '/lab-reports-analysis', icon: Microscope, description: 'Laboratory Analysis & Results' },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle, description: 'Emergency Medical Services', priority: true },
  ];

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-2xl shadow-2xl border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-xl shadow-lg'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Left Section - Logo & Sidebar Toggle */}
          <div className="flex items-center space-x-6">
            {/* Professional Sidebar Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onClick={toggleSidebar}
              className="group relative p-3 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
            >
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Professional Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-4 group cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                {/* Logo Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500" />
                
                {/* Main Logo Container */}
                <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 rounded-3xl shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-400">
                  <Stethoscope className="w-8 h-8 text-white drop-shadow-lg" />
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Activity className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Brand Text */}
              <div className="group-hover:transform group-hover:scale-[1.02] transition-all duration-400">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-700 bg-clip-text text-transparent">
                  AI Doctor
                </h1>
                <div className="flex items-center space-x-2 mt-0.5">
                  <p className="text-sm text-gray-500 font-medium">MVK Solutions</p>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-semibold">SECURE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Section - Professional Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden xl:flex items-center space-x-2 bg-gray-50/80 rounded-2xl p-2 border border-gray-200/80 backdrop-blur-sm"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`group relative flex items-center space-x-3 px-6 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-lg border border-blue-100' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                    }`}
                  >
                    {/* Background Gradient for Active */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-emerald-50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <Icon className={`relative w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-blue-600' : 'group-hover:text-blue-500'
                    } ${item.priority ? 'animate-pulse' : ''}`} />
                    
                    <span className={`relative font-semibold text-sm transition-all duration-300 ${
                      isActive ? 'text-blue-600' : ''
                    }`}>
                      {item.name}
                    </span>
                    
                    {/* Priority Badge */}
                    {item.priority && (
                      <div className="relative w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}

                    {/* Professional Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
                      {item.description}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Section - Professional Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Global Search - Hidden on mobile */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex items-center space-x-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Search</span>
              <div className="px-2 py-1 bg-gray-200 rounded-md text-xs font-semibold text-gray-500">⌘K</div>
            </motion.button>

            {/* Professional Notifications */}
            <div className="relative dropdown-container">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all duration-300 group hover:shadow-lg"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                
                {/* Professional Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg animate-pulse">
                  3
                </div>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                          <div className="flex items-center space-x-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                              Mark all read
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Notification Items */}
                      <div className="max-h-80 overflow-y-auto">
                        <div className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                              <Heart className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">Health Check Reminder</p>
                              <p className="text-gray-600 text-xs mt-1">Your daily vitals check is due in 30 minutes</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">5 minutes ago</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                          </div>
                        </div>
                        
                        <div className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                              <Pill className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">Medication Reminder</p>
                              <p className="text-gray-600 text-xs mt-1">Time to take your evening medication</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">1 hour ago</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          </div>
                        </div>

                        <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">Appointment Scheduled</p>
                              <p className="text-gray-600 text-xs mt-1">Dr. Smith consultation tomorrow at 2:00 PM</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">3 hours ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Professional User Profile */}
            <div className="relative dropdown-container">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-all duration-300 group hover:shadow-lg"
              >
                <div className="relative">
                  <img 
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                    alt="Profile"
                    className="w-9 h-9 rounded-2xl object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                </div>
                
                <div className="hidden md:block text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 text-sm">{user?.name || 'Dr. User'}</span>
                    <Zap className="w-3 h-3 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Medical Professional</p>
                </div>
                
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Professional User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                          alt="Profile"
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{user?.name || 'Dr. User'}</p>
                          <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-semibold">Premium Member</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-3">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                      
                      <Link
                        to="/doctor-dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      >
                        <Stethoscope className="w-5 h-5" />
                        <span className="font-medium">Doctor Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Preferences</span>
                      </Link>
                      
                      <button className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full">
                        <HelpCircle className="w-5 h-5" />
                        <span className="font-medium">Help & Support</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-3" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all duration-300 hover:shadow-lg"
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
                    <X className="w-6 h-6 text-gray-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Professional Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="xl:hidden bg-white/98 backdrop-blur-2xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-3">
              
              {/* Mobile User Profile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl mb-6 border border-blue-100"
              >
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format'} 
                  alt="Profile"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-lg"
                />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user?.name || 'Dr. User'}</p>
                  <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600 font-semibold">Premium</span>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Navigation Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 border border-blue-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''} ${item.priority ? 'animate-pulse' : ''}`} />
                      <div className="flex-1">
                        <span className="font-semibold text-base">{item.name}</span>
                        <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                      {item.priority && (
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Mobile Menu Footer */}
              <div className="pt-6 border-t border-gray-200 space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-medium">Profile Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-medium">Sign Out</span>
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
