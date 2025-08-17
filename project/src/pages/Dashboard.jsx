import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  Shield,
  Brain,
  Zap,
  Target,
  Award,
  ChevronRight,
  Plus,
  BarChart3,
  Eye,
  Users,
  Stethoscope,
  TestTube,
  Camera,
  Microscope,
  Star,
  CheckCircle,
  Bookmark,
  History,
  MessageSquare,
  Video,
  Phone,
  Search,
  DollarSign,
  Lock,
  Settings,
  Globe,
  RefreshCw,
  Download,
  Share2,
  Filter,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Headphones,
  Mic,
  Volume2
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
  BarElement,
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
  ArcElement,
  BarElement
);

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            delay,
            ease: "easeOut" 
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, bgGradient, isIncrease = true }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-r ${bgGradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm text-gray-500 font-medium">{title}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          isIncrease ? 'text-green-700 bg-green-100' : 'text-blue-700 bg-blue-100'
        }`}>
          {subtitle}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <TrendingUp className={`w-3 h-3 mr-1 ${isIncrease ? 'text-green-500' : 'text-blue-500'}`} />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const QuickActionCard = ({ icon: Icon, title, description, link, color, urgent = false, stats }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link
      to={link}
      className={`relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden block ${
        urgent ? 'ring-2 ring-red-200 animate-pulse' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {urgent && (
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              URGENT
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            {stats}
          </span>
          <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform text-sm">
            <span className="mr-1">Open</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('overall');
  
  // Real-time vitals simulation
  const [vitals, setVitals] = useState({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygenLevel: 98,
    stepsToday: 8542,
    caloriesBurned: 320,
    sleepHours: 7.5,
    hydrationLevel: 75
  });

  // Health trend data
  const [healthTrends, setHealthTrends] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Heart Rate',
      data: [72, 75, 70, 78, 72, 74, 69],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Blood Pressure (Systolic)',
      data: [120, 118, 122, 119, 121, 117, 120],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  });

  // Activity data
  const activityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Exercise Minutes',
      data: [180, 220, 195, 240],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8
    }, {
      label: 'Sleep Hours',
      data: [52, 48, 54, 50],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 8
    }]
  };

  // Symptoms analysis
  const symptomsData = {
    labels: ['No Symptoms', 'Mild Fatigue', 'Headache', 'Stress', 'Others'],
    datasets: [{
      data: [60, 20, 10, 7, 3],
      backgroundColor: [
        '#10B981',
        '#3B82F6',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderWidth: 0,
      cutout: '65%'
    }]
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time vital updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        oxygenLevel: Math.max(95, Math.min(100, prev.oxygenLevel + (Math.random() - 0.5) * 2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'AI Diagnosis',
      description: 'Get instant medical analysis powered by advanced AI',
      icon: Brain,
      link: '/ai-diagnosis',
      color: 'from-purple-500 to-indigo-600',
      urgent: false,
      stats: '98% Accuracy'
    },
    {
      title: 'Emergency Care',
      description: 'Immediate medical assistance available 24/7',
      icon: AlertTriangle,
      link: '/emergency',
      color: 'from-red-500 to-pink-600',
      urgent: true,
      stats: '24/7 Available'
    },
    {
      title: 'Lab Reports',
      description: 'Analyze and interpret your medical reports',
      icon: TestTube,
      link: '/lab-reports-analysis',
      color: 'from-emerald-500 to-teal-600',
      urgent: false,
      stats: '5 sec Analysis'
    },
    {
      title: 'Smart Prescription',
      description: 'Get personalized medication recommendations',
      icon: Pill,
      link: '/prescription',
      color: 'from-blue-500 to-cyan-600',
      urgent: false,
      stats: 'FDA Approved'
    }
  ];

  const recentActivity = [
    { 
      type: 'diagnosis', 
      title: 'AI Health Check Completed', 
      time: '2 hours ago', 
      status: 'completed',
      confidence: 96,
      color: 'bg-blue-100 text-blue-700',
      icon: Brain
    },
    { 
      type: 'prescription', 
      title: 'Prescription Updated', 
      time: '1 day ago', 
      status: 'active',
      confidence: 94,
      color: 'bg-green-100 text-green-700',
      icon: Pill
    },
    { 
      type: 'report', 
      title: 'Blood Test Analyzed', 
      time: '2 days ago', 
      status: 'reviewed',
      confidence: 91,
      color: 'bg-purple-100 text-purple-700',
      icon: TestTube
    },
    { 
      type: 'consultation', 
      title: 'Video Consultation', 
      time: '3 days ago', 
      status: 'completed',
      confidence: 98,
      color: 'bg-indigo-100 text-indigo-700',
      icon: Video
    }
  ];

  const upcomingReminders = [
    { title: 'Morning Vitamins', time: '8:00 AM', type: 'medication', priority: 'high', icon: Pill },
    { title: 'Hydration Check', time: '10:00 AM', type: 'health', priority: 'medium', icon: Activity },
    { title: 'Exercise Routine', time: '6:00 PM', type: 'fitness', priority: 'medium', icon: Heart },
    { title: 'Sleep Reminder', time: '10:00 PM', type: 'wellness', priority: 'low', icon: Clock }
  ];

  const healthInsights = [
    {
      type: 'positive',
      message: 'Your cardiovascular health is excellent! Heart rate patterns show great consistency.',
      icon: Heart,
      color: 'text-green-600',
      bg: 'bg-green-50',
      action: 'View Trends',
      actionLink: '/health-trends'
    },
    {
      type: 'warning',
      message: 'Hydration levels could be improved. Consider increasing daily water intake.',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      action: 'Set Reminder',
      actionLink: '/reminders'
    },
    {
      type: 'info',
      message: 'Your last comprehensive health check was 2 months ago. Schedule your next one.',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      action: 'Schedule Now',
      actionLink: '/appointments'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Enhanced Header Section */}
        <AnimatedSection className="text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
              >
                Welcome back, 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
                  {user?.name || 'Dr. User'}!
                </span>
              </motion.h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Your AI-powered health dashboard with real-time insights and personalized recommendations.
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg"
              >
                <Shield className="w-6 h-6" />
                <div>
                  <div className="font-semibold">HIPAA Secure</div>
                  <div className="text-xs opacity-90">End-to-End Encrypted</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg"
              >
                <Activity className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Health Score: 85</div>
                  <div className="text-xs opacity-90">Excellent Status</div>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Live Health Vitals */}
        <AnimatedSection delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Live Health Vitals</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Real-time monitoring</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Heart}
              title="Heart Rate"
              value={`${Math.round(vitals.heartRate)} bpm`}
              subtitle="Normal Range"
              trend="+2% from avg"
              bgGradient="from-red-500 to-pink-600"
              isIncrease={true}
            />
            <MetricCard
              icon={Thermometer}
              title="Temperature"
              value={`${vitals.temperature.toFixed(1)}°F`}
              subtitle="Normal"
              trend="Stable"
              bgGradient="from-blue-500 to-cyan-600"
              isIncrease={false}
            />
            <MetricCard
              icon={Activity}
              title="Blood Pressure"
              value={vitals.bloodPressure}
              subtitle="Optimal"
              trend="Perfect range"
              bgGradient="from-purple-500 to-indigo-600"
              isIncrease={false}
            />
            <MetricCard
              icon={TrendingUp}
              title="Oxygen Level"
              value={`${Math.round(vitals.oxygenLevel)}%`}
              subtitle="Excellent"
              trend="Perfect"
              bgGradient="from-green-500 to-emerald-600"
              isIncrease={true}
            />
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Health Actions</h2>
            <Link 
              to="/micro-functionalities"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All Tools</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </AnimatedSection>

        {/* Health Insights */}
        <AnimatedSection delay={0.4}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Health Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className={`${insight.bg} p-6 rounded-3xl border-l-4 ${
                    insight.type === 'positive' ? 'border-green-500' :
                    insight.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
                  } hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      insight.type === 'positive' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{insight.message}</p>
                      <Link 
                        to={insight.actionLink}
                        className={`text-sm font-medium ${insight.color} hover:underline flex items-center space-x-1`}
                      >
                        <span>{insight.action}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Trends Chart */}
          <AnimatedSection delay={0.5} className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Health Trends (7 Days)</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Line 
                  data={healthTrends}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Symptoms Analysis */}
          <AnimatedSection delay={0.6}>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Health Status</h3>
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="h-48 mb-6">
                <Doughnut 
                  data={symptomsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      },
                    },
                  }}
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                <div className="text-sm text-gray-500">Overall Health Score</div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Recent Activity & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <AnimatedSection delay={0.7}>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent AI Activity</h3>
                <Link 
                  to="/history"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group cursor-pointer"
                    >
                      <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </div>
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
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Upcoming Reminders */}
          <AnimatedSection delay={0.8}>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Today's Reminders</h3>
                <Link 
                  to="/patient-followup"
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => {
                  const Icon = reminder.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{reminder.title}</div>
                        <div className="text-sm text-gray-500">{reminder.time}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                        reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {reminder.priority}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* AI Nurse Reminders */}
        <AnimatedSection delay={0.9}>
          <NurseReminders />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Dashboard;
