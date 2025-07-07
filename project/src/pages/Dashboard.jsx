import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Clock, 
  FileText, 
  Pill,
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,
  ArrowRight,
  Bell,
  Shield
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useUser } from '../context/UserContext.jsx';
import NurseReminders from '../components/NurseReminders.jsx';
import HealthTrends from '../components/HealthTrends.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user, medicalHistory, prescriptions } = useUser();
  const [vitals, setVitals] = useState({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygenLevel: 98
  });

  const [healthTrends, setHealthTrends] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Heart Rate',
      data: [72, 75, 70, 78, 72, 74],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  });

  const [symptomsData, setSymptomsData] = useState({
    labels: ['Headache', 'Fever', 'Cough', 'Fatigue', 'Others'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderWidth: 0
    }]
  });

  const quickActions = [
    {
      title: 'AI Diagnosis',
      description: 'Start AI-powered symptom analysis',
      icon: Activity,
      link: '/diagnosis',
      color: 'from-blue-500 to-blue-600',
      urgent: false
    },
    {
      title: 'Analyze Report',
      description: 'Upload medical reports for AI analysis',
      icon: FileText,
      link: '/report-analyzer',
      color: 'from-green-500 to-green-600',
      urgent: false
    },
    {
      title: 'Get Prescription',
      description: 'AI-generated medication recommendations',
      icon: Pill,
      link: '/prescription',
      color: 'from-purple-500 to-purple-600',
      urgent: false
    },
    {
      title: 'Emergency Help',
      description: 'Immediate medical assistance',
      icon: AlertTriangle,
      link: '/emergency',
      color: 'from-red-500 to-red-600',
      urgent: true
    }
  ];

  const recentActivity = [
    { 
      type: 'diagnosis', 
      title: 'AI Diagnosis: Common Cold', 
      time: '2 hours ago', 
      status: 'completed',
      confidence: 85
    },
    { 
      type: 'prescription', 
      title: 'Prescription Generated', 
      time: '1 day ago', 
      status: 'active',
      confidence: 92
    },
    { 
      type: 'report', 
      title: 'Blood Test Analysis', 
      time: '3 days ago', 
      status: 'reviewed',
      confidence: 88
    },
    { 
      type: 'emergency', 
      title: 'First Aid Consultation', 
      time: '1 week ago', 
      status: 'resolved',
      confidence: 95
    }
  ];

  const upcomingReminders = [
    { title: 'Take Morning Vitamins', time: '8:00 AM', type: 'medication', priority: 'high' },
    { title: 'Drink Water', time: '10:00 AM', type: 'hydration', priority: 'medium' },
    { title: 'Evening Exercise', time: '6:00 PM', type: 'exercise', priority: 'medium' },
    { title: 'Sleep Reminder', time: '10:00 PM', type: 'sleep', priority: 'low' }
  ];

  const healthInsights = [
    {
      type: 'positive',
      message: 'Your heart rate has been stable this week',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      type: 'warning',
      message: 'Remember to stay hydrated - aim for 8 glasses daily',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      type: 'info',
      message: 'Your last checkup was 3 months ago',
      icon: Calendar,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">
                Here's your health overview and AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">AI Protected</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Health Score: 85</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Vitals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Normal</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{vitals.heartRate}</div>
            <div className="text-gray-500 text-sm">Heart Rate (bpm)</div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+2% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Normal</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{vitals.temperature}°F</div>
            <div className="text-gray-500 text-sm">Temperature</div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Stable</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Normal</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{vitals.bloodPressure}</div>
            <div className="text-gray-500 text-sm">Blood Pressure</div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Optimal range</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Excellent</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{vitals.oxygenLevel}%</div>
            <div className="text-gray-500 text-sm">Oxygen Level</div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Perfect</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI-Powered Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                    action.urgent ? 'ring-2 ring-red-200 animate-pulse' : ''
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                    {action.urgent && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Urgent</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI Health Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      insight.type === 'positive' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Health Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <HealthTrends />
          </motion.div>

          {/* Symptoms Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Symptoms</h3>
            <div className="h-64">
              <Doughnut 
                data={symptomsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>AI Confidence: {activity.confidence}%</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    activity.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Reminders</h3>
            <div className="space-y-4">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{reminder.title}</div>
                    <div className="text-sm text-gray-500">{reminder.time}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                    reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {reminder.priority}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Nurse Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <NurseReminders />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;