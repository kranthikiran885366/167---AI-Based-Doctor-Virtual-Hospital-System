import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Medical Professional specific states
  const [professionalProfile, setProfessionalProfile] = useState(null);
  const [consultationFees, setConsultationFees] = useState({
    perMinute: 0,
    perSession: 0,
    emergencyRate: 0
  });
  const [availability, setAvailability] = useState({
    schedule: {},
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isOnline: false,
    autoOffline: true
  });
  const [documents, setDocuments] = useState({
    medicalLicense: null,
    degrees: [],
    certifications: [],
    specializations: []
  });

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('aiDoctorUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load medical history
    const storedHistory = localStorage.getItem('medicalHistory');
    if (storedHistory) {
      setMedicalHistory(JSON.parse(storedHistory));
    }

    // Load prescriptions
    const storedPrescriptions = localStorage.getItem('prescriptions');
    if (storedPrescriptions) {
      setPrescriptions(JSON.parse(storedPrescriptions));
    }

    // Load professional profile
    const storedProfessionalProfile = localStorage.getItem('professionalProfile');
    if (storedProfessionalProfile) {
      setProfessionalProfile(JSON.parse(storedProfessionalProfile));
    }

    // Load consultation fees
    const storedFees = localStorage.getItem('consultationFees');
    if (storedFees) {
      setConsultationFees(JSON.parse(storedFees));
    }

    // Load availability
    const storedAvailability = localStorage.getItem('availability');
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    }

    // Load documents
    const storedDocuments = localStorage.getItem('professionalDocuments');
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('aiDoctorUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiDoctorUser');
  };

  const addMedicalRecord = (record) => {
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    };
    const updatedHistory = [...medicalHistory, newRecord];
    setMedicalHistory(updatedHistory);
    localStorage.setItem('medicalHistory', JSON.stringify(updatedHistory));
  };

  const addPrescription = (prescription) => {
    const newPrescription = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...prescription
    };
    const updatedPrescriptions = [...prescriptions, newPrescription];
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
  };

  // Professional Profile Management
  const updateProfessionalProfile = (profileData) => {
    const updatedProfile = {
      ...professionalProfile,
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    setProfessionalProfile(updatedProfile);
    localStorage.setItem('professionalProfile', JSON.stringify(updatedProfile));
  };

  // Document Management
  const uploadDocument = async (type, file, metadata = {}) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const document = {
          id: Date.now(),
          type,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: reader.result, // Base64 data
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
            verified: false,
            verificationStatus: 'pending'
          }
        };

        const updatedDocuments = { ...documents };
        
        if (type === 'medicalLicense') {
          updatedDocuments.medicalLicense = document;
        } else {
          updatedDocuments[type] = [...(updatedDocuments[type] || []), document];
        }

        setDocuments(updatedDocuments);
        localStorage.setItem('professionalDocuments', JSON.stringify(updatedDocuments));
        
        // Simulate verification process
        setTimeout(() => {
          verifyDocument(document.id, type);
        }, 3000);

        resolve(document);
      };
      reader.readAsDataURL(file);
    });
  };

  const verifyDocument = (documentId, type) => {
    const updatedDocuments = { ...documents };
    
    if (type === 'medicalLicense' && updatedDocuments.medicalLicense?.id === documentId) {
      updatedDocuments.medicalLicense.metadata.verified = true;
      updatedDocuments.medicalLicense.metadata.verificationStatus = 'verified';
      updatedDocuments.medicalLicense.metadata.verifiedAt = new Date().toISOString();
    } else {
      const documentArray = updatedDocuments[type];
      if (documentArray) {
        const docIndex = documentArray.findIndex(doc => doc.id === documentId);
        if (docIndex !== -1) {
          documentArray[docIndex].metadata.verified = true;
          documentArray[docIndex].metadata.verificationStatus = 'verified';
          documentArray[docIndex].metadata.verifiedAt = new Date().toISOString();
        }
      }
    }

    setDocuments(updatedDocuments);
    localStorage.setItem('professionalDocuments', JSON.stringify(updatedDocuments));
  };

  const removeDocument = (documentId, type) => {
    const updatedDocuments = { ...documents };
    
    if (type === 'medicalLicense') {
      updatedDocuments.medicalLicense = null;
    } else {
      updatedDocuments[type] = updatedDocuments[type].filter(doc => doc.id !== documentId);
    }

    setDocuments(updatedDocuments);
    localStorage.setItem('professionalDocuments', JSON.stringify(updatedDocuments));
  };

  // Consultation Fee Management
  const updateConsultationFees = (fees) => {
    const updatedFees = { ...consultationFees, ...fees };
    setConsultationFees(updatedFees);
    localStorage.setItem('consultationFees', JSON.stringify(updatedFees));
  };

  // Availability Management
  const updateAvailability = (availabilityData) => {
    const updatedAvailability = { ...availability, ...availabilityData };
    setAvailability(updatedAvailability);
    localStorage.setItem('availability', JSON.stringify(updatedAvailability));
  };

  const toggleOnlineStatus = () => {
    const newStatus = !availability.isOnline;
    const updatedAvailability = {
      ...availability,
      isOnline: newStatus,
      lastStatusChange: new Date().toISOString()
    };
    setAvailability(updatedAvailability);
    localStorage.setItem('availability', JSON.stringify(updatedAvailability));
    return newStatus;
  };

  const setWorkingHours = (dayOfWeek, hours) => {
    const updatedSchedule = {
      ...availability.schedule,
      [dayOfWeek]: hours
    };
    const updatedAvailability = {
      ...availability,
      schedule: updatedSchedule
    };
    setAvailability(updatedAvailability);
    localStorage.setItem('availability', JSON.stringify(updatedAvailability));
  };

  // License Verification Logic
  const verifyLicense = async (licenseNumber, state, country = 'US') => {
    return new Promise((resolve) => {
      setIsLoading(true);
      
      // Simulate API call to medical board verification
      setTimeout(() => {
        const isValid = licenseNumber.length >= 6 && /^[A-Z0-9]+$/.test(licenseNumber);
        const verificationResult = {
          valid: isValid,
          licenseNumber,
          state,
          country,
          status: isValid ? 'active' : 'invalid',
          issueDate: isValid ? '2020-01-15' : null,
          expiryDate: isValid ? '2025-01-15' : null,
          specialties: isValid ? ['Internal Medicine', 'General Practice'] : [],
          verifiedAt: new Date().toISOString()
        };
        
        if (isValid) {
          updateProfessionalProfile({
            licenseVerification: verificationResult,
            verified: true
          });
        }
        
        setIsLoading(false);
        resolve(verificationResult);
      }, 2000);
    });
  };

  const value = {
    // Original context values
    user,
    language,
    medicalHistory,
    prescriptions,
    isLoading,
    login,
    logout,
    setLanguage,
    addMedicalRecord,
    addPrescription,
    setIsLoading,
    
    // Medical Professional features
    professionalProfile,
    consultationFees,
    availability,
    documents,
    updateProfessionalProfile,
    uploadDocument,
    verifyDocument,
    removeDocument,
    updateConsultationFees,
    updateAvailability,
    toggleOnlineStatus,
    setWorkingHours,
    verifyLicense
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
