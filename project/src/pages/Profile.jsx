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
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const Profile = () => {
  const { user, medicalHistory, prescriptions, setLanguage, language } = useUser();
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

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' }
  ];

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    toast.success('Profile updated successfully');
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

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'medical', name: 'Medical History', icon: FileText },
    { id: 'prescriptions', name: 'Prescriptions', icon: Pill },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User Profile'}</h1>
          <p className="text-gray-600">Manage your profile and medical information</p>
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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
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
                  <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadMedicalHistory}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={clearMedicalHistory}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                {medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {medicalHistory.map((record, index) => (
                      <div key={record.id || index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {record.type === 'diagnosis' ? 'AI Diagnosis' : 
                             record.type === 'report_analysis' ? 'Report Analysis' : 
                             'Medical Record'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {record.diagnosis && (
                          <p className="text-gray-700 mb-2">
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
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical History</h3>
                    <p className="text-gray-500">Your medical consultations and reports will appear here</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Prescription History</h2>
                </div>

                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                      <div key={prescription.id || index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Prescription #{prescription.prescriptionNumber || index + 1}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(prescription.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          <strong>Diagnosis:</strong> {prescription.diagnosis}
                        </p>
                        {prescription.medications && (
                          <div>
                            <strong>Medications:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1">
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
                  <div className="text-center py-8">
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">App Settings</h2>

                {/* Language Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-medium text-gray-900">Language Preferences</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          language === lang.code
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
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
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-medium text-gray-900">Privacy & Security</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Data Encryption</span>
                      <span className="text-green-600 text-sm">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Anonymous Analytics</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
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