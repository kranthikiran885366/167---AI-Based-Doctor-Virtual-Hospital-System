import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Camera, 
  Upload, 
  FileText, 
  Award, 
  Clock, 
  DollarSign, 
  Globe, 
  Shield, 
  Check, 
  X, 
  Edit, 
  Save, 
  AlertCircle, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Users, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Zap, 
  Heart, 
  Brain,
  Activity,
  Stethoscope,
  Target,
  Languages,
  CreditCard,
  Settings,
  Verified
} from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isOnline, setIsOnline] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Doctor Profile State
  const [doctorProfile, setDoctorProfile] = useState({
    personalInfo: {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      nationality: 'American',
      address: '123 Medical Center Dr, New York, NY 10001',
      bio: 'Experienced cardiologist with 15+ years in interventional cardiology. Specialized in complex cardiac procedures and preventive medicine.',
      languages: ['English', 'Spanish', 'French']
    },
    medicalInfo: {
      licenseNumber: 'MD-NY-123456',
      medicalBoard: 'New York State Medical Board',
      licenseExpiry: '2025-12-31',
      licenseStatus: 'verified',
      primarySpecialization: 'Cardiology',
      secondarySpecializations: ['Interventional Cardiology', 'Preventive Medicine'],
      yearsOfExperience: 15,
      currentHospital: 'Mount Sinai Hospital',
      previousExperience: [
        { hospital: 'Johns Hopkins Hospital', duration: '2015-2020', position: 'Senior Cardiologist' },
        { hospital: 'Mayo Clinic', duration: '2010-2015', position: 'Cardiologist' },
        { hospital: 'Cleveland Clinic', duration: '2008-2010', position: 'Cardiology Fellow' }
      ]
    },
    education: [
      {
        degree: 'Doctor of Medicine (MD)',
        institution: 'Harvard Medical School',
        year: '2008',
        grade: 'Magna Cum Laude',
        verified: true
      },
      {
        degree: 'Bachelor of Science in Biology',
        institution: 'Stanford University',
        year: '2004',
        grade: 'Summa Cum Laude',
        verified: true
      }
    ],
    certifications: [
      {
        name: 'Board Certification in Cardiology',
        issuingBody: 'American Board of Internal Medicine',
        issueDate: '2010-06-15',
        expiryDate: '2025-06-15',
        certificateId: 'ABIM-CARD-12345',
        verified: true
      },
      {
        name: 'Board Certification in Interventional Cardiology',
        issuingBody: 'American Board of Internal Medicine',
        issueDate: '2012-08-20',
        expiryDate: '2027-08-20',
        certificateId: 'ABIM-INTCARD-67890',
        verified: true
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        issuingBody: 'American Heart Association',
        issueDate: '2023-01-15',
        expiryDate: '2025-01-15',
        certificateId: 'AHA-ACLS-54321',
        verified: true
      }
    ],
    availability: {
      workingHours: {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '16:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      timeZone: 'America/New_York',
      maxConsultationsPerDay: 20,
      consultationDuration: 30,
      breakTime: 15,
      emergencyAvailable: true
    },
    pricing: {
      firstConsultation: 200,
      followUpConsultation: 150,
      emergencyConsultation: 300,
      pricingModel: 'per-session', // per-session, per-minute
      currency: 'USD',
      paymentMethods: ['Credit Card', 'Insurance', 'PayPal', 'Bank Transfer'],
      cancellationPolicy: 'Free cancellation up to 24 hours before appointment'
    }
  });

  // File upload state
  const [uploadedDocuments, setUploadedDocuments] = useState([
    {
      id: 1,
      name: 'Medical License - NY State',
      type: 'license',
      uploadDate: '2024-01-15',
      status: 'verified',
      fileSize: '2.1 MB',
      expiryDate: '2025-12-31'
    },
    {
      id: 2,
      name: 'Board Certification - Cardiology',
      type: 'certification',
      uploadDate: '2024-01-15',
      status: 'verified',
      fileSize: '1.8 MB',
      expiryDate: '2025-06-15'
    },
    {
      id: 3,
      name: 'Harvard Medical School Diploma',
      type: 'degree',
      uploadDate: '2024-01-15',
      status: 'verified',
      fileSize: '3.2 MB',
      expiryDate: null
    }
  ]);

  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Psychiatry', 'Oncology', 'Gastroenterology', 'Endocrinology', 'Pulmonology',
    'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine',
    'Internal Medicine', 'Infectious Disease', 'Rheumatology', 'Nephrology'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
  ];

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Profile photo uploaded successfully');
    }
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const newDoc = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: 'document',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        expiryDate: null
      };
      setUploadedDocuments(prev => [...prev, newDoc]);
    });
    toast.success(`${files.length} document(s) uploaded successfully`);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast.success(`Status changed to ${!isOnline ? 'Online' : 'Offline'}`);
  };

  const saveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const addLanguage = (language) => {
    if (!doctorProfile.personalInfo.languages.includes(language)) {
      setDoctorProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          languages: [...prev.personalInfo.languages, language]
        }
      }));
    }
  };

  const removeLanguage = (language) => {
    setDoctorProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.filter(lang => lang !== language)
      }
    }));
  };

  const addSpecialization = (specialization) => {
    if (!doctorProfile.medicalInfo.secondarySpecializations.includes(specialization)) {
      setDoctorProfile(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          secondarySpecializations: [...prev.medicalInfo.secondarySpecializations, specialization]
        }
      }));
    }
  };

  const removeSpecialization = (specialization) => {
    setDoctorProfile(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        secondarySpecializations: prev.medicalInfo.secondarySpecializations.filter(spec => spec !== specialization)
      }
    }));
  };

  const deleteDocument = (docId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document deleted successfully');
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Profile</h1>
              <p className="text-gray-600">Manage your professional profile, credentials, and availability</p>
            </div>
            
            {/* Online Status Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <button
                  onClick={toggleOnlineStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    isOnline 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {isOnline ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </button>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isEditing 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap space-x-2">
            {[
              { id: 'profile', label: 'Personal Info', icon: User },
              { id: 'medical', label: 'Medical Info', icon: Stethoscope },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'availability', label: 'Availability', icon: Clock },
              { id: 'pricing', label: 'Pricing', icon: DollarSign }
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
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Photo Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Photo</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {doctorProfile.personalInfo.firstName} {doctorProfile.personalInfo.lastName}
                    </h4>
                    <p className="text-gray-600">{doctorProfile.medicalInfo.primarySpecialization}</p>
                    <p className="text-sm text-gray-500">{doctorProfile.medicalInfo.currentHospital}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Verified className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Verified Professional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={doctorProfile.personalInfo.firstName}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={doctorProfile.personalInfo.lastName}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={doctorProfile.personalInfo.email}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={doctorProfile.personalInfo.phone}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={doctorProfile.personalInfo.dateOfBirth}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={doctorProfile.personalInfo.gender}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, gender: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={doctorProfile.personalInfo.address}
                    onChange={(e) => setDoctorProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                  <textarea
                    value={doctorProfile.personalInfo.bio}
                    onChange={(e) => setDoctorProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, bio: e.target.value }
                    }))}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="Tell patients about your experience, specializations, and approach to healthcare..."
                  />
                </div>

                {/* Languages */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {doctorProfile.personalInfo.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {language}
                        {isEditing && (
                          <button
                            onClick={() => removeLanguage(language)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addLanguage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Add Language</option>
                      {languages.filter(lang => !doctorProfile.personalInfo.languages.includes(lang)).map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'medical' && (
            <motion.div
              key="medical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Medical License Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Medical License Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={doctorProfile.medicalInfo.licenseNumber}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 pr-12"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {doctorProfile.medicalInfo.licenseStatus === 'verified' ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Board</label>
                    <input
                      type="text"
                      value={doctorProfile.medicalInfo.medicalBoard}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date</label>
                    <input
                      type="date"
                      value={doctorProfile.medicalInfo.licenseExpiry}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={doctorProfile.medicalInfo.yearsOfExperience}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Specializations</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Specialization</label>
                    <select
                      value={doctorProfile.medicalInfo.primarySpecialization}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        medicalInfo: { ...prev.medicalInfo, primarySpecialization: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Specializations</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doctorProfile.medicalInfo.secondarySpecializations.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {spec}
                          {isEditing && (
                            <button
                              onClick={() => removeSpecialization(spec)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addSpecialization(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Add Specialization</option>
                        {specializations.filter(spec => 
                          spec !== doctorProfile.medicalInfo.primarySpecialization &&
                          !doctorProfile.medicalInfo.secondarySpecializations.includes(spec)
                        ).map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Hospital */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Affiliation</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic</label>
                  <input
                    type="text"
                    value={doctorProfile.medicalInfo.currentHospital}
                    onChange={(e) => setDoctorProfile(prev => ({
                      ...prev,
                      medicalInfo: { ...prev.medicalInfo, currentHospital: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Previous Experience */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Previous Experience</h3>
                <div className="space-y-4">
                  {doctorProfile.medicalInfo.previousExperience.map((exp, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.hospital}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                        </div>
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Education */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Education</h3>
                <div className="space-y-6">
                  {doctorProfile.education.map((edu, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                          <p className="text-gray-600">Graduated: {edu.year}</p>
                          <p className="text-sm text-gray-500">Grade: {edu.grade}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {edu.verified && (
                            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Verified</span>
                            </div>
                          )}
                          <GraduationCap className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Certifications</h3>
                <div className="space-y-6">
                  {doctorProfile.certifications.map((cert, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-green-600 font-medium">{cert.issuingBody}</p>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Issue Date: {new Date(cert.issueDate).toLocaleDateString()}</p>
                            <p>Expiry Date: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                            <p>Certificate ID: {cert.certificateId}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {cert.verified && (
                            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Verified</span>
                            </div>
                          )}
                          <Award className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Document Upload */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Medical Documents</h4>
                  <p className="text-gray-600 mb-4">Drag and drop files or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Select Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                  </p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Documents</h3>
                <div className="space-y-4">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          doc.status === 'verified' ? 'bg-green-100' :
                          doc.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <FileText className={`w-6 h-6 ${
                            doc.status === 'verified' ? 'text-green-600' :
                            doc.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Type: {doc.type}</span>
                            <span>Size: {doc.fileSize}</span>
                            <span>Uploaded: {doc.uploadDate}</span>
                            {doc.expiryDate && <span>Expires: {doc.expiryDate}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </div>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Working Hours */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Working Hours</h3>
                <div className="space-y-4">
                  {Object.entries(doctorProfile.availability.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-24">
                          <span className="font-medium text-gray-900 capitalize">{day}</span>
                        </div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={hours.available}
                            onChange={(e) => setDoctorProfile(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                workingHours: {
                                  ...prev.availability.workingHours,
                                  [day]: { ...hours, available: e.target.checked }
                                }
                              }
                            }))}
                            disabled={!isEditing}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Available</span>
                        </label>
                      </div>
                      {hours.available && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => setDoctorProfile(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                workingHours: {
                                  ...prev.availability.workingHours,
                                  [day]: { ...hours, start: e.target.value }
                                }
                              }
                            }))}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => setDoctorProfile(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                workingHours: {
                                  ...prev.availability.workingHours,
                                  [day]: { ...hours, end: e.target.value }
                                }
                              }
                            }))}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Settings */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Consultation Settings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Consultations per Day</label>
                    <input
                      type="number"
                      value={doctorProfile.availability.maxConsultationsPerDay}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        availability: { ...prev.availability, maxConsultationsPerDay: parseInt(e.target.value) }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Duration (minutes)</label>
                    <select
                      value={doctorProfile.availability.consultationDuration}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        availability: { ...prev.availability, consultationDuration: parseInt(e.target.value) }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Break Time (minutes)</label>
                    <select
                      value={doctorProfile.availability.breakTime}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        availability: { ...prev.availability, breakTime: parseInt(e.target.value) }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value={0}>No break</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select
                      value={doctorProfile.availability.timeZone}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        availability: { ...prev.availability, timeZone: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={doctorProfile.availability.emergencyAvailable}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        availability: { ...prev.availability, emergencyAvailable: e.target.checked }
                      }))}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="font-medium text-gray-900">Available for Emergency Consultations</span>
                  </label>
                  <p className="text-sm text-gray-500 ml-6 mt-1">
                    You will receive urgent consultation requests outside of normal hours
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Consultation Fees */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Consultation Fees</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Consultation</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={doctorProfile.pricing.firstConsultation}
                        onChange={(e) => setDoctorProfile(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, firstConsultation: parseFloat(e.target.value) }
                        }))}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Consultation</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={doctorProfile.pricing.followUpConsultation}
                        onChange={(e) => setDoctorProfile(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, followUpConsultation: parseFloat(e.target.value) }
                        }))}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Consultation</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={doctorProfile.pricing.emergencyConsultation}
                        onChange={(e) => setDoctorProfile(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, emergencyConsultation: parseFloat(e.target.value) }
                        }))}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
                    <select
                      value={doctorProfile.pricing.pricingModel}
                      onChange={(e) => setDoctorProfile(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, pricingModel: e.target.value }
                      }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="per-session">Per Session</option>
                      <option value="per-minute">Per Minute</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Accepted Payment Methods</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {['Credit Card', 'Insurance', 'PayPal', 'Bank Transfer', 'Cash', 'Cryptocurrency'].map(method => (
                    <label key={method} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={doctorProfile.pricing.paymentMethods.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDoctorProfile(prev => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                paymentMethods: [...prev.pricing.paymentMethods, method]
                              }
                            }));
                          } else {
                            setDoctorProfile(prev => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                paymentMethods: prev.pricing.paymentMethods.filter(m => m !== method)
                              }
                            }));
                          }
                        }}
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-900">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Cancellation Policy</h3>
                <textarea
                  value={doctorProfile.pricing.cancellationPolicy}
                  onChange={(e) => setDoctorProfile(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, cancellationPolicy: e.target.value }
                  }))}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="Describe your cancellation and refund policy..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Changes Button */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={saveProfile}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-6 h-6" />
              <span>Save All Changes</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
