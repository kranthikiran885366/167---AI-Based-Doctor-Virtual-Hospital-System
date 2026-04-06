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
import BillingFinance from './pages/BillingFinance.jsx';
import DoctorCollaboration from './pages/DoctorCollaboration.jsx';
import VideoConsultation from './pages/VideoConsultation.jsx';
import MedicalCalculators from './pages/MedicalCalculators.jsx';
import AdvancedPrescription from './pages/AdvancedPrescription.jsx';
import ComprehensiveExamination from './pages/ComprehensiveExamination.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { LayoutProvider, useLayout } from './context/LayoutContext.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PWAInstaller from './components/PWAInstaller.jsx';
import { notificationService } from './utils/notifications.js';
import { offlineStorage } from './utils/offlineStorage.js';

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.race([
          offlineStorage.initialize(),
          new Promise((_, reject) => setTimeout(() => reject(), 3000))
        ]).catch(() => {});

        await Promise.race([
          notificationService.initialize(),
          new Promise((_, reject) => setTimeout(() => reject(), 2000))
        ]).catch(() => {});

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initializeApp, 600);
    const fallback = setTimeout(() => setIsLoading(false), 4000);
    return () => { clearTimeout(timer); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    const on = () => { setIsOnline(true); offlineStorage.syncWithServer(); };
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <UserProvider>
        <LayoutProvider>
          <div className="min-h-screen bg-[#F8FAFC]">
            {!isOnline && (
              <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-white text-center py-1.5 text-xs font-medium">
                You're offline — some features may be unavailable
              </div>
            )}
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/exam-portal" element={<ExamPortal />} />
                <Route path="/*" element={<AuthenticatedApp />} />
              </Routes>
            </AnimatePresence>
            <PWAInstaller />
          </div>
        </LayoutProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

function AuthenticatedApp() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Navbar />
      <EnhancedSidebar />
      <MainContent />
    </div>
  );
}

function MainContent() {
  const { isSidebarOpen, isMobile } = useLayout();

  const contentLeft = isMobile ? 0 : isSidebarOpen ? 260 : 64;

  return (
    <motion.main
      style={{ marginLeft: contentLeft }}
      animate={{ marginLeft: contentLeft }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex-1 pt-[60px] overflow-hidden"
    >
      <div className="h-full overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/diagnosis" element={<PageWrapper><Diagnosis /></PageWrapper>} />
            <Route path="/report-analyzer" element={<PageWrapper><ReportAnalyzer /></PageWrapper>} />
            <Route path="/prescription" element={<PageWrapper><Prescription /></PageWrapper>} />
            <Route path="/emergency" element={<PageWrapper><Emergency /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/medical-registration" element={<PageWrapper><MedicalRegistration /></PageWrapper>} />
            <Route path="/doctor-dashboard" element={<PageWrapper><DoctorDashboard /></PageWrapper>} />
            <Route path="/examination-features" element={<PageWrapper><ExaminationFeatures /></PageWrapper>} />
            <Route path="/medical-history" element={<PageWrapper><MedicalHistory /></PageWrapper>} />
            <Route path="/lab-reports-analysis" element={<PageWrapper><LabReportsAnalysis /></PageWrapper>} />
            <Route path="/visual-inspection" element={<PageWrapper><VisualInspection /></PageWrapper>} />
            <Route path="/ai-diagnosis" element={<PageWrapper><AIDiagnosis /></PageWrapper>} />
            <Route path="/diagnostics-testing" element={<PageWrapper><DiagnosticsTesting /></PageWrapper>} />
            <Route path="/doctor-profile" element={<PageWrapper><DoctorProfile /></PageWrapper>} />
            <Route path="/patient-management" element={<PageWrapper><PatientManagement /></PageWrapper>} />
            <Route path="/consultation-modes" element={<PageWrapper><ConsultationModes /></PageWrapper>} />
            <Route path="/scheduling-management" element={<PageWrapper><SchedulingManagement /></PageWrapper>} />
            <Route path="/patient-education" element={<PageWrapper><PatientEducation /></PageWrapper>} />
            <Route path="/security-privacy" element={<PageWrapper><SecurityPrivacy /></PageWrapper>} />
            <Route path="/micro-functionalities" element={<PageWrapper><MicroFunctionalities /></PageWrapper>} />
            <Route path="/patient-followup" element={<PageWrapper><PatientFollowup /></PageWrapper>} />
            <Route path="/medical-documentation" element={<PageWrapper><MedicalDocumentation /></PageWrapper>} />
            <Route path="/collaboration" element={<PageWrapper><Collaboration /></PageWrapper>} />
            <Route path="/finance-earnings" element={<PageWrapper><FinanceEarnings /></PageWrapper>} />
            <Route path="/admin-compliance" element={<PageWrapper><AdminCompliance /></PageWrapper>} />
            <Route path="/bookmarks" element={<PageWrapper><Bookmarks /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />
            <Route path="/billing-finance" element={<PageWrapper><BillingFinance /></PageWrapper>} />
            <Route path="/doctor-collaboration" element={<PageWrapper><DoctorCollaboration /></PageWrapper>} />
            <Route path="/video-consultation" element={<PageWrapper><VideoConsultation /></PageWrapper>} />
            <Route path="/medical-calculators" element={<PageWrapper><MedicalCalculators /></PageWrapper>} />
            <Route path="/advanced-prescription" element={<PageWrapper><AdvancedPrescription /></PageWrapper>} />
            <Route path="/comprehensive-examination" element={<PageWrapper><ComprehensiveExamination /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default App;
