import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Send, 
  Upload, 
  Download, 
  Play, 
  Pause, 
  Square, 
  Camera, 
  Mic, 
  Save, 
  Share, 
  Star, 
  Heart, 
  Target, 
  Trophy, 
  Award, 
  CheckCircle, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Globe, 
  Clock, 
  Users, 
  TrendingUp,
  Activity,
  Utensils,
  Dumbbell,
  Bed,
  Apple,
  Droplets,
  Shield,
  AlertCircle,
  Info,
  ExternalLink,
  Smartphone,
  Monitor,
  Headphones
} from 'lucide-react';
import { toast } from 'react-toastify';

const PatientEducation = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Educational content library
  const [educationalContent, setEducationalContent] = useState([
    {
      id: 1,
      title: 'Understanding Hypertension',
      category: 'cardiovascular',
      type: 'video',
      duration: '8:45',
      description: 'Learn about high blood pressure, its causes, and management strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&auto=format',
      tags: ['blood pressure', 'heart health', 'prevention'],
      difficulty: 'beginner',
      views: 1250,
      rating: 4.8,
      source: 'American Heart Association'
    },
    {
      id: 2,
      title: 'Diabetes Diet Guidelines',
      category: 'endocrine',
      type: 'document',
      pages: 12,
      description: 'Comprehensive guide to nutrition and meal planning for diabetes management.',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop&auto=format',
      tags: ['diabetes', 'nutrition', 'meal planning'],
      difficulty: 'intermediate',
      views: 890,
      rating: 4.6,
      source: 'American Diabetes Association'
    },
    {
      id: 3,
      title: 'Breathing Exercises for Anxiety',
      category: 'mental-health',
      type: 'interactive',
      duration: '5:00',
      description: 'Guided breathing techniques to help manage anxiety and stress.',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format',
      tags: ['anxiety', 'breathing', 'stress management'],
      difficulty: 'beginner',
      views: 2100,
      rating: 4.9,
      source: 'Mental Health Foundation'
    }
  ]);

  // Custom content created by doctor
  const [customContent, setCustomContent] = useState([
    {
      id: 1,
      title: 'Post-Surgery Recovery Tips',
      type: 'video',
      duration: '3:20',
      createdDate: '2024-01-10',
      patients: ['John Smith', 'Maria Garcia'],
      description: 'Personalized recovery guidance for my patients.',
      thumbnail: 'video-thumb.jpg'
    }
  ]);

  // Diet and workout plans
  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 1,
      type: 'diet',
      title: 'Mediterranean Diet Plan',
      duration: '30 days',
      category: 'cardiovascular',
      description: 'Heart-healthy eating plan with delicious recipes.',
      meals: [
        { day: 1, breakfast: 'Greek yogurt with berries', lunch: 'Quinoa salad', dinner: 'Grilled salmon' },
        { day: 2, breakfast: 'Oatmeal with nuts', lunch: 'Lentil soup', dinner: 'Chicken with vegetables' }
      ],
      calories: 1800,
      assignedPatients: 5
    },
    {
      id: 2,
      type: 'exercise',
      title: 'Cardiac Rehabilitation Program',
      duration: '12 weeks',
      category: 'cardiovascular',
      description: 'Progressive exercise program for heart patients.',
      exercises: [
        { week: 1, activity: 'Walking', duration: '10 minutes', intensity: 'low' },
        { week: 2, activity: 'Walking', duration: '15 minutes', intensity: 'low-moderate' }
      ],
      assignedPatients: 3
    }
  ]);

  // Gamification data
  const [gamificationData, setGamificationData] = useState({
    badges: [
      { id: 1, name: 'Medication Master', icon: '💊', description: '7 days perfect medication adherence', earned: true },
      { id: 2, name: 'Exercise Enthusiast', icon: '🏃', description: '30 days of regular exercise', earned: false, progress: 65 },
      { id: 3, name: 'Heart Hero', icon: '❤️', description: 'Maintained healthy blood pressure', earned: true },
      { id: 4, name: 'Nutrition Navigator', icon: '🥗', description: 'Followed diet plan for 2 weeks', earned: false, progress: 85 }
    ],
    achievements: [
      { date: '2024-01-15', title: 'Completed first week of treatment', points: 100 },
      { date: '2024-01-12', title: 'Logged daily vitals consistently', points: 50 },
      { date: '2024-01-10', title: 'Watched educational video', points: 25 }
    ],
    totalPoints: 1250,
    level: 5,
    nextLevelPoints: 1500
  });

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'cardiovascular', name: 'Heart Health', icon: Heart },
    { id: 'diabetes', name: 'Diabetes', icon: Target },
    { id: 'mental-health', name: 'Mental Health', icon: Shield },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'exercise', name: 'Exercise', icon: Dumbbell },
    { id: 'general', name: 'General Health', icon: Activity }
  ];

  const trustedSources = [
    { name: 'WHO', url: 'https://who.int', logo: '🏛️' },
    { name: 'CDC', url: 'https://cdc.gov', logo: '🦠' },
    { name: 'Mayo Clinic', url: 'https://mayoclinic.org', logo: '🏥' },
    { name: 'WebMD', url: 'https://webmd.com', logo: '💻' }
  ];

  const filteredContent = educationalContent.filter(content => {
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      mediaRecorder.onstop = () => {
        clearInterval(timer);
        setIsRecording(false);
        setRecordingDuration(0);
        stream.getTracks().forEach(track => track.stop());
      };
      
      toast.success('Recording started');
    } catch (error) {
      toast.error('Could not access camera/microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      toast.success('Recording saved');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendContent = (contentId, patientId) => {
    toast.success('Educational content sent to patient');
  };

  const createCustomContent = (contentData) => {
    const newContent = {
      id: Date.now(),
      ...contentData,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCustomContent(prev => [...prev, newContent]);
    toast.success('Custom content created');
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Education & Engagement</h1>
              <p className="text-gray-600">Create, share, and track educational content for better patient outcomes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Content</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'library', label: 'Content Library', icon: BookOpen },
              { id: 'custom', label: 'My Content', icon: Video },
              { id: 'plans', label: 'Treatment Plans', icon: FileText },
              { id: 'gamification', label: 'Patient Progress', icon: Trophy },
              { id: 'create', label: 'Create Content', icon: Plus }
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
          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search educational content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-2 overflow-x-auto">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map(content => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          content.type === 'video' ? 'bg-red-100 text-red-800' :
                          content.type === 'document' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {content.type}
                        </span>
                      </div>
                      {content.type === 'video' && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {content.duration}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{content.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{content.rating}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          content.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          content.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {content.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                          Preview
                        </button>
                        <button
                          onClick={() => sendContent(content.id, 'patient-id')}
                          className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Send to Patient
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trusted Sources */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Medical Sources</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {trustedSources.map(source => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{source.logo}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{source.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          <span>Visit Site</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'plans' && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Diet Plans */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Diet & Nutrition Plans</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {treatmentPlans.filter(plan => plan.type === 'diet').map(plan => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{plan.title}</h4>
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        <Utensils className="w-8 h-8 text-green-500" />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Daily Calories:</span>
                          <span className="font-medium">{plan.calories}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Assigned Patients:</span>
                          <span className="font-medium">{plan.assignedPatients}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Sample Meals:</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          {plan.meals.slice(0, 2).map(meal => (
                            <div key={meal.day}>
                              <strong>Day {meal.day}:</strong> {meal.breakfast}, {meal.lunch}, {meal.dinner}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                          View Full Plan
                        </button>
                        <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Assign to Patient
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise Plans */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Exercise & Fitness Plans</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {treatmentPlans.filter(plan => plan.type === 'exercise').map(plan => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{plan.title}</h4>
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        <Dumbbell className="w-8 h-8 text-blue-500" />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Assigned Patients:</span>
                          <span className="font-medium">{plan.assignedPatients}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Program Overview:</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          {plan.exercises.slice(0, 2).map(exercise => (
                            <div key={exercise.week}>
                              <strong>Week {exercise.week}:</strong> {exercise.activity} - {exercise.duration} ({exercise.intensity})
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                          View Full Program
                        </button>
                        <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Assign to Patient
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gamification' && (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Patient Progress Overview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Gamified Recovery Tracking</h3>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900">{gamificationData.totalPoints}</h4>
                    <p className="text-gray-600">Total Points Earned</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <Award className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900">Level {gamificationData.level}</h4>
                    <p className="text-gray-600">Current Level</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <Star className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900">
                      {gamificationData.badges.filter(b => b.earned).length}/{gamificationData.badges.length}
                    </h4>
                    <p className="text-gray-600">Badges Earned</p>
                  </div>
                </div>

                {/* Progress Badges */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {gamificationData.badges.map(badge => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 ${
                          badge.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <span className="text-3xl">{badge.icon}</span>
                          <div className="flex-1">
                            <h5 className={`font-medium ${badge.earned ? 'text-green-800' : 'text-gray-600'}`}>
                              {badge.name}
                            </h5>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                            {!badge.earned && badge.progress && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span>{badge.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${badge.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {badge.earned && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
                  <div className="space-y-3">
                    {gamificationData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.date}</p>
                        </div>
                        <span className="font-semibold text-yellow-600">+{achievement.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Video Recording */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Video Content</h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full rounded-lg bg-gray-100"
                      style={{ height: '300px' }}
                    />
                    <div className="flex items-center justify-center mt-4 space-x-4">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Start Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <Square className="w-5 h-5" />
                          <span>Stop Recording</span>
                        </button>
                      )}
                    </div>
                    {isRecording && (
                      <div className="text-center mt-2 text-red-600 font-mono">
                        Recording: {formatTime(recordingDuration)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Video Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          placeholder="Enter video title..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows="4"
                          placeholder="Describe the video content..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="">Select category...</option>
                          <option value="general">General Health</option>
                          <option value="cardiovascular">Heart Health</option>
                          <option value="diabetes">Diabetes</option>
                          <option value="mental-health">Mental Health</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Patients</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700">John Smith</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700">Maria Garcia</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Create Document</h4>
                  <p className="text-gray-600 text-sm mb-4">Write educational articles and guides</p>
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Start Writing
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Utensils className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Diet Plan</h4>
                  <p className="text-gray-600 text-sm mb-4">Create personalized nutrition plans</p>
                  <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Create Plan
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Dumbbell className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Exercise Program</h4>
                  <p className="text-gray-600 text-sm mb-4">Design workout routines for patients</p>
                  <button className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Design Program
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientEducation;
