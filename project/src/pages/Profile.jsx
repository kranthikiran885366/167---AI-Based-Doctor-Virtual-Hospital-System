import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Activity,
  FileText,
  Pill,
  Download,
  Trash2,
  Settings,
  Shield,
  Bell,
  Globe,
  DollarSign,
  Clock,
  Star,
  Award,
  Upload,
  Eye,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const Profile = () => {
  const { 
    user, 
    medicalHistory, 
    prescriptions, 
    setLanguage, 
    language,
    professionalProfile,
    updateProfessionalProfile,
    consultationFees,
    updateConsultationFees,
    availability,
    updateAvailability,
    toggleOnlineStatus,
    documents
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies || '',
    chronicConditions: user?.chronicConditions || ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [professionalData, setProfessionalData] = useState({
    bio: professionalProfile?.bio || '',
    specializations: professionalProfile?.specializations || [],
    languages: professionalProfile?.languages || ['English'],
    yearsOfExperience: professionalProfile?.yearsOfExperience || '',
    currentHospital: professionalProfile?.currentHospital || ''
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' }
  ];

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfessionalChange = (field, value) => {
    setProfessionalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const saveProfessionalProfile = () => {
    updateProfessionalProfile(professionalData);
    toast.success('Professional profile updated successfully');
  };

  const downloadMedicalHistory = () => {
    const historyText = `
Medical History Report
=====================

Patient: ${user?.name}
Generated: ${new Date().toLocaleDateString()}

MEDICAL RECORDS:
${medicalHistory.map((record, index) => `
${index + 1}. Date: ${new Date(record.timestamp).toLocaleDateString()}
   Type: ${record.type}
   ${record.diagnosis ? `Diagnosis: ${record.diagnosis.condition || record.diagnosis}` : ''}
   ${record.symptoms ? `Symptoms: ${record.symptoms}` : ''}
`).join('')}

PRESCRIPTIONS:
${prescriptions.map((prescription, index) => `
${index + 1}. Date: ${new Date(prescription.timestamp).toLocaleDateString()}
   Diagnosis: ${prescription.diagnosis}
   Medications: ${prescription.medications?.map(m => m.name).join(', ') || 'N/A'}
`).join('')}
    `;

    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_history_${user?.name}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Medical history downloaded');
  };

  const clearMedicalHistory = () => {
    if (window.confirm('Are you sure you want to clear all medical history? This action cannot be undone.')) {
      localStorage.removeItem('medicalHistory');
      localStorage.removeItem('prescriptions');
      toast.success('Medical history cleared');
      window.location.reload();
    }
  };

  const tabs = professionalProfile ? [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'profile', name: 'Personal Profile', icon: User },
    { id: 'professional', name: 'Professional Info', icon: Award },
    { id: 'fees', name: 'Consultation Fees', icon: DollarSign },
    { id: 'availability', name: 'Availability', icon: Clock },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'medical', name: 'Medical History', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings }
  ] : [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'medical', name: 'Medical History', icon: FileText },
    { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const statsData = [
    { label: 'Total Consultations', value: '127', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Patient Rating', value: '4.9', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Response Time', value: '2min', icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'This Month', value: '23', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  const recentActivity = [
    { type: 'consultation', patient: 'John D.', time: '2 hours ago', status: 'completed' },
    { type: 'document', patient: 'Sarah M.', time: '4 hours ago', status: 'uploaded' },
    { type: 'prescription', patient: 'Mike R.', time: '1 day ago', status: 'sent' },
    { type: 'consultation', patient: 'Lisa K.', time: '2 days ago', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              {professionalProfile?.profilePhoto ? (
                <img 
                  src={professionalProfile.profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              {availability?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {professionalProfile ? `Dr. ${professionalProfile.firstName} ${professionalProfile.lastName}` : user?.name || 'User Profile'}
              </h1>
              <p className="text-gray-600">
                {professionalProfile ? professionalProfile.specializations?.join(', ') : 'Manage your profile and medical information'}
              </p>
              {professionalProfile?.verified && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">Verified Medical Professional</span>
                </div>
              )}
            </div>
          </div>

          {/* Online Status Toggle for Professionals */}
          {professionalProfile && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="text-gray-700 font-medium">Status:</span>
                <button
                  onClick={toggleOnlineStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    availability?.isOnline ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      availability?.isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`font-medium ${availability?.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {availability?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

          <div className="p-8">
            {/* Dashboard Tab - Only for Medical Professionals */}
            {activeTab === 'dashboard' && professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-gray-900">Professional Dashboard</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ y: -4 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {activity.type === 'consultation' ? 'Consultation with' : 
                               activity.type === 'document' ? 'Document from' : 
                               'Prescription for'} {activity.patient}
                            </div>
                            <div className="text-sm text-gray-500">{activity.time}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
                        <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                        <div className="font-medium text-gray-900">Manage Schedule</div>
                        <div className="text-sm text-gray-500">Update availability</div>
                      </button>
                      
                      <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
                        <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                        <div className="font-medium text-gray-900">Update Fees</div>
                        <div className="text-sm text-gray-500">Consultation rates</div>
                      </button>
                      
                      <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
                        <FileText className="w-6 h-6 text-purple-600 mb-2" />
                        <div className="font-medium text-gray-900">View Reports</div>
                        <div className="text-sm text-gray-500">Analytics & insights</div>
                      </button>
                      
                      <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
                        <Settings className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="font-medium text-gray-900">Settings</div>
                        <div className="text-sm text-gray-500">Profile preferences</div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      value={profileData.allergies}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                    <textarea
                      name="chronicConditions"
                      value={profileData.chronicConditions}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Diabetes, Hypertension, Asthma"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Professional Information</h2>
                  <button
                    onClick={saveProfessionalProfile}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical License</label>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-800">{professionalProfile.licenseNumber} - Verified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={professionalData.yearsOfExperience}
                      onChange={(e) => handleProfessionalChange('yearsOfExperience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic</label>
                    <input
                      type="text"
                      value={professionalData.currentHospital}
                      onChange={(e) => handleProfessionalChange('currentHospital', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-xl">
                      {professionalData.specializations?.join(', ') || 'Not specified'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                    <textarea
                      value={professionalData.bio}
                      onChange={(e) => handleProfessionalChange('bio', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Consultation Fees Tab */}
            {activeTab === 'fees' && professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consultation Fees</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <div className="text-center mb-4">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Per Minute Rate</h3>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={consultationFees?.perMinute || 0}
                        onChange={(e) => updateConsultationFees({ perMinute: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">
                    <div className="text-center mb-4">
                      <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Per Session Rate</h3>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={consultationFees?.perSession || 0}
                        onChange={(e) => updateConsultationFees({ perSession: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-6">
                    <div className="text-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Emergency Rate</h3>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={consultationFees?.emergencyRate || 0}
                        onChange={(e) => updateConsultationFees({ emergencyRate: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Availability Settings</h2>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">Current Status</h3>
                      <p className="text-gray-600">Toggle your availability for consultations</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        availability?.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {availability?.isOnline ? 'Online' : 'Offline'}
                      </span>
                      <button
                        onClick={toggleOnlineStatus}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          availability?.isOnline ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            availability?.isOnline ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {availability?.isOnline && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-800 font-medium">You are currently available for consultations</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Working Hours</h3>
                  <p className="text-gray-600 mb-4">
                    Configure your working schedule. Patients will only be able to book consultations during these hours.
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
                    Manage Schedule
                  </button>
                </div>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documents & Credentials</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Medical License</h3>
                      {documents?.medicalLicense?.metadata?.verified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {documents?.medicalLicense ? 
                        `${documents.medicalLicense.fileName} - ${documents.medicalLicense.metadata.verified ? 'Verified' : 'Pending Verification'}` :
                        'No document uploaded'
                      }
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {documents?.medicalLicense ? 'View Document' : 'Upload Document'}
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Medical Degrees</h3>
                      {documents?.degrees?.length > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {documents?.degrees?.length > 0 ? 
                        `${documents.degrees.length} document(s) uploaded` :
                        'No documents uploaded'
                      }
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {documents?.degrees?.length > 0 ? 'Manage Documents' : 'Upload Documents'}
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Certifications</h3>
                      {documents?.certifications?.length > 0 ? (
                        <Award className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {documents?.certifications?.length > 0 ? 
                        `${documents.certifications.length} certification(s) uploaded` :
                        'No certifications uploaded'
                      }
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {documents?.certifications?.length > 0 ? 'Manage Certifications' : 'Upload Certifications'}
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Specializations</h3>
                      <Star className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {documents?.specializations?.length > 0 ? 
                        `${documents.specializations.length} document(s) uploaded` :
                        'No documents uploaded'
                      }
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {documents?.specializations?.length > 0 ? 'Manage Documents' : 'Upload Documents'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'medical' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Medical History</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={downloadMedicalHistory}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={clearMedicalHistory}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                {medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {medicalHistory.map((record, index) => (
                      <div key={record.id || index} className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-gray-900 text-lg">
                            {record.type === 'diagnosis' ? 'AI Diagnosis' : 
                             record.type === 'report_analysis' ? 'Report Analysis' : 
                             'Medical Record'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {record.diagnosis && (
                          <p className="text-gray-700 mb-3">
                            <strong>Diagnosis:</strong> {record.diagnosis.condition || record.diagnosis}
                          </p>
                        )}
                        {record.symptoms && (
                          <p className="text-gray-700">
                            <strong>Symptoms:</strong> {record.symptoms}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical History</h3>
                    <p className="text-gray-500">Your medical consultations and reports will appear here</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && !professionalProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Prescription History</h2>
                </div>

                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                      <div key={prescription.id || index} className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-gray-900 text-lg">
                            Prescription #{prescription.prescriptionNumber || index + 1}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(prescription.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Diagnosis:</strong> {prescription.diagnosis}
                        </p>
                        {prescription.medications && (
                          <div>
                            <strong>Medications:</strong>
                            <ul className="list-disc list-inside ml-4 mt-2">
                              {prescription.medications.map((med, medIndex) => (
                                <li key={medIndex} className="text-gray-700">
                                  {med.name} - {med.dosage} ({med.frequency})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                    <p className="text-gray-500">Your AI-generated prescriptions will appear here</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">App Settings</h2>

                {/* Language Settings */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-900">Language Preferences</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          language === lang.code
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <div className="font-medium">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Bell className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Medicine Reminders</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Health Tips</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Emergency Alerts</span>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    {professionalProfile && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">New Patient Requests</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Consultation Reminders</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-medium text-gray-900">Privacy & Security</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Data Encryption</span>
                      <span className="text-green-600 text-sm font-medium">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Anonymous Analytics</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Two-Factor Authentication</span>
                      <button className="text-blue-600 text-sm font-medium">Enable</button>
                    </div>
                    <button className="w-full mt-6 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      Delete All Data
                    </button>
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

export default Profile;
