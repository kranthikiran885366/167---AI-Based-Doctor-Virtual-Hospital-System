import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  User, 
  Video, 
  Phone, 
  MessageSquare, 
  FileText, 
  Activity,
  LogIn,
  LogOut,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  Archive,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users
} from 'lucide-react';

const History = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [activities] = useState([
    {
      id: 1,
      type: 'consultation',
      action: 'Video consultation completed',
      details: 'Patient: Sarah Johnson - Diabetes follow-up',
      timestamp: '2024-01-18T14:30:00',
      duration: 30,
      status: 'completed',
      patient: 'Sarah Johnson',
      sessionId: 'VID-2024-001'
    },
    {
      id: 2,
      type: 'login',
      action: 'User logged in',
      details: 'Successful authentication from Chrome browser',
      timestamp: '2024-01-18T08:00:00',
      duration: null,
      status: 'success',
      patient: null,
      sessionId: null
    },
    {
      id: 3,
      type: 'document',
      action: 'Medical record updated',
      details: 'Updated SOAP notes for Michael Chen',
      timestamp: '2024-01-17T16:45:00',
      duration: null,
      status: 'completed',
      patient: 'Michael Chen',
      sessionId: 'DOC-2024-015'
    },
    {
      id: 4,
      type: 'consultation',
      action: 'Audio consultation',
      details: 'Patient: Emma Wilson - Asthma management',
      timestamp: '2024-01-17T11:15:00',
      duration: 20,
      status: 'completed',
      patient: 'Emma Wilson',
      sessionId: 'AUD-2024-008'
    },
    {
      id: 5,
      type: 'prescription',
      action: 'Prescription generated',
      details: 'Digital prescription for David Brown',
      timestamp: '2024-01-17T09:30:00',
      duration: null,
      status: 'completed',
      patient: 'David Brown',
      sessionId: 'RX-2024-042'
    },
    {
      id: 6,
      type: 'emergency',
      action: 'Emergency consultation',
      details: 'Patient: John Smith - Chest pain assessment',
      timestamp: '2024-01-16T22:15:00',
      duration: 45,
      status: 'completed',
      patient: 'John Smith',
      sessionId: 'EMG-2024-003'
    },
    {
      id: 7,
      type: 'settings',
      action: 'Profile settings updated',
      details: 'Updated consultation fees and availability',
      timestamp: '2024-01-16T14:20:00',
      duration: null,
      status: 'completed',
      patient: null,
      sessionId: null
    },
    {
      id: 8,
      type: 'collaboration',
      action: 'Specialist referral sent',
      details: 'Referred patient to Dr. Emily Carter (Cardiology)',
      timestamp: '2024-01-16T10:00:00',
      duration: null,
      status: 'pending',
      patient: 'Lisa Thompson',
      sessionId: 'REF-2024-012'
    }
  ]);

  const [statistics] = useState({
    totalSessions: 127,
    consultationHours: 89.5,
    documentsCreated: 156,
    averageSessionTime: 28,
    thisWeek: {
      consultations: 18,
      hours: 12.5,
      documents: 22,
      logins: 8
    }
  });

  const activityTypes = [
    { id: 'all', name: 'All Activities', icon: HistoryIcon },
    { id: 'consultation', name: 'Consultations', icon: Video },
    { id: 'document', name: 'Documents', icon: FileText },
    { id: 'prescription', name: 'Prescriptions', icon: FileText },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'login', name: 'Login/Logout', icon: LogIn },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'consultation': return Video;
      case 'document': return FileText;
      case 'prescription': return FileText;
      case 'emergency': return AlertTriangle;
      case 'collaboration': return Users;
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'settings': return Settings;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-600';
      case 'document': return 'bg-green-100 text-green-600';
      case 'prescription': return 'bg-purple-100 text-purple-600';
      case 'emergency': return 'bg-red-100 text-red-600';
      case 'collaboration': return 'bg-orange-100 text-orange-600';
      case 'login': return 'bg-gray-100 text-gray-600';
      case 'logout': return 'bg-gray-100 text-gray-600';
      case 'settings': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.patient && activity.patient.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = formatTimestamp(activity.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Activity History
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Track your platform activity, session logs, and access history for complete accountability.
          </p>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900">{statistics.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
              <div className="text-xs text-green-600 mt-1">+{statistics.thisWeek.consultations} this week</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900">{statistics.consultationHours}h</div>
              <div className="text-sm text-gray-600">Consultation Hours</div>
              <div className="text-xs text-blue-600 mt-1">+{statistics.thisWeek.hours}h this week</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900">{statistics.documentsCreated}</div>
              <div className="text-sm text-gray-600">Documents Created</div>
              <div className="text-xs text-purple-600 mt-1">+{statistics.thisWeek.documents} this week</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900">{statistics.averageSessionTime}m</div>
              <div className="text-sm text-gray-600">Avg Session Time</div>
              <div className="text-xs text-orange-600 mt-1">{statistics.thisWeek.logins} logins this week</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Activity Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          {activityTypes.map((type, index) => {
            const Icon = type.icon;
            const count = selectedType === 'all' 
              ? activities.filter(a => a.type === type.id).length 
              : filteredActivities.length;
            
            return (
              <motion.button
                key={type.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                  selectedType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xs font-medium">{type.name}</div>
                {type.id !== 'all' && (
                  <div className="text-xs opacity-75 mt-1">
                    {activities.filter(a => a.type === type.id).length}
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {Object.entries(groupedActivities).map(([date, activities], groupIndex) => (
            <div key={date} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{date}</span>
                <span className="text-sm font-normal text-gray-500">({activities.length} activities)</span>
              </h3>
              
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{formatTime(activity.timestamp)}</span>
                              {activity.duration && (
                                <>
                                  <span>•</span>
                                  <span>{activity.duration} minutes</span>
                                </>
                              )}
                              {activity.sessionId && (
                                <>
                                  <span>•</span>
                                  <span>ID: {activity.sessionId}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'No activities recorded for the selected period'}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedPeriod('week');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;
