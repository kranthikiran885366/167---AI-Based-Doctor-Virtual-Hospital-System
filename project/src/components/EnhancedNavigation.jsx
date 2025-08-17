import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  RotateCcw,
  Bookmark,
  Share2,
  ExternalLink,
  Download,
  Copy,
  Check,
  Star,
  Heart,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Settings,
  HelpCircle,
  Bell,
  User,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Trash2,
  Edit,
  Plus,
  Minus,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Maximize2,
  Minimize2,
  RefreshCw,
  Upload,
  Save,
  Send,
  Globe,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind
} from 'lucide-react';
import { toast } from 'react-toastify';

// Enhanced Interactive Button Component
export const InteractiveButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  tooltip,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative inline-block">
      <motion.button
        {...props}
        className={`
          relative inline-flex items-center justify-center font-medium rounded-xl
          transition-all duration-200 transform-gpu
          ${variants[variant]} ${sizes[size]} ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
        `}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (tooltip) setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        disabled={disabled || loading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </div>
      </motion.button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50"
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  );
};

// Page Navigation Component
export const PageNavigation = ({ title, subtitle, breadcrumbs = [], actions = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/dashboard');
  };

  const goHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <InteractiveButton
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={goBack}
            tooltip="Go back"
          />
          
          <div>
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <button onClick={goHome} className="hover:text-blue-600 transition-colors">
                  <Home className="w-4 h-4" />
                </button>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-3 h-3" />
                    {crumb.href ? (
                      <button
                        onClick={() => navigate(crumb.href)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-gray-900 font-medium">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex items-center space-x-3">
            {actions.map((action, index) => (
              <InteractiveButton key={index} {...action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Actions Floating Panel
export const QuickActionsPanel = ({ isOpen, onClose, actions = [] }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-20 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 min-w-[300px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      action.onClick();
                      onClose();
                    }}
                    className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Interactive Card Component
export const InteractiveCard = ({ 
  children, 
  className = '', 
  hover = true, 
  clickable = false, 
  onClick,
  gradient = false,
  glassEffect = false 
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300
        ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}
        ${glassEffect ? 'backdrop-blur-xl bg-white/80' : ''}
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Search Component
export const EnhancedSearch = ({ 
  placeholder = "Search...", 
  onSearch, 
  suggestions = [], 
  className = '',
  showFilters = false,
  filters = []
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <InteractiveButton
            size="sm"
            onClick={() => handleSearch(query)}
            className="px-3 py-1"
          >
            Search
          </InteractiveButton>
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions
            .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
            .map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
        </motion.div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 min-w-[250px]"
        >
          <h4 className="font-semibold text-gray-900 mb-3">Filters</h4>
          <div className="space-y-3">
            {filters.map((filter, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">{filter.label}</span>
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Action Confirmation Modal
export const ActionConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger" 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="flex items-center justify-end space-x-3">
              <InteractiveButton variant="ghost" onClick={onClose}>
                {cancelText}
              </InteractiveButton>
              <InteractiveButton variant={variant} onClick={onConfirm}>
                {confirmText}
              </InteractiveButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, size = 'md', animated = false }) => {
  const statusConfig = {
    success: { color: 'bg-green-100 text-green-800', icon: Check },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    error: { color: 'bg-red-100 text-red-800', icon: X },
    info: { color: 'bg-blue-100 text-blue-800', icon: Info },
    pending: { color: 'bg-gray-100 text-gray-800', icon: Clock }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = statusConfig[status] || statusConfig.info;
  const Icon = config.icon;

  return (
    <motion.span
      className={`inline-flex items-center space-x-1 font-medium rounded-full ${config.color} ${sizes[size]} ${animated ? 'animate-pulse' : ''}`}
      initial={animated ? { scale: 0.8 } : {}}
      animate={animated ? { scale: 1 } : {}}
    >
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status}</span>
    </motion.span>
  );
};

export default {
  InteractiveButton,
  PageNavigation,
  QuickActionsPanel,
  InteractiveCard,
  EnhancedSearch,
  ActionConfirmation,
  StatusBadge
};
