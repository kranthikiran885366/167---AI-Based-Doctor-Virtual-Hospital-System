import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Clock, 
  Bell, 
  AlertTriangle,
  CheckCircle,
  User,
  Pill,
  Thermometer,
  Stethoscope,
  Eye,
  MessageSquare,
  Phone,
  Video,
  Mail,
  Send,
  Plus,
  Minus,
  Edit,
  Save,
  Download,
  Upload,
  Filter,
  Search,
  Star,
  Flag,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Zap,
  Shield,
  Smartphone,
  Watch,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Settings,
  Archive,
  Bookmark,
  Share
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';

const PatientMonitoring = ({ patients, onUpdatePatient, onSendReminder }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');
  const [monitoringFilter, setMonitoringFilter] = useState('all');
  const [newReminder, setNewReminder] = useState({
    type: 'medication',
    message: '',
    date: '',
    time: '',
    recurring: false
  });

  const [vitalsData, setVitalsData] = useState({
    bloodPressure: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Systolic',
        data: [120, 125, 118, 130, 122, 128, 124],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }, {
        label: 'Diastolic',
        data: [80, 82, 78, 85, 81, 84, 82],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    },
    bloodSugar: {
      labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      datasets: [{
        label: 'Blood Sugar (mg/dL)',
        data: [95, 140, 110, 160, 125, 100],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    },
    heartRate: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Average Heart Rate',
        data: [72, 75, 70, 68],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e']
      }]
    }
  });

  const monitoringPatients = [
    {
      id: 1,
      name: 'John Smith',
      age: 65,
      condition: 'Diabetes Type 2',
      riskLevel: 'high',
      lastReading: '2 hours ago',
      compliance: 85,
      nextAppointment: '2024-02-15',
      devices: [
        { name: 'Glucose Monitor', status: 'connected', battery: 75 },
        { name: 'Blood Pressure Cuff', status: 'connected', battery: 90 }
      ],
      vitals: {
        bloodSugar: 140,
        bloodPressure: '140/90',
        heartRate: 82,
        weight: 180
      },
      medications: [
        { name: 'Metformin', lastTaken: '6 hours ago', compliance: 90 },
        { name: 'Lisinopril', lastTaken: '8 hours ago', compliance: 85 }
      ],
      alerts: [
        { type: 'high_bp', message: 'Blood pressure elevated (140/90)', time: '2 hours ago', severity: 'medium' },
        { type: 'missed_med', message: 'Missed evening medication', time: '1 day ago', severity: 'low' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 45,
      condition: 'Hypertension',
      riskLevel: 'medium',
      lastReading: '4 hours ago',
      compliance: 92,
      nextAppointment: '2024-02-20',
      devices: [
        { name: 'Smart Watch', status: 'connected', battery: 60 },
        { name: 'Blood Pressure Monitor', status: 'disconnected', battery: 0 }
      ],
      vitals: {
        bloodPressure: '125/80',
        heartRate: 68,
        steps: 8500,
        sleep: '7.5 hours'
      },
      medications: [
        { name: 'Amlodipine', lastTaken: '4 hours ago', compliance: 95 },
        { name: 'Hydrochlorothiazide', lastTaken: '4 hours ago', compliance: 88 }
      ],
      alerts: [
        { type: 'device_offline', message: 'BP monitor disconnected', time: '6 hours ago', severity: 'low' }
      ]
    },
    {
      id: 3,
      name: 'Mike Davis',
      age: 58,
      condition: 'Post-Surgery Recovery',
      riskLevel: 'high',
      lastReading: '30 minutes ago',
      compliance: 78,
      nextAppointment: '2024-02-18',
      devices: [
        { name: 'Heart Rate Monitor', status: 'connected', battery: 85 },
        { name: 'Activity Tracker', status: 'connected', battery: 45 }
      ],
      vitals: {
        heartRate: 95,
        temperature: 99.2,
        oxygenSat: 96,
        painLevel: 4
      },
      medications: [
        { name: 'Oxycodone', lastTaken: '3 hours ago', compliance: 75 },
        { name: 'Ibuprofen', lastTaken: '6 hours ago', compliance: 80 }
      ],
      alerts: [
        { type: 'pain_increase', message: 'Pain level increased to 4/10', time: '1 hour ago', severity: 'medium' },
        { type: 'low_activity', message: 'Below activity target for 2 days', time: '2 hours ago', severity: 'low' }
      ]
    }
  ];

  const reminderTypes = [
    { value: 'medication', label: 'Medication Reminder', icon: Pill },
    { value: 'appointment', label: 'Appointment Reminder', icon: Calendar },
    { value: 'vitals', label: 'Check Vitals', icon: Activity },
    { value: 'exercise', label: 'Exercise Reminder', icon: Heart },
    { value: 'diet', label: 'Dietary Reminder', icon: Target },
    { value: 'test', label: 'Lab Test Reminder', icon: Stethoscope }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'vitals', name: 'Vital Trends', icon: Activity },
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'devices', name: 'Connected Devices', icon: Smartphone },
    { id: 'alerts', name: 'Alerts & Notifications', icon: Bell },
    { id: 'reminders', name: 'Reminders', icon: Clock }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sendReminder = () => {
    if (!newReminder.message || !newReminder.date || !newReminder.time) {
      toast.error('Please fill in all reminder fields');
      return;
    }

    const reminder = {
      id: Date.now(),
      patientId: selectedPatient.id,
      ...newReminder,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    onSendReminder && onSendReminder(reminder);
    
    setNewReminder({
      type: 'medication',
      message: '',
      date: '',
      time: '',
      recurring: false
    });

    toast.success('Reminder scheduled successfully');
  };

  const flagPatientForAttention = (patientId, reason) => {
    toast.success(`Patient flagged for urgent attention: ${reason}`);
  };

  const PatientCard = ({ patient, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-500">{patient.condition}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
            {patient.riskLevel.toUpperCase()}
          </span>
          {patient.alerts.length > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Reading:</span>
          <span className="font-medium">{patient.lastReading}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Compliance:</span>
          <span className={`font-medium ${getComplianceColor(patient.compliance)}`}>
            {patient.compliance}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Next Visit:</span>
          <span className="font-medium">{new Date(patient.nextAppointment).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {patient.devices.map((device, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={`${device.name}: ${device.status}`}
          />
        ))}
        <span className="text-xs text-gray-500">{patient.devices.length} devices</span>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Monitoring</h1>
          <p className="text-gray-600">Track patient progress and manage chronic conditions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={monitoringFilter}
            onChange={(e) => setMonitoringFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Patients</option>
            <option value="high_risk">High Risk</option>
            <option value="alerts">With Alerts</option>
            <option value="poor_compliance">Poor Compliance</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Monitoring List</h2>
          {monitoringPatients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              isSelected={selectedPatient?.id === patient.id}
              onClick={() => setSelectedPatient(patient)}
            />
          ))}
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-3">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Patient Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-blue-100">
                      Age: {selectedPatient.age} | Condition: {selectedPatient.condition}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedPatient.riskLevel)}`}>
                      {selectedPatient.riskLevel.toUpperCase()} RISK
                    </span>
                    
                    <button
                      onClick={() => flagPatientForAttention(selectedPatient.id, 'Manual review requested')}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                        {tab.id === 'alerts' && selectedPatient.alerts.length > 0 && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full">
                            {selectedPatient.alerts.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Current Vitals */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(selectedPatient.vitals).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{value}</div>
                            <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-3 gap-4">
                        <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                          <Video className="w-5 h-5" />
                          <span>Video Call</span>
                        </button>
                        <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Send Message</span>
                        </button>
                        <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span>Schedule Visit</span>
                        </button>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Blood pressure reading</p>
                              <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Pill className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium">Medication taken</p>
                              <p className="text-sm text-gray-500">6 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Vital Trends Tab */}
                  {activeTab === 'vitals' && (
                    <motion.div
                      key="vitals"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Vital Sign Trends</h3>
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="7days">Last 7 Days</option>
                          <option value="30days">Last 30 Days</option>
                          <option value="90days">Last 3 Months</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4">Blood Pressure Trend</h4>
                          <div className="h-64">
                            <Line 
                              data={vitalsData.bloodPressure}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } }
                              }}
                            />
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4">Blood Sugar Levels</h4>
                          <div className="h-64">
                            <Line 
                              data={vitalsData.bloodSugar}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Medications Tab */}
                  {activeTab === 'medications' && (
                    <motion.div
                      key="medications"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Medication Compliance</h3>
                      
                      <div className="space-y-4">
                        {selectedPatient.medications.map((med, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">{med.name}</h4>
                              <span className={`font-medium ${getComplianceColor(med.compliance)}`}>
                                {med.compliance}% compliance
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Last taken: {med.lastTaken}</span>
                              <button className="text-blue-600 hover:text-blue-800">
                                Send Reminder
                              </button>
                            </div>
                            
                            <div className="mt-3 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  med.compliance >= 90 ? 'bg-green-500' :
                                  med.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${med.compliance}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Connected Devices Tab */}
                  {activeTab === 'devices' && (
                    <motion.div
                      key="devices"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Connected Devices</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedPatient.devices.map((device, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <h4 className="font-medium text-gray-900">{device.name}</h4>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Battery className={`w-4 h-4 ${
                                  device.battery > 20 ? 'text-green-500' : 'text-red-500'
                                }`} />
                                <span className="text-sm text-gray-600">{device.battery}%</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              Status: <span className={`font-medium ${
                                device.status === 'connected' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {device.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Alerts Tab */}
                  {activeTab === 'alerts' && (
                    <motion.div
                      key="alerts"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          Mark All Read
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedPatient.alerts.map((alert, index) => (
                          <div key={index} className={`border-l-4 p-4 rounded-lg ${
                            alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                            alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{alert.message}</h4>
                                <p className="text-sm text-gray-600">{alert.time}</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                                
                                <button className="text-gray-400 hover:text-gray-600">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Reminders Tab */}
                  {activeTab === 'reminders' && (
                    <motion.div
                      key="reminders"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Send Patient Reminder</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                            <select
                              value={newReminder.type}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              {reminderTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                              type="date"
                              value={newReminder.date}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                              type="time"
                              value={newReminder.time}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newReminder.recurring}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, recurring: e.target.checked }))}
                              className="rounded"
                            />
                            <label className="text-sm text-gray-700">Recurring reminder</label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <textarea
                            value={newReminder.message}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter reminder message..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={sendReminder}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Reminder</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Patient</h3>
              <p className="text-gray-500">Choose a patient from the monitoring list to view their details and vitals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMonitoring;
