import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  Mail,
  MessageSquare,
  QrCode,
  Copy,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  User,
  MapPin,
  Monitor,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Bell,
  Zap,
  Target,
  Database,
  Server,
  Wifi,
  WifiOff,
  Camera,
  Scan,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  History,
  Archive,
  Trash2,
  Edit,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdvancedSecurity = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [authMethods, setAuthMethods] = useState({
    password: { enabled: true, lastUpdated: '2024-01-10' },
    twoFactor: { enabled: true, method: 'authenticator', backup: true },
    biometric: { enabled: false, fingerprint: false, faceId: false },
    smsAuth: { enabled: true, phone: '+1 (555) ***-1234' },
    emailAuth: { enabled: true, email: 'doctor@*****.com' }
  });

  const [sessionData, setSessionData] = useState({
    currentSession: {
      id: 'sess_2024_001',
      location: 'New York, NY',
      device: 'Chrome on MacOS',
      ip: '192.168.1.***',
      startTime: '2024-01-15T09:00:00',
      lastActivity: '2024-01-15T14:30:00',
      status: 'active'
    },
    activeSessions: [
      {
        id: 'sess_2024_002',
        location: 'Boston, MA',
        device: 'Mobile App - iPhone',
        ip: '192.168.2.***',
        startTime: '2024-01-14T16:20:00',
        lastActivity: '2024-01-14T22:15:00',
        status: 'active'
      },
      {
        id: 'sess_2024_003',
        location: 'Chicago, IL',
        device: 'Firefox on Windows',
        ip: '192.168.3.***',
        startTime: '2024-01-13T11:30:00',
        lastActivity: '2024-01-13T18:45:00',
        status: 'expired'
      }
    ]
  });

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15T14:30:00',
      user: 'Dr. John Smith',
      action: 'patient_record_accessed',
      resource: 'Patient Record - John Doe (P001)',
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on MacOS',
      success: true,
      riskLevel: 'low',
      details: 'Accessed patient medical history for consultation'
    },
    {
      id: 2,
      timestamp: '2024-01-15T14:25:00',
      user: 'Dr. John Smith',
      action: 'prescription_created',
      resource: 'Prescription - Maria Garcia (P002)',
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on MacOS',
      success: true,
      riskLevel: 'medium',
      details: 'Created prescription for antibiotics'
    },
    {
      id: 3,
      timestamp: '2024-01-15T14:15:00',
      user: 'Dr. John Smith',
      action: 'login_attempt',
      resource: 'Authentication System',
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on MacOS',
      success: true,
      riskLevel: 'low',
      details: 'Successful login with 2FA verification'
    },
    {
      id: 4,
      timestamp: '2024-01-15T13:45:00',
      user: 'Unknown',
      action: 'login_attempt',
      resource: 'Authentication System',
      ip: '192.168.5.200',
      location: 'Unknown Location',
      device: 'Unknown Device',
      success: false,
      riskLevel: 'high',
      details: 'Failed login attempt - incorrect password'
    }
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      passwordExpiry: 90,
      preventReuse: 5
    },
    sessionManagement: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauth: true,
      autoLogout: true
    },
    accessControl: {
      roleBasedAccess: true,
      ipWhitelisting: false,
      deviceTrust: true,
      locationTracking: true
    }
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [biometricSupport, setBiometricSupport] = useState(false);
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [faceIdScanning, setFaceIdScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogType, setSelectedLogType] = useState('all');

  // Refs for biometric scanning
  const fingerprintRef = useRef(null);
  const faceIdRef = useRef(null);

  // Check for biometric support
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if WebAuthn is supported
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricSupport(available);
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const enableTwoFactor = async (method) => {
    try {
      if (method === 'authenticator') {
        setShowQRCode(true);
      }
      
      setAuthMethods(prev => ({
        ...prev,
        twoFactor: { ...prev.twoFactor, enabled: true, method }
      }));
      
      toast.success(`Two-factor authentication enabled with ${method}`);
    } catch (error) {
      toast.error('Failed to enable two-factor authentication');
    }
  };

  const disableTwoFactor = () => {
    setAuthMethods(prev => ({
      ...prev,
      twoFactor: { ...prev.twoFactor, enabled: false }
    }));
    toast.info('Two-factor authentication disabled');
  };

  const setupBiometric = async (type) => {
    try {
      if (!biometricSupport) {
        toast.error('Biometric authentication not supported on this device');
        return;
      }

      if (type === 'fingerprint') {
        setFingerprintScanning(true);
        
        // Simulate fingerprint enrollment
        setTimeout(() => {
          setFingerprintScanning(false);
          setAuthMethods(prev => ({
            ...prev,
            biometric: { ...prev.biometric, enabled: true, fingerprint: true }
          }));
          toast.success('Fingerprint authentication enabled');
        }, 3000);
      } else if (type === 'faceId') {
        setFaceIdScanning(true);
        
        // Simulate Face ID enrollment
        setTimeout(() => {
          setFaceIdScanning(false);
          setAuthMethods(prev => ({
            ...prev,
            biometric: { ...prev.biometric, enabled: true, faceId: true }
          }));
          toast.success('Face ID authentication enabled');
        }, 3000);
      }
    } catch (error) {
      setFingerprintScanning(false);
      setFaceIdScanning(false);
      toast.error('Failed to setup biometric authentication');
    }
  };

  const terminateSession = (sessionId) => {
    setSessionData(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
    }));
    toast.success('Session terminated successfully');
  };

  const terminateAllSessions = () => {
    setSessionData(prev => ({
      ...prev,
      activeSessions: []
    }));
    toast.success('All sessions terminated');
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setShowBackupCodes(codes);
    toast.success('Backup codes generated');
  };

  const downloadAuditLog = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Resource,IP,Location,Success,Risk Level\n" +
      auditLogs.map(log => 
        `${log.timestamp},${log.user},${log.action},${log.resource},${log.ip},${log.location},${log.success},${log.riskLevel}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "security_audit_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Audit log downloaded');
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'login_attempt': return <User className="w-4 h-4" />;
      case 'patient_record_accessed': return <Eye className="w-4 h-4" />;
      case 'prescription_created': return <Plus className="w-4 h-4" />;
      case 'data_export': return <Download className="w-4 h-4" />;
      case 'settings_changed': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedLogType === 'all' || log.action.includes(selectedLogType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Advanced Security Center</h2>
                <p className="text-red-100">Comprehensive security management and monitoring</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Security Overview', icon: Shield },
                { id: 'authentication', label: '2FA & Biometrics', icon: Key },
                { id: 'sessions', label: 'Session Management', icon: Monitor },
                { id: 'audit', label: 'Audit Trail', icon: History },
                { id: 'settings', label: 'Security Settings', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Security Overview</h3>
                  
                  {/* Security Score */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold">Security Score</h4>
                        <p className="text-green-100">Your account security rating</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold">85%</div>
                        <p className="text-green-100">Excellent</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Status Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">2FA Enabled</h4>
                          <p className="text-sm text-gray-600">Authenticator app</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Biometrics</h4>
                          <p className="text-sm text-gray-600">Not configured</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                          <p className="text-sm text-gray-600">{sessionData.activeSessions.length + 1} devices</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Security Events */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h4>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            log.success ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {getActionIcon(log.action)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{log.action.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">{log.user} • {new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(log.riskLevel)}`}>
                            {log.riskLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'authentication' && (
                <motion.div
                  key="authentication"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Authentication Methods</h3>

                  {/* Two-Factor Authentication */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {authMethods.twoFactor.enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          authMethods.twoFactor.enabled ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {authMethods.twoFactor.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => enableTwoFactor('authenticator')}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Smartphone className="w-8 h-8 text-blue-600" />
                        <div className="text-left">
                          <h5 className="font-medium text-gray-900">Authenticator App</h5>
                          <p className="text-sm text-gray-600">Use apps like Google Authenticator</p>
                        </div>
                      </button>

                      <button
                        onClick={() => enableTwoFactor('sms')}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MessageSquare className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                          <h5 className="font-medium text-gray-900">SMS Verification</h5>
                          <p className="text-sm text-gray-600">Receive codes via text message</p>
                        </div>
                      </button>
                    </div>

                    {authMethods.twoFactor.enabled && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-4">
                          <button
                            onClick={generateBackupCodes}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Generate Backup Codes
                          </button>
                          <button
                            onClick={disableTwoFactor}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Disable 2FA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Biometric Authentication */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Biometric Authentication</h4>
                        <p className="text-gray-600">Use your fingerprint or face for secure access</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {authMethods.biometric.enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : biometricSupport ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          authMethods.biometric.enabled ? 'text-green-600' : 
                          biometricSupport ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {authMethods.biometric.enabled ? 'Enabled' : 
                           biometricSupport ? 'Available' : 'Not Supported'}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setupBiometric('fingerprint')}
                        disabled={!biometricSupport || fingerprintScanning}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <div className="relative">
                          <Fingerprint className="w-8 h-8 text-purple-600" />
                          {fingerprintScanning && (
                            <div className="absolute inset-0 animate-pulse bg-purple-600 rounded-full opacity-50" />
                          )}
                        </div>
                        <div className="text-left">
                          <h5 className="font-medium text-gray-900">Fingerprint</h5>
                          <p className="text-sm text-gray-600">
                            {fingerprintScanning ? 'Scanning...' : 'Touch sensor to authenticate'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setupBiometric('faceId')}
                        disabled={!biometricSupport || faceIdScanning}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <div className="relative">
                          <Scan className="w-8 h-8 text-indigo-600" />
                          {faceIdScanning && (
                            <div className="absolute inset-0 animate-pulse bg-indigo-600 rounded-full opacity-50" />
                          )}
                        </div>
                        <div className="text-left">
                          <h5 className="font-medium text-gray-900">Face ID</h5>
                          <p className="text-sm text-gray-600">
                            {faceIdScanning ? 'Scanning...' : 'Look at camera to authenticate'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sessions' && (
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Session Management</h3>
                    <button
                      onClick={terminateAllSessions}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Terminate All Sessions
                    </button>
                  </div>

                  {/* Current Session */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{sessionData.currentSession.device}</h5>
                            <p className="text-sm text-gray-600">{sessionData.currentSession.location}</p>
                            <p className="text-xs text-gray-500">
                              Started: {new Date(sessionData.currentSession.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Current Session
                            </span>
                            <p className="text-xs text-gray-500 mt-1">IP: {sessionData.currentSession.ip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Other Active Sessions</h4>
                    <div className="space-y-4">
                      {sessionData.activeSessions.map(session => (
                        <div key={session.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            session.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Monitor className={`w-6 h-6 ${
                              session.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{session.device}</h5>
                                <p className="text-sm text-gray-600">{session.location}</p>
                                <p className="text-xs text-gray-500">
                                  Last active: {new Date(session.lastActivity).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {session.status}
                                </span>
                                <button
                                  onClick={() => terminateSession(session.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'audit' && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Security Audit Trail</h3>
                    <button
                      onClick={downloadAuditLog}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Log</span>
                    </button>
                  </div>

                  {/* Search and Filter */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search audit logs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <select
                        value={selectedLogType}
                        onChange={(e) => setSelectedLogType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Events</option>
                        <option value="login">Login Events</option>
                        <option value="patient_record">Patient Records</option>
                        <option value="prescription">Prescriptions</option>
                        <option value="settings">Settings</option>
                      </select>
                    </div>
                  </div>

                  {/* Audit Log Table */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Risk Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    log.success ? 'bg-green-100' : 'bg-red-100'
                                  }`}>
                                    {getActionIcon(log.action)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {log.action.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500">{log.resource}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-900">{log.user}</p>
                                <p className="text-xs text-gray-500">{log.ip}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-900">{log.location}</p>
                                <p className="text-xs text-gray-500">{log.device}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(log.riskLevel)}`}>
                                  {log.riskLevel}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
              onClick={() => setShowQRCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Authenticator App</h3>
                <div className="text-center mb-4">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan this QR code with your authenticator app
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Setup Key:</p>
                    <code className="text-sm font-mono">ABCD EFGH IJKL MNOP</code>
                  </div>
                  <button
                    onClick={() => setShowQRCode(false)}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backup Codes Modal */}
        <AnimatePresence>
          {showBackupCodes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
              onClick={() => setShowBackupCodes(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Recovery Codes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Save these codes in a safe place. Each code can only be used once.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {showBackupCodes.map((code, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                      <code className="text-sm font-mono">{code}</code>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(showBackupCodes.join('\n'));
                      toast.success('Codes copied to clipboard');
                    }}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Copy Codes
                  </button>
                  <button
                    onClick={() => setShowBackupCodes(false)}
                    className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdvancedSecurity;
