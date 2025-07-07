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

  const value = {
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
    setIsLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};