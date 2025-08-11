import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Video, 
  MessageSquare, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  MoreVertical, 
  MapPin, 
  Mail, 
  User, 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  Camera, 
  Shield, 
  Zap, 
  Target, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Flag,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Share,
  Settings,
  History,
  Bookmark,
  Archive,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // Patient Queue State
  const [patientQueue, setPatientQueue] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'male',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      appointmentTime: '09:00 AM',
      appointmentType: 'scheduled',
      priority: 'normal',
      chiefComplaint: 'Chest pain and shortness of breath',
      waitingTime: 15,
      status: 'waiting',
      paymentStatus: 'paid',
      consultationType: 'video',
      lastVisit: '2024-01-10',
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'john.smith@email.com',
        address: '123 Main St, New York, NY 10001'
      },
      medicalInfo: {
        allergies: ['Penicillin', 'Shellfish'],
        currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
        familyHistory: 'Father: Heart disease, Mother: Diabetes',
        pastMedicalHistory: 'Appendectomy (2010), Broken arm (2018)',
        insuranceProvider: 'Blue Cross Blue Shield',
        emergencyContact: 'Jane Smith (Wife) - +1 (555) 123-4568'
      },
      aiPreDiagnosis: {
        confidence: 85,
        suggestedConditions: ['Angina', 'Acid Reflux', 'Anxiety'],
        recommendedTests: ['ECG', 'Chest X-ray', 'Blood pressure'],
        riskFactors: ['Age', 'Diabetes', 'Hypertension'],
        urgencyLevel: 'moderate'
      },
      vitals: {
        bloodPressure: '140/90',
        heartRate: 88,
        temperature: 98.6,
        oxygenSaturation: 97,
        weight: 180,
        height: '5\'10"',
        bmi: 25.8
      }
    },
    {
      id: 2,
      name: 'Maria Garcia',
      age: 32,
      gender: 'female',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&auto=format',
      appointmentTime: '09:30 AM',
      appointmentType: 'walk-in',
      priority: 'high',
      chiefComplaint: 'Severe headache and nausea',
      waitingTime: 45,
      status: 'waiting',
      paymentStatus: 'pending',
      consultationType: 'video',
      lastVisit: '2023-11-15',
      contactInfo: {
        phone: '+1 (555) 234-5678',
        email: 'maria.garcia@email.com',
        address: '456 Oak Ave, Brooklyn, NY 11201'
      },
      medicalInfo: {
        allergies: ['Aspirin'],
        currentMedications: ['Birth control pills'],
        chronicConditions: [],
        familyHistory: 'Mother: Migraines',
        pastMedicalHistory: 'No significant history',
        insuranceProvider: 'Aetna',
        emergencyContact: 'Carlos Garcia (Husband) - +1 (555) 234-5679'
      },
      aiPreDiagnosis: {
        confidence: 78,
        suggestedConditions: ['Migraine', 'Tension headache', 'Sinus infection'],
        recommendedTests: ['Blood pressure', 'Neurological exam'],
        riskFactors: ['Female', 'Age group'],
        urgencyLevel: 'high'
      },
      vitals: {
        bloodPressure: '110/70',
        heartRate: 95,
        temperature: 99.2,
        oxygenSaturation: 98,
        weight: 135,
        height: '5\'6"',
        bmi: 21.8
      }
    },
    {
      id: 3,
      name: 'Robert Johnson',
      age: 68,
      gender: 'male',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
      appointmentTime: '10:00 AM',
      appointmentType: 'scheduled',
      priority: 'critical',
      chiefComplaint: 'Difficulty breathing and chest tightness',
      waitingTime: 5,
      status: 'in-consultation',
      paymentStatus: 'paid',
      consultationType: 'video',
      lastVisit: '2024-01-05',
      contactInfo: {
        phone: '+1 (555) 345-6789',
        email: 'robert.johnson@email.com',
        address: '789 Pine St, Manhattan, NY 10002'
      },
      medicalInfo: {
        allergies: ['Sulfa drugs', 'Latex'],
        currentMedications: ['Warfarin 5mg', 'Furosemide 40mg', 'Carvedilol 25mg'],
        chronicConditions: ['Heart failure', 'Atrial fibrillation'],
        familyHistory: 'Father: Heart attack, Mother: Stroke',
        pastMedicalHistory: 'CABG (2018), Pacemaker implant (2020)',
        insuranceProvider: 'Medicare',
        emergencyContact: 'Linda Johnson (Daughter) - +1 (555) 345-6780'
      },
      aiPreDiagnosis: {
        confidence: 92,
        suggestedConditions: ['Heart failure exacerbation', 'Pneumonia', 'COPD'],
        recommendedTests: ['ECG', 'Chest X-ray', 'BNP', 'Complete blood count'],
        riskFactors: ['Age', 'Heart failure', 'Previous cardiac surgery'],
        urgencyLevel: 'critical'
      },
      vitals: {
        bloodPressure: '150/95',
        heartRate: 110,
        temperature: 100.1,
        oxygenSaturation: 92,
        weight: 200,
        height: '6\'0"',
        bmi: 27.1
      }
    }
  ]);

  const [scheduledPatients, setScheduledPatients] = useState([
    {
      id: 4,
      name: 'Emily Chen',
      age: 28,
      appointmentTime: '11:00 AM',
      appointmentType: 'follow-up',
      priority: 'normal',
      chiefComplaint: 'Routine check-up for diabetes management',
      consultationType: 'video',
      status: 'scheduled'
    },
    {
      id: 5,
      name: 'Michael Brown',
      age: 55,
      appointmentTime: '11:30 AM',
      appointmentType: 'consultation',
      priority: 'normal',
      chiefComplaint: 'High blood pressure monitoring',
      consultationType: 'phone',
      status: 'scheduled'
    }
  ]);

  const [patientHistory, setPatientHistory] = useState([
    {
      id: 6,
      name: 'Sarah Wilson',
      age: 42,
      lastConsultation: '2024-01-14',
      consultationType: 'video',
      diagnosis: 'Acute bronchitis',
      status: 'completed',
      rating: 5
    },
    {
      id: 7,
      name: 'David Miller',
      age: 35,
      lastConsultation: '2024-01-13',
      consultationType: 'text',
      diagnosis: 'Common cold',
      status: 'completed',
      rating: 4
    }
  ]);

  const priorityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    normal: 'bg-green-100 text-green-800 border-green-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const statusColors = {
    waiting: 'bg-yellow-100 text-yellow-800',
    'in-consultation': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    scheduled: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const acceptPatient = (patientId) => {
    setPatientQueue(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'in-consultation' }
        : patient
    ));
    toast.success('Patient consultation started');
  };

  const rejectPatient = (patientId, reason) => {
    setPatientQueue(prev => prev.filter(patient => patient.id !== patientId));
    toast.info(`Patient consultation declined: ${reason}`);
  };

  const setPriority = (patientId, priority) => {
    setPatientQueue(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, priority }
        : patient
    ));
    toast.success(`Patient priority updated to ${priority}`);
  };

  const startConsultation = (patient, mode) => {
    toast.success(`Starting ${mode} consultation with ${patient.name}`);
    // This would typically open the consultation interface
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const filteredQueue = patientQueue.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || patient.priority === filterBy || patient.status === filterBy;
    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management</h1>
              <p className="text-gray-600">Manage your patient queue, appointments, and consultations</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{patientQueue.length} in Queue</span>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                <UserPlus className="w-5 h-5" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'queue', label: 'Current Queue', icon: Users, count: patientQueue.length },
              { id: 'scheduled', label: 'Scheduled', icon: Calendar, count: scheduledPatients.length },
              { id: 'history', label: 'History', icon: History, count: patientHistory.length }
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
                placeholder="Search patients by name or complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Patients</option>
                <option value="critical">Critical</option>
                <option value="high">High Priority</option>
                <option value="normal">Normal</option>
                <option value="waiting">Waiting</option>
                <option value="in-consultation">In Consultation</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredQueue.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                    patient.priority === 'critical' ? 'border-red-500' :
                    patient.priority === 'high' ? 'border-orange-500' :
                    patient.priority === 'normal' ? 'border-green-500' : 'border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative">
                        <img
                          src={patient.profilePhoto}
                          alt={patient.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          patient.status === 'waiting' ? 'bg-yellow-500' :
                          patient.status === 'in-consultation' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{patient.age} years, {patient.gender}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[patient.priority]}`}>
                            {patient.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                            {patient.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
                            <p className="text-gray-900">{patient.chiefComplaint}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Appointment Details</p>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">{patient.appointmentTime}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{patient.appointmentType}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">Waiting: {patient.waitingTime}m</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Pre-diagnosis */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">AI Pre-Diagnosis</h4>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {patient.aiPreDiagnosis.confidence}% confidence
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Suggested Conditions:</p>
                              <div className="flex flex-wrap gap-1">
                                {patient.aiPreDiagnosis.suggestedConditions.map((condition, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1">Recommended Tests:</p>
                              <div className="flex flex-wrap gap-1">
                                {patient.aiPreDiagnosis.recommendedTests.map((test, i) => (
                                  <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                    {test}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{patient.contactInfo.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>{patient.medicalInfo.insuranceProvider}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Last visit: {patient.lastVisit}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => viewPatientDetails(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {patient.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => startConsultation(patient, 'video')}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            <span>Video</span>
                          </button>
                          <button
                            onClick={() => startConsultation(patient, 'voice')}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Voice</span>
                          </button>
                          <button
                            onClick={() => startConsultation(patient, 'text')}
                            className="flex items-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Text</span>
                          </button>
                        </>
                      )}
                      
                      <div className="relative">
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'scheduled' && (
            <motion.div
              key="scheduled"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {scheduledPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-gray-600">{patient.age} years • {patient.appointmentType}</p>
                        <p className="text-sm text-gray-500">{patient.chiefComplaint}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{patient.appointmentTime}</p>
                        <p className="text-sm text-gray-500">{patient.consultationType} consultation</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {patientHistory.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-gray-600">{patient.age} years • {patient.diagnosis}</p>
                        <p className="text-sm text-gray-500">Last consultation: {patient.lastConsultation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < patient.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Patient Details Modal */}
        <AnimatePresence>
          {showPatientDetails && selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowPatientDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedPatient.profilePhoto}
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-gray-600">{selectedPatient.age} years, {selectedPatient.gender}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Current Visit */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Visit</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Chief Complaint</p>
                        <p className="text-gray-900 font-medium">{selectedPatient.chiefComplaint}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Appointment Time</p>
                        <p className="text-gray-900 font-medium">{selectedPatient.appointmentTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Priority Level</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[selectedPatient.priority]}`}>
                          {selectedPatient.priority}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Consultation Type</p>
                        <p className="text-gray-900 font-medium">{selectedPatient.consultationType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-900">{selectedPatient.contactInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-900">{selectedPatient.contactInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-gray-900">{selectedPatient.contactInfo.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Emergency Contact</p>
                          <p className="text-gray-900">{selectedPatient.medicalInfo.emergencyContact}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalInfo.allergies.map((allergy, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Current Medications</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalInfo.currentMedications.map((medication, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {medication}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalInfo.chronicConditions.map((condition, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Family History</p>
                        <p className="text-gray-900">{selectedPatient.medicalInfo.familyHistory}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Past Medical History</p>
                        <p className="text-gray-900">{selectedPatient.medicalInfo.pastMedicalHistory}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Vitals */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Vitals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.bloodPressure}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Activity className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.heartRate} bpm</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.temperature}°F</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Activity className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                        <p className="text-sm text-gray-600">Oxygen Sat.</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.vitals.oxygenSaturation}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => startConsultation(selectedPatient, 'video')}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      <span>Start Video Call</span>
                    </button>
                    <button
                      onClick={() => startConsultation(selectedPatient, 'voice')}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Start Voice Call</span>
                    </button>
                    <button
                      onClick={() => startConsultation(selectedPatient, 'text')}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Start Text Chat</span>
                    </button>
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

export default PatientManagement;
