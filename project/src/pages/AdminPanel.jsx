import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  FileText, 
  Settings, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    activeConsultations: 45,
    totalReports: 890,
    emergencyAlerts: 12
  });

  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [120, 190, 300, 500, 200, 300],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    },
    consultationTypes: {
      labels: ['General', 'Emergency', 'Report Analysis', 'Prescription'],
      datasets: [{
        data: [45, 15, 25, 15],
        backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
      }]
    }
  });

  useEffect(() => {
    // Simulate loading data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate API calls
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-20' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'inactive', joinDate: '2024-01-25' }
    ];

    const mockConsultations = [
      { id: 1, patientName: 'John Doe', type: 'General', status: 'completed', date: '2024-01-28', aiConfidence: 85 },
      { id: 2, patientName: 'Jane Smith', type: 'Emergency', status: 'active', date: '2024-01-28', aiConfidence: 92 },
      { id: 3, patientName: 'Mike Johnson', type: 'Report Analysis', status: 'pending', date: '2024-01-28', aiConfidence: 78 }
    ];

    setUsers(mockUsers);
    setConsultations(mockConsultations);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'consultations', name: 'Consultations', icon: Activity },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{title}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your AI Doctor platform</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={systemStats.totalUsers.toLocaleString()}
                    icon={Users}
                    color="bg-blue-500"
                    change={12}
                  />
                  <StatCard
                    title="Active Consultations"
                    value={systemStats.activeConsultations}
                    icon={Activity}
                    color="bg-green-500"
                    change={8}
                  />
                  <StatCard
                    title="Reports Analyzed"
                    value={systemStats.totalReports}
                    icon={FileText}
                    color="bg-purple-500"
                    change={15}
                  />
                  <StatCard
                    title="Emergency Alerts"
                    value={systemStats.emergencyAlerts}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    change={-5}
                  />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64">
                      <Line 
                        data={analyticsData.userGrowth}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: 'top' } }
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Types</h3>
                    <div className="h-64">
                      <Doughnut 
                        data={analyticsData.consultationTypes}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: 'bottom' } }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {consultations.slice(0, 5).map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{consultation.patientName}</div>
                            <div className="text-sm text-gray-500">{consultation.type} - {consultation.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                            consultation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {consultation.status}
                          </span>
                          <span className="text-sm text-gray-500">{consultation.aiConfidence}% AI</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Consultations Tab */}
            {activeTab === 'consultations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">AI Consultations</h2>

                <div className="grid gap-6">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="bg-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{consultation.patientName}</h3>
                          <p className="text-gray-600">{consultation.type} Consultation</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                            consultation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {consultation.status}
                          </span>
                          <span className="text-sm text-gray-500">AI Confidence: {consultation.aiConfidence}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{consultation.date}</span>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>

                <div className="grid gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Confidence Threshold
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          defaultValue="75"
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>50%</span>
                          <span>95%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Alert Sensitivity
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Update AI Models
                      </button>
                      <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Backup Database
                      </button>
                      <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;