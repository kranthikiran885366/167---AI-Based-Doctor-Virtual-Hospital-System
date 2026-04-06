import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  Target,
  Activity,
  TrendingUp,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Archive,
  RefreshCw,
  Settings,
  Bell,
  Info,
  X,
  Zap,
  Database,
  Monitor,
  Smartphone,
  Printer,
  Share,
  Copy,
  Flag,
  AlertCircle,
  Lock,
  Unlock,
  History
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCompliance = () => {
  const [activeTab, setActiveTab] = useState('notices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [complianceForms, setComplianceForms] = useState([]);
  const [cmeProgress, setCmeProgress] = useState([]);
  const [reportedCases, setReportedCases] = useState([]);
  const [trainingModules, setTrainingModules] = useState([]);

  const [hospitalNotices, setHospitalNotices] = useState([
    {
      id: 1,
      title: 'Updated COVID-19 Treatment Protocols',
      category: 'Clinical Guidelines',
      priority: 'high',
      publishedDate: '2024-01-15T10:00:00',
      expiryDate: '2024-03-15T23:59:59',
      department: 'Infectious Disease',
      content: 'New treatment protocols for COVID-19 patients based on latest WHO guidelines. All medical staff must review and acknowledge receipt.',
      attachments: ['COVID_Protocol_2024.pdf', 'Quick_Reference_Guide.pdf'],
      acknowledgmentRequired: true,
      acknowledged: false,
      authorizedBy: 'Dr. Sarah Johnson, Chief Medical Officer',
      distributionList: ['All Medical Staff', 'Nursing Staff', 'Emergency Department'],
      tags: ['COVID-19', 'Treatment', 'Protocol', 'Mandatory'],
      readBy: 245,
      totalRecipients: 320
    },
    {
      id: 2,
      title: 'New Electronic Health Record System Launch',
      category: 'System Update',
      priority: 'medium',
      publishedDate: '2024-01-12T14:30:00',
      expiryDate: '2024-02-12T23:59:59',
      department: 'IT Department',
      content: 'The new EHR system will go live on February 1st, 2024. Mandatory training sessions are scheduled for all medical staff.',
      attachments: ['EHR_Training_Schedule.pdf', 'User_Manual.pdf'],
      acknowledgmentRequired: true,
      acknowledged: true,
      acknowledgedAt: '2024-01-13T09:15:00',
      authorizedBy: 'IT Administration',
      distributionList: ['All Staff'],
      tags: ['EHR', 'Training', 'System Update'],
      readBy: 298,
      totalRecipients: 320
    },
    {
      id: 3,
      title: 'Hospital Safety Protocols Update',
      category: 'Safety & Security',
      priority: 'high',
      publishedDate: '2024-01-10T08:00:00',
      expiryDate: '2024-04-10T23:59:59',
      department: 'Safety Committee',
      content: 'Updated safety protocols for handling hazardous materials and emergency procedures. Immediate implementation required.',
      attachments: ['Safety_Protocols_2024.pdf'],
      acknowledgmentRequired: true,
      acknowledged: false,
      authorizedBy: 'Safety Committee Chair',
      distributionList: ['All Departments'],
      tags: ['Safety', 'Emergency', 'Protocols', 'Immediate'],
      readBy: 156,
      totalRecipients: 320
    }
  ]);

  const [availableComplianceForms, setAvailableComplianceForms] = useState([
    {
      id: 1,
      title: 'HIPAA Privacy and Security Acknowledgment',
      category: 'Privacy & Security',
      description: 'Annual acknowledgment of HIPAA privacy and security policies',
      requiredBy: '2024-03-31T23:59:59',
      status: 'pending',
      frequency: 'annual',
      fields: [
        { name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { name: 'employee_id', label: 'Employee ID', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true },
        { name: 'training_completed', label: 'HIPAA Training Completed', type: 'checkbox', required: true },
        { name: 'understanding_confirmed', label: 'I confirm my understanding of HIPAA policies', type: 'checkbox', required: true }
      ]
    },
    {
      id: 2,
      title: 'GDPR Data Protection Compliance',
      category: 'Data Protection',
      description: 'European data protection regulation compliance form',
      requiredBy: '2024-05-25T23:59:59',
      status: 'completed',
      completedAt: '2024-01-10T14:30:00',
      frequency: 'annual',
      fields: [
        { name: 'data_processing_awareness', label: 'Data Processing Awareness', type: 'checkbox', required: true },
        { name: 'patient_consent_procedures', label: 'Patient Consent Procedures Understanding', type: 'checkbox', required: true },
        { name: 'breach_reporting', label: 'Data Breach Reporting Procedures', type: 'checkbox', required: true }
      ]
    },
    {
      id: 3,
      title: 'Infection Control Compliance',
      category: 'Infection Control',
      description: 'Annual infection control and prevention compliance certification',
      requiredBy: '2024-06-30T23:59:59',
      status: 'pending',
      frequency: 'annual',
      fields: [
        { name: 'hand_hygiene_training', label: 'Hand Hygiene Training Completed', type: 'checkbox', required: true },
        { name: 'ppe_protocols', label: 'PPE Usage Protocols Understanding', type: 'checkbox', required: true },
        { name: 'isolation_procedures', label: 'Isolation Procedures Certification', type: 'checkbox', required: true }
      ]
    }
  ]);

  const [cmeModules, setCmeModules] = useState([
    {
      id: 1,
      title: 'Advanced Cardiovascular Life Support (ACLS)',
      category: 'Emergency Medicine',
      credits: 4,
      provider: 'American Heart Association',
      deadline: '2024-12-31T23:59:59',
      status: 'in_progress',
      progress: 65,
      estimatedTime: '8 hours',
      description: 'Advanced cardiovascular life support training for healthcare providers',
      modules: [
        { id: 1, title: 'Systematic Approach to Resuscitation', completed: true, duration: '1 hour' },
        { id: 2, title: 'High-Quality CPR', completed: true, duration: '1.5 hours' },
        { id: 3, title: 'Airway Management', completed: true, duration: '1 hour' },
        { id: 4, title: 'Cardiac Arrest Algorithms', completed: false, duration: '2 hours' },
        { id: 5, title: 'Acute Coronary Syndromes', completed: false, duration: '1.5 hours' },
        { id: 6, title: 'Stroke Management', completed: false, duration: '1 hour' }
      ]
    },
    {
      id: 2,
      title: 'Telemedicine Best Practices',
      category: 'Digital Health',
      credits: 3,
      provider: 'Digital Health Institute',
      deadline: '2024-08-15T23:59:59',
      status: 'not_started',
      progress: 0,
      estimatedTime: '6 hours',
      description: 'Best practices for telemedicine consultations and digital health technologies',
      modules: [
        { id: 1, title: 'Introduction to Telemedicine', completed: false, duration: '1 hour' },
        { id: 2, title: 'Patient Privacy in Digital Consultations', completed: false, duration: '1.5 hours' },
        { id: 3, title: 'Clinical Decision Making via Telemedicine', completed: false, duration: '2 hours' },
        { id: 4, title: 'Technology Tools and Platforms', completed: false, duration: '1.5 hours' }
      ]
    },
    {
      id: 3,
      title: 'Antimicrobial Stewardship',
      category: 'Infectious Disease',
      credits: 2,
      provider: 'CDC Learning Connection',
      deadline: '2024-09-30T23:59:59',
      status: 'completed',
      progress: 100,
      completedAt: '2024-01-05T16:30:00',
      estimatedTime: '4 hours',
      description: 'Principles and practices of antimicrobial stewardship in healthcare settings',
      modules: [
        { id: 1, title: 'Introduction to Antimicrobial Stewardship', completed: true, duration: '1 hour' },
        { id: 2, title: 'Antibiotic Resistance Mechanisms', completed: true, duration: '1 hour' },
        { id: 3, title: 'Stewardship Interventions', completed: true, duration: '1.5 hours' },
        { id: 4, title: 'Implementation Strategies', completed: true, duration: '0.5 hours' }
      ]
    }
  ]);

  const [ethicalCases, setEthicalCases] = useState([
    {
      id: 1,
      title: 'Suspected Patient Abuse Case',
      category: 'Patient Abuse',
      severity: 'high',
      reportedDate: '2024-01-14T15:30:00',
      reportedBy: 'Anonymous',
      department: 'Emergency Department',
      status: 'under_investigation',
      description: 'Suspected physical abuse of elderly patient. Injuries inconsistent with reported cause.',
      actionsTaken: [
        'Patient safety ensured',
        'Social services contacted',
        'Investigation initiated',
        'Documentation preserved'
      ],
      followUpRequired: true,
      followUpDate: '2024-01-21T10:00:00',
      assignedTo: 'Ethics Committee Chair',
      confidential: true
    },
    {
      id: 2,
      title: 'Inappropriate Prescribing Practices',
      category: 'Professional Misconduct',
      severity: 'medium',
      reportedDate: '2024-01-10T09:15:00',
      reportedBy: 'Dr. Anonymous',
      department: 'Internal Medicine',
      status: 'resolved',
      description: 'Colleague prescribing unnecessary controlled substances to patients.',
      actionsTaken: [
        'Peer review conducted',
        'Additional training provided',
        'Monitoring implemented',
        'Case closed'
      ],
      followUpRequired: false,
      resolvedDate: '2024-01-12T14:00:00',
      assignedTo: 'Medical Director',
      confidential: true
    }
  ]);

  const [systemTrainingModules, setSystemTrainingModules] = useState([
    {
      id: 1,
      title: 'Electronic Health Records (EHR) Version 2024.1',
      category: 'System Training',
      version: '2024.1',
      releaseDate: '2024-01-01T00:00:00',
      mandatory: true,
      deadline: '2024-02-15T23:59:59',
      status: 'pending',
      estimatedTime: '2 hours',
      description: 'Training on new features and updates in the EHR system',
      topics: [
        'New user interface',
        'Enhanced clinical documentation',
        'Improved order entry system',
        'Updated reporting features'
      ]
    },
    {
      id: 2,
      title: 'Telemedicine Platform Training',
      category: 'Digital Tools',
      version: '3.0',
      releaseDate: '2024-01-10T00:00:00',
      mandatory: true,
      deadline: '2024-02-28T23:59:59',
      status: 'completed',
      completedAt: '2024-01-12T11:30:00',
      estimatedTime: '1.5 hours',
      description: 'Training on the upgraded telemedicine consultation platform',
      topics: [
        'Multi-camera support',
        'AR anatomy overlay features',
        'Enhanced security protocols',
        'Patient data integration'
      ]
    }
  ]);

  useEffect(() => {
    calculateCMEProgress();
  }, [cmeModules]);

  const calculateCMEProgress = () => {
    const progress = cmeModules.map(module => ({
      moduleId: module.id,
      title: module.title,
      totalCredits: module.credits,
      earnedCredits: module.status === 'completed' ? module.credits : Math.floor(module.credits * (module.progress / 100)),
      deadline: module.deadline,
      status: module.status
    }));
    setCmeProgress(progress);
  };

  const acknowledgeNotice = (noticeId) => {
    setHospitalNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, acknowledged: true, acknowledgedAt: new Date().toISOString() }
        : notice
    ));
    toast.success('Notice acknowledged successfully');
  };

  const submitComplianceForm = (formId, formData) => {
    setAvailableComplianceForms(prev => prev.map(form => 
      form.id === formId 
        ? { 
            ...form, 
            status: 'completed', 
            completedAt: new Date().toISOString(),
            submittedData: formData
          }
        : form
    ));
    toast.success('Compliance form submitted successfully');
  };

  const reportEthicalCase = (caseData) => {
    const newCase = {
      id: Date.now(),
      ...caseData,
      reportedDate: new Date().toISOString(),
      status: 'reported',
      confidential: true
    };
    setEthicalCases(prev => [...prev, newCase]);
    toast.success('Ethical case reported. Investigation will begin shortly.');
  };

  const startCMEModule = (moduleId) => {
    setCmeModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, status: 'in_progress', progress: 0 }
        : module
    ));
    toast.info('CME module started');
  };

  const completeCMEModule = (moduleId) => {
    setCmeModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            status: 'completed', 
            progress: 100,
            completedAt: new Date().toISOString()
          }
        : module
    ));
    toast.success('CME module completed successfully');
  };

  const markTrainingComplete = (trainingId) => {
    setSystemTrainingModules(prev => prev.map(training => 
      training.id === trainingId 
        ? { 
            ...training, 
            status: 'completed',
            completedAt: new Date().toISOString()
          }
        : training
    ));
    toast.success('Training module completed');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotices = hospitalNotices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'notices', name: 'Hospital Notices', icon: Bell },
    { id: 'compliance', name: 'Compliance Forms', icon: Shield },
    { id: 'cme', name: 'CME Training', icon: GraduationCap },
    { id: 'ethics', name: 'Ethics & Reporting', icon: Flag },
    { id: 'training', name: 'System Training', icon: Monitor }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Administrative & Compliance</h1>
              <p className="text-gray-600">Hospital notices, compliance forms, training, and ethics reporting</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map(tab => {
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
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Total Notices</h3>
                      <p className="text-2xl font-bold text-blue-800">{hospitalNotices.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">Pending Acknowledgment</h3>
                      <p className="text-2xl font-bold text-yellow-800">
                        {hospitalNotices.filter(notice => !notice.acknowledged).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Acknowledged</h3>
                      <p className="text-2xl font-bold text-green-800">
                        {hospitalNotices.filter(notice => notice.acknowledged).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredNotices.map(notice => (
                  <div key={notice.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                            {notice.priority.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {notice.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{notice.content}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Department:</span> {notice.department}
                          </div>
                          <div>
                            <span className="font-medium">Published:</span> {new Date(notice.publishedDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span> {new Date(notice.expiryDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Read by:</span> {notice.readBy}/{notice.totalRecipients} staff
                          </div>
                        </div>
                        
                        {notice.attachments && notice.attachments.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Attachments:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {notice.attachments.map((attachment, index) => (
                                <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                  <FileText className="w-3 h-3" />
                                  <span>{attachment}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {notice.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowNoticeModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {notice.acknowledgmentRequired && !notice.acknowledged && (
                          <button
                            onClick={() => acknowledgeNotice(notice.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        
                        {notice.acknowledged && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Acknowledged</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Completed</h3>
                      <p className="text-2xl font-bold text-green-800">
                        {availableComplianceForms.filter(form => form.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
                      <p className="text-2xl font-bold text-yellow-800">
                        {availableComplianceForms.filter(form => form.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Total Forms</h3>
                      <p className="text-2xl font-bold text-blue-800">{availableComplianceForms.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {availableComplianceForms.map(form => (
                  <div key={form.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{form.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                            {form.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {form.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{form.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Required by:</span> {new Date(form.requiredBy).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {form.frequency}
                          </div>
                          {form.completedAt && (
                            <div>
                              <span className="font-medium">Completed:</span> {new Date(form.completedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {form.status === 'pending' && (
                          <button
                            onClick={() => {
                              const formData = {
                                submittedAt: new Date().toISOString(),
                                submittedBy: 'Current User'
                              };
                              submitComplianceForm(form.id, formData);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Complete Form
                          </button>
                        )}
                        
                        {form.status === 'completed' && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                        
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'cme' && (
            <motion.div
              key="cme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Total Credits</h3>
                      <p className="text-2xl font-bold text-blue-800">
                        {cmeProgress.reduce((sum, module) => sum + module.earnedCredits, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Completed</h3>
                      <p className="text-2xl font-bold text-green-800">
                        {cmeModules.filter(module => module.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">In Progress</h3>
                      <p className="text-2xl font-bold text-yellow-800">
                        {cmeModules.filter(module => module.status === 'in_progress').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">Available</h3>
                      <p className="text-2xl font-bold text-purple-800">{cmeModules.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {cmeModules.map(module => (
                  <div key={module.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                            {module.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {module.credits} Credits
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Provider:</span> {module.provider}
                          </div>
                          <div>
                            <span className="font-medium">Estimated Time:</span> {module.estimatedTime}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span> {new Date(module.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {module.status === 'in_progress' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm text-gray-500">{module.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {module.modules && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Course Modules</h4>
                            <div className="space-y-2">
                              {module.modules.map(subModule => (
                                <div key={subModule.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {subModule.completed ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                    )}
                                    <span className={`text-sm ${subModule.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                                      {subModule.title}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">{subModule.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {module.status === 'not_started' && (
                          <button
                            onClick={() => startCMEModule(module.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Start Course
                          </button>
                        )}
                        
                        {module.status === 'in_progress' && (
                          <button
                            onClick={() => completeCMEModule(module.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Complete Course
                          </button>
                        )}
                        
                        {module.status === 'completed' && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                        
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ethics' && (
            <motion.div
              key="ethics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Ethics & Incident Reporting</h3>
                    <p className="text-red-700">
                      This system provides a confidential way to report unethical behavior, patient safety concerns, 
                      or professional misconduct. All reports are handled with strict confidentiality and investigated appropriately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Report New Case</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => reportEthicalCase({
                          category: 'Patient Abuse',
                          severity: 'high',
                          title: 'Suspected Patient Abuse',
                          description: '',
                          reportedBy: 'Anonymous'
                        })}
                        className="p-4 border-2 border-red-200 rounded-lg hover:border-red-400 transition-colors text-left"
                      >
                        <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Patient Abuse</h4>
                        <p className="text-sm text-gray-600">Report suspected patient abuse or neglect</p>
                      </button>
                      
                      <button
                        onClick={() => reportEthicalCase({
                          category: 'Professional Misconduct',
                          severity: 'medium',
                          title: 'Professional Misconduct',
                          description: '',
                          reportedBy: 'Anonymous'
                        })}
                        className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors text-left"
                      >
                        <Flag className="w-6 h-6 text-orange-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Professional Misconduct</h4>
                        <p className="text-sm text-gray-600">Report unprofessional behavior or ethics violations</p>
                      </button>
                      
                      <button
                        onClick={() => reportEthicalCase({
                          category: 'Safety Concern',
                          severity: 'medium',
                          title: 'Patient Safety Concern',
                          description: '',
                          reportedBy: 'Anonymous'
                        })}
                        className="p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 transition-colors text-left"
                      >
                        <Shield className="w-6 h-6 text-yellow-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Safety Concern</h4>
                        <p className="text-sm text-gray-600">Report patient safety issues or near misses</p>
                      </button>
                      
                      <button
                        onClick={() => reportEthicalCase({
                          category: 'Other',
                          severity: 'low',
                          title: 'Other Ethical Concern',
                          description: '',
                          reportedBy: 'Anonymous'
                        })}
                        className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors text-left"
                      >
                        <Info className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Other</h4>
                        <p className="text-sm text-gray-600">Report other ethical concerns or violations</p>
                      </button>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Confidentiality Guarantee</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• All reports are handled confidentially</li>
                        <li>• Anonymous reporting is available</li>
                        <li>• No retaliation policy enforced</li>
                        <li>• Professional investigation process</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Reported Cases ({ethicalCases.length})</h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {ethicalCases.map(caseItem => (
                      <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{caseItem.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(caseItem.severity)}`}>
                            {caseItem.severity}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{caseItem.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                          <span>Category: {caseItem.category}</span>
                          <span>Reported: {new Date(caseItem.reportedDate).toLocaleDateString()}</span>
                          <span>Department: {caseItem.department}</span>
                          <span>Status: {caseItem.status.replace('_', ' ')}</span>
                        </div>
                        
                        {caseItem.actionsTaken && caseItem.actionsTaken.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Actions Taken:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {caseItem.actionsTaken.map((action, index) => (
                                <li key={index}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <Lock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Confidential</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">System Training</h3>
                      <p className="text-2xl font-bold text-blue-800">{systemTrainingModules.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Completed</h3>
                      <p className="text-2xl font-bold text-green-800">
                        {systemTrainingModules.filter(module => module.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
                      <p className="text-2xl font-bold text-yellow-800">
                        {systemTrainingModules.filter(module => module.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {systemTrainingModules.map(training => (
                  <div key={training.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{training.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                            {training.status.toUpperCase()}
                          </span>
                          {training.mandatory && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{training.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Version:</span> {training.version}
                          </div>
                          <div>
                            <span className="font-medium">Estimated Time:</span> {training.estimatedTime}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span> {new Date(training.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {training.topics && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Training Topics</h4>
                            <ul className="space-y-1">
                              {training.topics.map((topic, index) => (
                                <li key={index} className="text-sm text-gray-600">• {topic}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {training.status === 'pending' && (
                          <button
                            onClick={() => markTrainingComplete(training.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Complete Training
                          </button>
                        )}
                        
                        {training.status === 'completed' && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                        
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNoticeModal && selectedNotice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowNoticeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{selectedNotice.title}</h2>
                  <button
                    onClick={() => setShowNoticeModal(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedNotice.priority)}`}>
                        {selectedNotice.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {selectedNotice.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{selectedNotice.content}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div><span className="font-medium">Department:</span> {selectedNotice.department}</div>
                        <div><span className="font-medium">Authorized by:</span> {selectedNotice.authorizedBy}</div>
                        <div><span className="font-medium">Published:</span> {new Date(selectedNotice.publishedDate).toLocaleString()}</div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="font-medium">Expires:</span> {new Date(selectedNotice.expiryDate).toLocaleString()}</div>
                        <div><span className="font-medium">Read by:</span> {selectedNotice.readBy}/{selectedNotice.totalRecipients} staff</div>
                      </div>
                    </div>
                    
                    {selectedNotice.distributionList && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Distribution List:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedNotice.distributionList.map((recipient, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
                        <div className="space-y-2">
                          {selectedNotice.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{attachment}</span>
                              <button className="ml-auto p-1 text-blue-600 hover:text-blue-800">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedNotice.acknowledgmentRequired && !selectedNotice.acknowledged && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          acknowledgeNotice(selectedNotice.id);
                          setShowNoticeModal(false);
                        }}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        Acknowledge Notice
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCompliance;
