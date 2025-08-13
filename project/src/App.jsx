import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import EnhancedSidebar from './components/EnhancedSidebar.jsx';
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
import MedicalHistory from './pages/MedicalHistory.jsx';
import LabReportsAnalysis from './pages/LabReportsAnalysis.jsx';
import VisualInspection from './pages/VisualInspection.jsx';
import AIDiagnosis from './pages/AIDiagnosis.jsx';
import DiagnosticsTesting from './pages/DiagnosticsTesting.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import PatientManagement from './pages/PatientManagement.jsx';
import ConsultationModes from './pages/ConsultationModes.jsx';
import SchedulingManagement from './pages/SchedulingManagement.jsx';
import PatientEducation from './pages/PatientEducation.jsx';
import SecurityPrivacy from './pages/SecurityPrivacy.jsx';
import MicroFunctionalities from './pages/MicroFunctionalities.jsx';
import PatientFollowup from './pages/PatientFollowup.jsx';
import MedicalDocumentation from './pages/MedicalDocumentation.jsx';
import Collaboration from './pages/Collaboration.jsx';
import FinanceEarnings from './pages/FinanceEarnings.jsx';
import AdminCompliance from './pages/AdminCompliance.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import History from './pages/History.jsx';
import Login from './pages/Login.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ExamPortal from './pages/ExamPortal.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { LayoutProvider, useLayout } from './context/LayoutContext.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import WorkflowGuide from './components/WorkflowGuide.jsx';
import QuickAccessToolbar from './components/QuickAccessToolbar.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PWAInstaller from './components/PWAInstaller.jsx';
import { notificationService } from './utils/notifications.js';
import { offlineStorage } from './utils/offlineStorage.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize app with simplified approach
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');

        // Initialize offline storage with timeout
        const storagePromise = Promise.race([
          offlineStorage.initialize(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 3000))
        ]);

        try {
          await storagePromise;
          console.log('Offline storage initialized');
        } catch (error) {
          console.warn('Offline storage failed, continuing without it:', error);
        }

        // Initialize notification service with timeout
        const notificationPromise = Promise.race([
          notificationService.initialize(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Notification timeout')), 2000))
        ]);

        try {
          await notificationPromise;
          console.log('Notification service initialized');
        } catch (error) {
          console.warn('Notification service failed, continuing without it:', error);
        }

        // Register service worker (optional)
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registered');
          } catch (error) {
            console.warn('Service worker registration failed:', error);
          }
        }

        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        // Always set loading to false
        setIsLoading(false);
      }
    };

    // Reduce initial delay and add fallback
    const timer = setTimeout(initializeApp, 800);

    // Fallback: if initialization takes too long, just show the app
    const fallbackTimer = setTimeout(() => {
      console.warn('Initialization taking too long, showing app anyway');
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
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
    <ErrorBoundary>
      <UserProvider>
        <LayoutProvider>
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
        </LayoutProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

function AuthenticatedApp() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <EnhancedSidebar />
      <ResponsiveMainContent />
      <WorkflowGuide />
      <QuickAccessToolbar />
    </div>
  );
}

function ResponsiveMainContent() {
  const { isSidebarOpen, isMobile } = useLayout();

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex-1 pt-20 overflow-hidden transition-all duration-300 ${
        isMobile 
          ? 'pl-0' 
          : isSidebarOpen 
            ? 'pl-80' 
            : 'pl-20'
      }`}
    >
      <div className="h-full overflow-y-auto p-6">
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
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/lab-reports-analysis" element={<LabReportsAnalysis />} />
          <Route path="/visual-inspection" element={<VisualInspection />} />
          <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
          <Route path="/diagnostics-testing" element={<DiagnosticsTesting />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/patient-management" element={<PatientManagement />} />
          <Route path="/consultation-modes" element={<ConsultationModes />} />
          <Route path="/scheduling-management" element={<SchedulingManagement />} />
          <Route path="/patient-education" element={<PatientEducation />} />
          <Route path="/security-privacy" element={<SecurityPrivacy />} />
          <Route path="/micro-functionalities" element={<MicroFunctionalities />} />
          <Route path="/patient-followup" element={<PatientFollowup />} />
          <Route path="/medical-documentation" element={<MedicalDocumentation />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/finance-earnings" element={<FinanceEarnings />} />
          <Route path="/admin-compliance" element={<AdminCompliance />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </motion.main>
  );
}

export default App;
