import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Video,
  MessageSquare,
  Share2,
  FileText,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  User,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  Image,
  Mic,
  MicOff,
  Download,
  Upload,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Info,
  UserPlus,
  Edit,
  Trash2,
  ArrowRight,
  Bell,
  Settings,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Activity,
  BookOpen,
  Archive,
  Flag,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorCollaboration = () => {
  const [activeTab, setActiveTab] = useState('colleagues');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showNewReferral, setShowNewReferral] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [activeCollaboration, setActiveCollaboration] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [onlineColleagues, setOnlineColleagues] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [sharedCases, setSharedCases] = useState([]);
  const [discussionThreads, setDiscussionThreads] = useState([]);

  // Sample data for doctors/colleagues
  const [colleagues] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      hospital: 'City Medical Center',
      experience: 15,
      rating: 4.9,
      consultationFee: 250,
      availability: 'online',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&auto=format',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'sarah.wilson@citymed.com',
        office: 'Room 302, Cardiology Wing'
      },
      expertise: ['Cardiac Catheterization', 'Angioplasty', 'Stent Placement', 'Heart Disease'],
      languages: ['English', 'Spanish'],
      education: 'MD from Harvard Medical School',
      achievements: ['Best Cardiologist 2023', 'Published 50+ Research Papers'],
      responseTime: '< 30 minutes',
      collaborationStats: {
        totalCases: 156,
        successRate: 94,
        averageRating: 4.8
      }
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      subSpecialty: 'Stroke & Cerebrovascular',
      hospital: 'Metro General Hospital',
      experience: 12,
      rating: 4.8,
      consultationFee: 300,
      availability: 'busy',
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format',
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@metrogeneral.com',
        office: 'Floor 4, Neurology Department'
      },
      expertise: ['Stroke Treatment', 'Neuroimaging', 'Epilepsy', 'Movement Disorders'],
      languages: ['English', 'Mandarin'],
      education: 'MD/PhD from Johns Hopkins',
      achievements: ['Stroke Prevention Award', 'NIH Research Grant Recipient'],
      responseTime: '< 1 hour',
      collaborationStats: {
        totalCases: 89,
        successRate: 91,
        averageRating: 4.7
      }
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Radiology',
      subSpecialty: 'Diagnostic Imaging',
      hospital: 'University Medical Center',
      experience: 10,
      rating: 4.7,
      consultationFee: 200,
      availability: 'online',
      profileImage: 'https://images.unsplash.com/photo-1594824475420-8ee4bb36e6dd?w=100&h=100&fit=crop&auto=format',
      contact: {
        phone: '+1 (555) 345-6789',
        email: 'emily.rodriguez@umc.edu',
        office: 'Radiology Suite B'
      },
      expertise: ['MRI Interpretation', 'CT Scans', 'X-ray Analysis', 'Nuclear Medicine'],
      languages: ['English', 'Spanish', 'Portuguese'],
      education: 'MD from Mayo Clinic College',
      achievements: ['Excellence in Imaging Award', 'Radiology Innovation Fellowship'],
      responseTime: '< 2 hours',
      collaborationStats: {
        totalCases: 234,
        successRate: 96,
        averageRating: 4.9
      }
    }
  ]);

  // Sample shared cases
  const [cases] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'John Smith',
      age: 45,
      gender: 'Male',
      chiefComplaint: 'Chest pain and shortness of breath',
      urgency: 'high',
      specialty: 'Cardiology',
      consultingDoctor: 'Dr. Sarah Wilson',
      requestedBy: 'Dr. James Thompson',
      status: 'active',
      submittedAt: '2024-01-15T10:30:00',
      lastUpdate: '2024-01-15T14:20:00',
      files: ['ECG_20240115.pdf', 'Chest_Xray.jpg', 'Lab_Results.pdf'],
      description: 'Patient presents with acute chest pain. Need cardiology consultation for risk stratification.',
      clinicalHistory: 'Hypertension, family history of CAD, smoker',
      currentMedications: ['Lisinopril 10mg', 'Aspirin 81mg'],
      vitalSigns: {
        bp: '140/90',
        hr: 88,
        temp: '98.6°F',
        spo2: '97%'
      },
      collaborators: [
        { id: 1, name: 'Dr. Sarah Wilson', role: 'Consultant', joinedAt: '2024-01-15T11:00:00' },
        { id: 2, name: 'Dr. James Thompson', role: 'Referring Doctor', joinedAt: '2024-01-15T10:30:00' }
      ],
      timeline: [
        {
          id: 1,
          timestamp: '2024-01-15T10:30:00',
          user: 'Dr. James Thompson',
          action: 'created_case',
          description: 'Case created and referred to cardiology'
        },
        {
          id: 2,
          timestamp: '2024-01-15T11:00:00',
          user: 'Dr. Sarah Wilson',
          action: 'accepted_case',
          description: 'Accepted consultation request'
        },
        {
          id: 3,
          timestamp: '2024-01-15T14:20:00',
          user: 'Dr. Sarah Wilson',
          action: 'added_opinion',
          description: 'Provided initial assessment and recommendations'
        }
      ]
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Maria Garcia',
      age: 32,
      gender: 'Female',
      chiefComplaint: 'Severe headache with visual disturbances',
      urgency: 'critical',
      specialty: 'Neurology',
      consultingDoctor: 'Dr. Michael Chen',
      requestedBy: 'Dr. Lisa Park',
      status: 'urgent',
      submittedAt: '2024-01-15T16:45:00',
      lastUpdate: '2024-01-15T17:30:00',
      files: ['Brain_MRI.dcm', 'Neurological_Exam.pdf'],
      description: 'Sudden onset severe headache with visual field defects. Concern for stroke.',
      clinicalHistory: 'No significant past medical history',
      currentMedications: ['Birth control pills'],
      vitalSigns: {
        bp: '160/95',
        hr: 95,
        temp: '99.2°F',
        spo2: '98%'
      }
    }
  ]);

  // Sample discussion threads
  const [threads] = useState([
    {
      id: 1,
      title: 'Rare Case: Young Adult with Cardiac Arrhythmia',
      category: 'Case Discussion',
      author: 'Dr. Sarah Wilson',
      participants: 12,
      messages: 23,
      lastActivity: '2024-01-15T18:30:00',
      tags: ['Cardiology', 'Arrhythmia', 'Young Adult'],
      description: 'Looking for input on unusual presentation of cardiac arrhythmia in 25-year-old athlete.',
      isUrgent: false,
      attachments: 3
    },
    {
      id: 2,
      title: 'COVID-19 Treatment Protocol Updates',
      category: 'Clinical Guidelines',
      author: 'Dr. Amanda Foster',
      participants: 45,
      messages: 89,
      lastActivity: '2024-01-15T17:15:00',
      tags: ['COVID-19', 'Protocol', 'Treatment'],
      description: 'Discussion on latest COVID-19 treatment protocols and evidence-based updates.',
      isUrgent: true,
      attachments: 8
    }
  ]);

  const specialties = [
    'Cardiology', 'Neurology', 'Radiology', 'Emergency Medicine', 'Internal Medicine',
    'Surgery', 'Pediatrics', 'Psychiatry', 'Dermatology', 'Orthopedics'
  ];

  const getSpecialtyIcon = (specialty) => {
    const icons = {
      'Cardiology': Heart,
      'Neurology': Brain,
      'Radiology': Eye,
      'Emergency Medicine': AlertTriangle,
      'Surgery': Target,
      'Orthopedics': Bone,
      'Pediatrics': User,
      'Psychiatry': Brain,
      'Internal Medicine': Stethoscope
    };
    return icons[specialty] || Stethoscope;
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const filteredColleagues = colleagues.filter(colleague => {
    const matchesSearch = colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || colleague.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const startVideoCollaboration = (colleague) => {
    setActiveCollaboration(colleague);
    setShowVideoCall(true);
    toast.success(`Starting video collaboration with ${colleague.name}`);
  };

  const sendMessage = (caseId) => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        caseId,
        sender: 'Current User',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
      };
      
      setNewMessage('');
      toast.success('Message sent');
    }
  };

  const createReferral = (colleagueId, caseData) => {
    const referral = {
      id: Date.now(),
      ...caseData,
      consultingDoctorId: colleagueId,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    setCollaborationRequests(prev => [...prev, referral]);
    setShowNewReferral(false);
    toast.success('Referral sent successfully');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Collaboration</h1>
              <p className="text-gray-600">Connect, consult, and collaborate with medical colleagues worldwide</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{onlineColleagues.length} Online</span>
              </div>
              <button
                onClick={() => setShowNewReferral(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Referral</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'colleagues', label: 'Colleagues', icon: Users, count: colleagues.length },
              { id: 'cases', label: 'Shared Cases', icon: FileText, count: cases.length },
              { id: 'discussions', label: 'Discussions', icon: MessageSquare, count: threads.length },
              { id: 'referrals', label: 'Referrals', icon: Share2, count: collaborationRequests.length }
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors, specialties, or cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'colleagues' && (
            <motion.div
              key="colleagues"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredColleagues.map((colleague) => {
                const SpecialtyIcon = getSpecialtyIcon(colleague.specialty);
                return (
                  <div key={colleague.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={colleague.profileImage}
                              alt={colleague.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getAvailabilityColor(colleague.availability)}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{colleague.name}</h3>
                            <p className="text-blue-100">{colleague.specialty}</p>
                            <p className="text-blue-200 text-sm">{colleague.hospital}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                            <span className="font-bold">{colleague.rating}</span>
                          </div>
                          <p className="text-blue-200 text-sm">{colleague.experience} years</p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {/* Expertise */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <SpecialtyIcon className="w-4 h-4 mr-2 text-blue-500" />
                            Expertise
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {colleague.expertise.slice(0, 3).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                            {colleague.expertise.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{colleague.expertise.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{colleague.collaborationStats.totalCases}</p>
                            <p className="text-xs text-gray-600">Cases</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">{colleague.collaborationStats.successRate}%</p>
                            <p className="text-xs text-gray-600">Success</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">{colleague.responseTime}</p>
                            <p className="text-xs text-gray-600">Response</p>
                          </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startVideoCollaboration(colleague)}
                            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            <span className="text-sm">Video Call</span>
                          </button>
                          <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">Message</span>
                          </button>
                          <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Refer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'cases' && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {cases.map((caseItem) => (
                <div key={caseItem.id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getUrgencyColor(caseItem.urgency)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{caseItem.patientName}</h3>
                          <p className="text-gray-600">{caseItem.age} years, {caseItem.gender}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            caseItem.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                            caseItem.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                            caseItem.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {caseItem.urgency.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {caseItem.specialty}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Chief Complaint</h4>
                          <p className="text-gray-600 text-sm">{caseItem.chiefComplaint}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Consulting Doctor</h4>
                          <p className="text-gray-600 text-sm">{caseItem.consultingDoctor}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Submitted {formatTimeAgo(caseItem.submittedAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Paperclip className="w-4 h-4" />
                          <span>{caseItem.files?.length || 0} files</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{caseItem.collaborators?.length || 1} collaborators</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedCase(caseItem);
                          setShowCaseDetails(true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'discussions' && (
            <motion.div
              key="discussions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {threads.map((thread) => (
                <div key={thread.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{thread.title}</h3>
                        {thread.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {thread.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{thread.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {thread.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>by {thread.author}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{thread.participants} participants</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.messages} messages</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(thread.lastActivity)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Join Discussion
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Case Details Modal */}
        <AnimatePresence>
          {showCaseDetails && selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowCaseDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Case Details: {selectedCase.patientName}</h2>
                  <button
                    onClick={() => setShowCaseDetails(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Patient Information */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{selectedCase.patientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age/Gender:</span>
                            <span className="font-medium">{selectedCase.age} years, {selectedCase.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Patient ID:</span>
                            <span className="font-medium">{selectedCase.patientId}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vital Signs */}
                      {selectedCase.vitalSigns && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">BP:</span>
                              <span className="font-medium">{selectedCase.vitalSigns.bp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">HR:</span>
                              <span className="font-medium">{selectedCase.vitalSigns.hr}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Temp:</span>
                              <span className="font-medium">{selectedCase.vitalSigns.temp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">SpO2:</span>
                              <span className="font-medium">{selectedCase.vitalSigns.spo2}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Clinical Information */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Clinical Information</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-gray-600">Chief Complaint:</span>
                            <p className="font-medium mt-1">{selectedCase.chiefComplaint}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Description:</span>
                            <p className="font-medium mt-1">{selectedCase.description}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Clinical History:</span>
                            <p className="font-medium mt-1">{selectedCase.clinicalHistory}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collaboration Section */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Collaboration</h3>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Add a comment or opinion..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => sendMessage(selectedCase.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorCollaboration;
