import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  History, 
  Users, 
  FileText, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  Save, 
  RefreshCw, 
  Bell, 
  Globe, 
  Monitor, 
  Fingerprint, 
  Scan, 
  Database, 
  Server, 
  Wifi, 
  HardDrive, 
  Activity, 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  LogOut,
  LogIn,
  UserX,
  ShieldCheck,
  ShieldAlert,
  ShieldOff
} from 'lucide-react';
import { toast } from 'react-toastify';

const SecurityPrivacy = () => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [showPassword, setShowPassword] = useState(false);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordRequirements: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
      preventReuse: 5
    },
    sessionSettings: {
      timeout: 30,
      maxConcurrentSessions: 3,
      requireReauth: true,
      logoutOnBrowserClose: true
    },
    auditSettings: {
      logAllAccess: true,
      retentionPeriod: 90,
      alertOnSuspicious: true,
      exportEnabled: true
    }
  });

  // Access logs data
  const [accessLogs, setAccessLogs] = useState([
    {
      id: 1,
      user: 'Dr. Sarah Johnson',
      action: 'Patient Record Access',
      resource: 'John Smith - Medical History',
      timestamp: '2024-01-15 14:32:18',
      ipAddress: '192.168.1.100',
      device: 'Chrome on MacOS',
      location: 'New York, NY',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 2,
      user: 'Dr. Sarah Johnson',
      action: 'Prescription Created',
      resource: 'Maria Garcia - Prescription #12345',
      timestamp: '2024-01-15 14:28:45',
      ipAddress: '192.168.1.100',
      device: 'Chrome on MacOS',
      location: 'New York, NY',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 3,
      user: 'Unknown User',
      action: 'Failed Login Attempt',
      resource: 'Authentication System',
      timestamp: '2024-01-15 13:45:12',
      ipAddress: '203.45.67.89',
      device: 'Unknown Browser',
      location: 'Unknown Location',
      status: 'failed',
      riskLevel: 'high'
    }
  ]);

  // Active sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome on MacOS',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      loginTime: '2024-01-15 09:00:00',
      lastActivity: '2024-01-15 14:30:00',
      current: true,
      trusted: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      ipAddress: '192.168.1.105',
      loginTime: '2024-01-15 08:30:00',
      lastActivity: '2024-01-15 12:15:00',
      current: false,
      trusted: true
    },
    {
      id: 3,
      device: 'Firefox on Windows',
      location: 'Chicago, IL',
      ipAddress: '10.0.0.50',
      loginTime: '2024-01-14 16:20:00',
      lastActivity: '2024-01-14 18:45:00',
      current: false,
      trusted: false
    }
  ]);

  // Role-based permissions
  const [rolePermissions, setRolePermissions] = useState([
    {
      role: 'Senior Doctor',
      permissions: {
        patientRecords: { read: true, write: true, delete: true },
        prescriptions: { read: true, write: true, delete: true },
        labResults: { read: true, write: true, delete: false },
        billing: { read: true, write: false, delete: false },
        administration: { read: true, write: true, delete: false }
      },
      users: ['Dr. Sarah Johnson', 'Dr. Michael Brown']
    },
    {
      role: 'Junior Doctor',
      permissions: {
        patientRecords: { read: true, write: true, delete: false },
        prescriptions: { read: true, write: true, delete: false },
        labResults: { read: true, write: false, delete: false },
        billing: { read: false, write: false, delete: false },
        administration: { read: false, write: false, delete: false }
      },
      users: ['Dr. Emily Chen', 'Dr. Robert Wilson']
    },
    {
      role: 'Nurse',
      permissions: {
        patientRecords: { read: true, write: false, delete: false },
        prescriptions: { read: true, write: false, delete: false },
        labResults: { read: true, write: false, delete: false },
        billing: { read: false, write: false, delete: false },
        administration: { read: false, write: false, delete: false }
      },
      users: ['Nurse Jennifer Davis', 'Nurse Mark Thompson']
    }
  ]);

  // Data anonymization settings
  const [anonymizationSettings, setAnonymizationSettings] = useState({
    autoAnonymize: {
      enabled: true,
      afterDays: 2555, // 7 years
      excludeActivePatients: true
    },
    anonymizationLevel: 'full', // partial, full, custom
    fieldsToAnonymize: [
      'name', 'address', 'phone', 'email', 'ssn', 'dob'
    ],
    retainClinicalData: true
  });

  const enable2FA = async () => {
    // Simulate enabling 2FA
    setTwoFactorEnabled(true);
    toast.success('Two-factor authentication enabled');
  };

  const disable2FA = () => {
    setTwoFactorEnabled(false);
    toast.success('Two-factor authentication disabled');
  };

  const enableBiometric = async () => {
    try {
      // Check if biometric authentication is available
      if ('PublicKeyCredential' in window) {
        setBiometricEnabled(true);
        toast.success('Biometric authentication enabled');
      } else {
        toast.error('Biometric authentication not supported on this device');
      }
    } catch (error) {
      toast.error('Failed to enable biometric authentication');
    }
  };

  const terminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    toast.success('Session terminated');
  };

  const lockSensitiveData = (patientId) => {
    toast.success('Patient data locked - additional authorization required');
  };

  const exportAccessLogs = () => {
    const csvContent = accessLogs.map(log => 
      `${log.timestamp},${log.user},${log.action},${log.resource},${log.status},${log.riskLevel}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'access_logs.csv';
    a.click();
    
    toast.success('Access logs exported');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Security & Privacy</h1>
              <p className="text-gray-600">Manage authentication, access controls, and data protection</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <button
                onClick={exportAccessLogs}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap space-x-2">
            {[
              { id: 'authentication', label: 'Authentication', icon: Key },
              { id: 'sessions', label: 'Session Management', icon: Clock },
              { id: 'permissions', label: 'Access Control', icon: UserCheck },
              { id: 'audit', label: 'Audit Logs', icon: History },
              { id: 'privacy', label: 'Data Privacy', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'authentication' && (
            <motion.div
              key="authentication"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      twoFactorEnabled ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">SMS & App Authentication</h4>
                      <p className="text-gray-600">
                        {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Enable 2FA for enhanced security'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={twoFactorEnabled ? disable2FA : enable2FA}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      twoFactorEnabled 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>

              {/* Biometric Authentication */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Biometric Authentication</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        biometricEnabled ? 'bg-purple-500' : 'bg-gray-400'
                      }`}>
                        <Fingerprint className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Fingerprint Login</h4>
                        <p className="text-gray-600 text-sm">
                          {biometricEnabled ? 'Enabled' : 'Not configured'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={enableBiometric}
                      disabled={biometricEnabled}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        biometricEnabled 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {biometricEnabled ? 'Enabled' : 'Setup'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                        <Scan className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Face Recognition</h4>
                        <p className="text-gray-600 text-sm">Not configured</p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Setup
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Password Security</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Current Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Minimum 12 characters</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Uppercase letters required</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Numbers required</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Special characters required</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Cannot reuse last 5 passwords</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
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
              {/* Session Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Session Configuration</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={240}>4 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Concurrent Sessions</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value={1}>1 session</option>
                      <option value={2}>2 sessions</option>
                      <option value={3}>3 sessions</option>
                      <option value={5}>5 sessions</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Require re-authentication for sensitive actions</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Auto-logout on browser close</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Remember device for 30 days</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Sessions</h3>
                
                <div className="space-y-4">
                  {activeSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{session.device}</span>
                            {session.current && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Current Session
                              </span>
                            )}
                            {session.trusted && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Trusted
                              </span>
                            )}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-4">
                              <span>📍 {session.location}</span>
                              <span>🌐 {session.ipAddress}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span>🔐 Login: {new Date(session.loginTime).toLocaleString()}</span>
                              <span>⚡ Last: {new Date(session.lastActivity).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!session.current && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => toast.success('All other sessions terminated')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Terminate All Other Sessions
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'permissions' && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Role-Based Access Control */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Role-Based Access Control</h3>
                
                <div className="space-y-6">
                  {rolePermissions.map((role, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{role.role}</h4>
                          <p className="text-gray-600">{role.users.join(', ')}</p>
                        </div>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2">Resource</th>
                              <th className="text-center py-2">Read</th>
                              <th className="text-center py-2">Write</th>
                              <th className="text-center py-2">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(role.permissions).map(([resource, perms]) => (
                              <tr key={resource} className="border-b border-gray-100">
                                <td className="py-2 capitalize">{resource.replace(/([A-Z])/g, ' $1')}</td>
                                <td className="text-center py-2">
                                  {perms.read ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                                <td className="text-center py-2">
                                  {perms.write ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                                <td className="text-center py-2">
                                  {perms.delete ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
              {/* Audit Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Audit Configuration</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Log all data access</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Alert on suspicious activity</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Enable audit export</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention (days)</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>1 year</option>
                      <option value={2555}>7 years (HIPAA)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="low">Low sensitivity</option>
                      <option value="medium">Medium sensitivity</option>
                      <option value="high">High sensitivity</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Access Logs */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Access Logs</h3>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search logs..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3">Timestamp</th>
                        <th className="text-left py-3">User</th>
                        <th className="text-left py-3">Action</th>
                        <th className="text-left py-3">Resource</th>
                        <th className="text-left py-3">Location</th>
                        <th className="text-center py-3">Status</th>
                        <th className="text-center py-3">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessLogs.map(log => (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 font-mono text-xs">{log.timestamp}</td>
                          <td className="py-3">{log.user}</td>
                          <td className="py-3">{log.action}</td>
                          <td className="py-3 max-w-xs truncate" title={log.resource}>{log.resource}</td>
                          <td className="py-3">
                            <div className="text-xs text-gray-600">
                              <div>{log.location}</div>
                              <div>{log.ipAddress}</div>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="text-center py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(log.riskLevel)}`}>
                              {log.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Data Anonymization */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Anonymization</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Automatic Anonymization</h4>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Enable auto-anonymization</span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">After (days)</label>
                        <input
                          type="number"
                          defaultValue={2555}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Exclude active patients</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Retain clinical data</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Fields to Anonymize</h4>
                    <div className="space-y-2">
                      {['Name', 'Address', 'Phone', 'Email', 'SSN', 'Date of Birth', 'Photos'].map(field => (
                        <label key={field} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Security Measures</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <ShieldCheck className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Encryption at Rest</h4>
                    <p className="text-sm text-gray-600">AES-256 encryption for all stored data</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Wifi className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Encryption in Transit</h4>
                    <p className="text-sm text-gray-600">TLS 1.3 for all data transmission</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <Database className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Backup Security</h4>
                    <p className="text-sm text-gray-600">Encrypted backups with key rotation</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Compliance Status</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="font-medium text-gray-900">HIPAA Compliance</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Compliant</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="font-medium text-gray-900">GDPR Compliance</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Compliant</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-blue-500" />
                        <span className="font-medium text-gray-900">SOC 2 Audit</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">In Progress</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recent Audits</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">HIPAA Security Assessment</h5>
                            <p className="text-sm text-gray-600">Annual compliance review</p>
                          </div>
                          <span className="text-sm text-gray-500">2024-01-10</span>
                        </div>
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Passed</span>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">Data Protection Impact Assessment</h5>
                            <p className="text-sm text-gray-600">GDPR compliance check</p>
                          </div>
                          <span className="text-sm text-gray-500">2023-12-15</span>
                        </div>
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
