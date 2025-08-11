import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Diagnosis from './pages/Diagnosis.jsx';
import ReportAnalyzer from './pages/ReportAnalyzer.jsx';
import Prescription from './pages/Prescription.jsx';
import Emergency from './pages/Emergency.jsx';
import Profile from './pages/Profile.jsx';
import MedicalRegistration from './pages/MedicalRegistration.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import ExaminationFeatures from './pages/ExaminationFeatures.jsx';
import Login from './pages/Login.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ExamPortal from './pages/ExamPortal.jsx';
import { UserProvider } from './context/UserContext.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import PWAInstaller from './components/PWAInstaller.jsx';
import { notificationService } from './utils/notifications.js';
import { offlineStorage } from './utils/offlineStorage.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Initialize offline storage
        await offlineStorage.initialize();
        
        // Initialize notification service
        await notificationService.initialize();
        
        // Register service worker
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/sw.js');
        }
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initializeApp, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      // Sync data when coming back online
      offlineStorage.syncWithServer();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-50">
            You're offline. Some features may be limited.
          </div>
        )}

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/exam-portal" element={<ExamPortal />} />
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </AnimatePresence>

        {/* PWA Installer */}
        <PWAInstaller />
      </div>
    </UserProvider>
  );
}

function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/report-analyzer" element={<ReportAnalyzer />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/medical-registration" element={<MedicalRegistration />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/examination-features" element={<ExaminationFeatures />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </>
  );
}

export default App;
