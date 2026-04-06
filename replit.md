# AI Doctor Virtual Hospital

## Overview
A comprehensive AI-powered digital healthcare platform with telemedicine, AI diagnosis, emergency response, and medical records management.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Package Manager**: npm
- **Frontend Location**: `project/` directory

## Project Structure
```
project/
├── src/           # React components, pages, context, utils
├── server/        # Node.js Express backend (not currently running in Replit)
├── ai-services/   # Python FastAPI AI/ML services (not currently running)
├── vite.config.ts # Vite config (port 5000, host 0.0.0.0, allowedHosts: true)
└── package.json   # Frontend dependencies
```

## Running the App
- **Workflow**: "Start application" — runs `cd project && npm run dev`
- **Port**: 5000 (frontend)
- The frontend runs as a standalone Vite dev server

## Deployment
- **Type**: Static site
- **Build**: `cd project && npm run build`
- **Public Dir**: `project/dist`

## Pages Implemented (35+ modules)
All pages use `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.section-label` CSS classes with accent color `#1E40AF`.

### Core
- Home, Dashboard, Login, DoctorDashboard

### Clinical
- AIDiagnosis, Diagnosis, LabReportsAnalysis, VisualInspection, DiagnosticsTesting, ReportAnalyzer

### Consultation
- VideoConsultation, ConsultationModes, DoctorCollaboration, Collaboration, Emergency

### Patients
- PatientManagement, MedicalHistory, SchedulingManagement, PatientFollowup, PatientEducation, MedicalRegistration

### Treatment
- Prescription, AdvancedPrescription, ComprehensiveExamination, ExaminationFeatures, MedicalDocumentation, MedicalCalculators

### Admin & Finance
- AdminPanel, AdminCompliance, FinanceEarnings, BillingFinance, SecurityPrivacy

### Profile & Tools
- Profile, DoctorProfile, Bookmarks, History, MicroFunctionalities

## Design System
- Accent: `#1E40AF` (single blue), no gradients, no shadow-lg
- Fonts: Plus Jakarta Sans (display) + Inter (body)
- Animations: Framer Motion with `AnimatePresence mode="wait"`, `motion.div initial={{ opacity: 0, y: 8 }}`
- Charts: Chart.js with Filler plugin registered for fill:true charts
