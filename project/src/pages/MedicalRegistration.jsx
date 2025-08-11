import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Upload, 
  Camera, 
  FileText, 
  Award, 
  DollarSign,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Minus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Zap,
  AlertTriangle,
  Info,
  X,
  Save,
  Send,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const MedicalRegistration = () => {
  const { 
    professionalProfile, 
    updateProfessionalProfile, 
    uploadDocument, 
    removeDocument,
    documents,
    consultationFees,
    updateConsultationFees,
    availability,
    updateAvailability,
    toggleOnlineStatus,
    setWorkingHours,
    verifyLicense,
    isLoading
  } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: professionalProfile?.firstName || '',
    lastName: professionalProfile?.lastName || '',
    email: professionalProfile?.email || '',
    phone: professionalProfile?.phone || '',
    dateOfBirth: professionalProfile?.dateOfBirth || '',
    gender: professionalProfile?.gender || '',
    address: professionalProfile?.address || '',
    city: professionalProfile?.city || '',
    state: professionalProfile?.state || '',
    zipCode: professionalProfile?.zipCode || '',
    country: professionalProfile?.country || 'US',
    
    // Professional Information
    licenseNumber: professionalProfile?.licenseNumber || '',
    licenseState: professionalProfile?.licenseState || '',
    npiNumber: professionalProfile?.npiNumber || '',
    medicalSchool: professionalProfile?.medicalSchool || '',
    graduationYear: professionalProfile?.graduationYear || '',
    residency: professionalProfile?.residency || '',
    fellowship: professionalProfile?.fellowship || '',
    boardCertifications: professionalProfile?.boardCertifications || [],
    specializations: professionalProfile?.specializations || [],
    yearsOfExperience: professionalProfile?.yearsOfExperience || '',
    currentHospital: professionalProfile?.currentHospital || '',
    
    // Profile Details
    bio: professionalProfile?.bio || '',
    languages: professionalProfile?.languages || ['English'],
    consultationTypes: professionalProfile?.consultationTypes || [],
    emergencyAvailable: professionalProfile?.emergencyAvailable || false,
    
    // Verification Status
    verified: professionalProfile?.verified || false,
    verificationStatus: professionalProfile?.verificationStatus || 'pending'
  });

  const [profilePhoto, setProfilePhoto] = useState(professionalProfile?.profilePhoto || null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Medical License', icon: Shield },
    { id: 3, title: 'Documents & Credentials', icon: FileText },
    { id: 4, title: 'Profile & Bio', icon: Star },
    { id: 5, title: 'Consultation Fees', icon: DollarSign },
    { id: 6, title: 'Availability & Hours', icon: Clock },
    { id: 7, title: 'Review & Submit', icon: CheckCircle }
  ];

  const specializations = [
    'Internal Medicine', 'Cardiology', 'Dermatology', 'Emergency Medicine',
    'Family Medicine', 'Gastroenterology', 'Neurology', 'Oncology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology',
    'Surgery', 'Urology', 'Gynecology', 'Anesthesiology'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Hindi', 'Telugu', 'Tamil', 'Bengali', 'Marathi', 'Gujarati',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  const consultationTypes = [
    'General Consultation', 'Follow-up Visit', 'Emergency Consultation',
    'Second Opinion', 'Prescription Review', 'Preventive Care',
    'Mental Health', 'Chronic Disease Management'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayField = (field, value, action = 'toggle') => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      let newArray;
      
      if (action === 'add' && !currentArray.includes(value)) {
        newArray = [...currentArray, value];
      } else if (action === 'remove') {
        newArray = currentArray.filter(item => item !== value);
      } else if (action === 'toggle') {
        newArray = currentArray.includes(value) 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
      } else {
        newArray = currentArray;
      }
      
      return { ...prev, [field]: newArray };
    });
  };

  const handleFileUpload = async (type, file, metadata = {}) => {
    if (!file) return;
    
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[type] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [type]: currentProgress + 10 };
        });
      }, 200);

      const uploadedDoc = await uploadDocument(type, file, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
      
      toast.success(`${type} uploaded successfully`);
      
      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[type];
          return newProgress;
        });
      }, 2000);
      
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[type];
        return newProgress;
      });
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
        toast.success('Profile photo uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyMedicalLicense = async () => {
    if (!formData.licenseNumber || !formData.licenseState) {
      toast.error('Please enter license number and state');
      return;
    }

    setVerificationStatus(prev => ({ ...prev, license: 'verifying' }));
    
    try {
      const result = await verifyLicense(formData.licenseNumber, formData.licenseState);
      
      if (result.valid) {
        setVerificationStatus(prev => ({ ...prev, license: 'verified' }));
        setFormData(prev => ({ ...prev, verified: true }));
        toast.success('Medical license verified successfully!');
      } else {
        setVerificationStatus(prev => ({ ...prev, license: 'failed' }));
        toast.error('License verification failed. Please check your details.');
      }
    } catch (error) {
      setVerificationStatus(prev => ({ ...prev, license: 'error' }));
      toast.error('Verification service temporarily unavailable');
    }
  };

  const saveProgress = () => {
    const profileData = {
      ...formData,
      profilePhoto,
      currentStep,
      lastUpdated: new Date().toISOString()
    };
    
    updateProfessionalProfile(profileData);
    toast.success('Progress saved');
  };

  const submitRegistration = async () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'licenseNumber', 'licenseState'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please complete required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!formData.verified) {
      toast.error('Medical license must be verified before submission');
      return;
    }

    const submissionData = {
      ...formData,
      profilePhoto,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    updateProfessionalProfile(submissionData);
    toast.success('Registration submitted for review!');
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step, isActive, isCompleted) => {
    const Icon = step.icon;
    if (isCompleted) return <CheckCircle className="w-5 h-5" />;
    return <Icon className="w-5 h-5" />;
  };

  const DocumentUploadCard = ({ type, title, description, accept, required = false }) => {
    const existingDoc = type === 'medicalLicense' ? documents.medicalLicense : documents[type]?.[0];
    const isUploading = uploadProgress[type] !== undefined;
    const progress = uploadProgress[type] || 0;

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {title} {required && <span className="text-red-500">*</span>}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          {existingDoc ? (
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">{existingDoc.fileName}</p>
                    <p className="text-xs text-green-600">
                      {existingDoc.metadata.verified ? 'Verified' : 'Pending Verification'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(existingDoc.id, type)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileUpload(type, e.target.files[0])}
                className="hidden"
                id={`upload-${type}`}
              />
              <label
                htmlFor={`upload-${type}`}
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </label>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TimeSlotPicker = ({ day, slots, onChange }) => {
    const timeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => {
                const newSlots = slots.includes(time) 
                  ? slots.filter(t => t !== time)
                  : [...slots, time];
                onChange(day.toLowerCase(), newSlots);
              }}
              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                slots.includes(time)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Medical Professional Registration</h1>
              <p className="text-gray-600">Complete your professional profile verification</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-blue-600 bg-blue-50' :
                      isCompleted ? 'border-green-600 bg-green-50' :
                      'border-gray-300 bg-gray-50'
                    }`}>
                      {getStepIcon(step, isActive, isCompleted)}
                    </div>
                    <div className="hidden md:block">
                      <p className="font-medium">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full address including street, city, state, ZIP"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Medical License */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical License Verification</h2>
                  
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900">License Verification Required</h3>
                        <p className="text-blue-700 text-sm">
                          We verify all medical licenses through official state medical boards to ensure patient safety and regulatory compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your license number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.licenseState}
                        onChange={(e) => handleInputChange('licenseState', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        <option value="AL">Alabama</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        {/* Add all states */}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NPI Number</label>
                      <input
                        type="text"
                        value={formData.npiNumber}
                        onChange={(e) => handleInputChange('npiNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit NPI number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Number of years"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>

                  {/* License Verification */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">License Verification Status</h3>
                      <button
                        onClick={verifyMedicalLicense}
                        disabled={!formData.licenseNumber || !formData.licenseState || isLoading}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{isLoading ? 'Verifying...' : 'Verify License'}</span>
                      </button>
                    </div>

                    {verificationStatus.license && (
                      <div className={`p-4 rounded-lg ${
                        verificationStatus.license === 'verified' ? 'bg-green-50 border border-green-200' :
                        verificationStatus.license === 'failed' ? 'bg-red-50 border border-red-200' :
                        verificationStatus.license === 'verifying' ? 'bg-blue-50 border border-blue-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {verificationStatus.license === 'verified' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {verificationStatus.license === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                          {verificationStatus.license === 'verifying' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                          
                          <div>
                            <p className={`font-medium ${
                              verificationStatus.license === 'verified' ? 'text-green-800' :
                              verificationStatus.license === 'failed' ? 'text-red-800' :
                              verificationStatus.license === 'verifying' ? 'text-blue-800' :
                              'text-gray-800'
                            }`}>
                              {verificationStatus.license === 'verified' && 'License Verified Successfully'}
                              {verificationStatus.license === 'failed' && 'License Verification Failed'}
                              {verificationStatus.license === 'verifying' && 'Verifying License...'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {verificationStatus.license === 'verified' && 'Your medical license has been validated with the state medical board.'}
                              {verificationStatus.license === 'failed' && 'Please check your license number and state, then try again.'}
                              {verificationStatus.license === 'verifying' && 'Please wait while we verify your credentials...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Credentials */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents & Credentials</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <DocumentUploadCard
                      type="medicalLicense"
                      title="Medical License Certificate"
                      description="Upload your official medical license document"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />

                    <DocumentUploadCard
                      type="degrees"
                      title="Medical Degree"
                      description="Upload your medical school diploma/degree"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />

                    <DocumentUploadCard
                      type="certifications"
                      title="Board Certifications"
                      description="Upload board certification documents"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    <DocumentUploadCard
                      type="specializations"
                      title="Specialty Certifications"
                      description="Upload specialty training certificates"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  {/* Educational Background */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Educational Background</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical School</label>
                        <input
                          type="text"
                          value={formData.medicalSchool}
                          onChange={(e) => handleInputChange('medicalSchool', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Name of medical school"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                        <input
                          type="number"
                          value={formData.graduationYear}
                          onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="YYYY"
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Residency Program</label>
                        <input
                          type="text"
                          value={formData.residency}
                          onChange={(e) => handleInputChange('residency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Residency program and hospital"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fellowship (if any)</label>
                        <input
                          type="text"
                          value={formData.fellowship}
                          onChange={(e) => handleInputChange('fellowship', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Fellowship program and hospital"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic</label>
                        <input
                          type="text"
                          value={formData.currentHospital}
                          onChange={(e) => handleInputChange('currentHospital', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Current workplace"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Medical Specializations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {specializations.map(specialty => (
                        <button
                          key={specialty}
                          onClick={() => handleArrayField('specializations', specialty)}
                          className={`p-3 text-sm rounded-xl border-2 transition-all ${
                            formData.specializations.includes(specialty)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Profile & Bio */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile & Bio</h2>
                  
                  {/* Profile Photo */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-300">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-600">Upload a professional headshot</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write a compelling bio that highlights your expertise, experience, and approach to patient care. This will be visible to patients."
                    />
                    <p className="text-sm text-gray-500 mt-2">{formData.bio.length}/1000 characters</p>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Languages Spoken</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {languages.map(language => (
                        <button
                          key={language}
                          onClick={() => handleArrayField('languages', language)}
                          className={`p-3 text-sm rounded-xl border-2 transition-all ${
                            formData.languages.includes(language)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Types Offered</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {consultationTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => handleArrayField('consultationTypes', type)}
                          className={`p-3 text-sm rounded-xl border-2 transition-all ${
                            formData.consultationTypes.includes(type)
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Availability */}
                  <div className="bg-red-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-900">Emergency Consultations</h3>
                        <p className="text-sm text-red-700">Are you available for emergency consultations?</p>
                      </div>
                      <button
                        onClick={() => handleInputChange('emergencyAvailable', !formData.emergencyAvailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.emergencyAvailable ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.emergencyAvailable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Consultation Fees */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Fees</h2>
                  
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Set Your Consultation Rates</h3>
                        <p className="text-blue-700 text-sm">
                          Set competitive rates for your consultations. You can change these anytime from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Per Minute Rate</h3>
                        <p className="text-sm text-gray-600">For time-based consultations</p>
                      </div>
                      
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={consultationFees.perMinute}
                          onChange={(e) => updateConsultationFees({ perMinute: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/min</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Typical range: $1-10/min
                      </p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Per Session Rate</h3>
                        <p className="text-sm text-gray-600">For fixed-duration consultations</p>
                      </div>
                      
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={consultationFees.perSession}
                          onChange={(e) => updateConsultationFees({ perSession: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/session</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Typical range: $50-300/session
                      </p>
                    </div>

                    <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Emergency Rate</h3>
                        <p className="text-sm text-gray-600">For urgent/after-hours consultations</p>
                      </div>
                      
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={consultationFees.emergencyRate}
                          onChange={(e) => updateConsultationFees({ emergencyRate: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/session</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Usually 1.5-2x regular rate
                      </p>
                    </div>
                  </div>

                  {/* Fee Summary */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Fee Summary</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">${consultationFees.perMinute}</p>
                        <p className="text-sm text-gray-600">Per Minute</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${consultationFees.perSession}</p>
                        <p className="text-sm text-gray-600">Per Session</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">${consultationFees.emergencyRate}</p>
                        <p className="text-sm text-gray-600">Emergency Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Availability & Hours */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability & Working Hours</h2>
                  
                  {/* Online Status */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Current Status</h3>
                        <p className="text-sm text-gray-600">Toggle your availability for consultations</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          availability.isOnline 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {availability.isOnline ? 'Online' : 'Offline'}
                        </span>
                        <button
                          onClick={toggleOnlineStatus}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            availability.isOnline ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              availability.isOnline ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {availability.isOnline && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-green-800 font-medium">You are currently available for consultations</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Working Hours */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
                    <div className="space-y-4">
                      {daysOfWeek.map(day => (
                        <TimeSlotPicker
                          key={day}
                          day={day}
                          slots={availability.schedule[day.toLowerCase()] || []}
                          onChange={setWorkingHours}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Timezone Settings</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Timezone</label>
                        <select
                          value={availability.timezone}
                          onChange={(e) => updateAvailability({ timezone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                          <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Offline</label>
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-300">
                          <span className="text-sm text-gray-700">Auto-offline after working hours</span>
                          <button
                            onClick={() => updateAvailability({ autoOffline: !availability.autoOffline })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              availability.autoOffline ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                availability.autoOffline ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Review & Submit */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
                  
                  {/* Profile Summary */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Profile Summary</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="font-medium text-gray-900">{formData.email}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">License Number</label>
                          <p className="font-medium text-gray-900">{formData.licenseNumber}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Specializations</label>
                          <p className="font-medium text-gray-900">
                            {formData.specializations.length > 0 ? formData.specializations.join(', ') : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                          <p className="font-medium text-gray-900">{formData.yearsOfExperience || 'Not specified'} years</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Consultation Fees</label>
                          <p className="font-medium text-gray-900">
                            ${consultationFees.perMinute}/min | ${consultationFees.perSession}/session
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Emergency Available</label>
                          <p className="font-medium text-gray-900">{formData.emergencyAvailable ? 'Yes' : 'No'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Verification Status</label>
                          <div className="flex items-center space-x-2">
                            {formData.verified ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-medium">Verified</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-red-600 font-medium">Pending Verification</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Document Status</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Medical License</span>
                        <div className="flex items-center space-x-2">
                          {documents.medicalLicense ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">Uploaded</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 text-sm">Missing</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Medical Degree</span>
                        <div className="flex items-center space-x-2">
                          {documents.degrees?.length > 0 ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">Uploaded</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 text-sm">Missing</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Certifications</span>
                        <div className="flex items-center space-x-2">
                          {documents.certifications?.length > 0 ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">{documents.certifications.length} uploaded</span>
                            </>
                          ) : (
                            <>
                              <Info className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 text-sm">Optional</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Profile Photo</span>
                        <div className="flex items-center space-x-2">
                          {profilePhoto ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">Uploaded</span>
                            </>
                          ) : (
                            <>
                              <Info className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 text-sm">Optional</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Terms & Conditions</h3>
                        <p className="text-blue-700 text-sm">
                          By submitting this registration, I agree to the platform's terms of service, 
                          privacy policy, and professional conduct guidelines. I certify that all 
                          information provided is accurate and up-to-date.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      onClick={submitRegistration}
                      className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Send className="w-6 h-6" />
                      <span>Submit Registration</span>
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      Your registration will be reviewed within 24-48 hours
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={saveProgress}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Progress</span>
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submitRegistration}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRegistration;
