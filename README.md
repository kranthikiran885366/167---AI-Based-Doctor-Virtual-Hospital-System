# 🏥 AI-Based Doctor Virtual Hospital System

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-green.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive, AI-powered virtual hospital platform that enables seamless digital healthcare delivery with advanced telemedicine capabilities, real-time patient monitoring, and intelligent medical assistance.

## 🚀 Features

### 🩺 Core Medical Functionalities

#### **Doctor Identity & Profile Management**
- ✅ Medical license verification with official medical boards
- ✅ Multiple specialization profiles
- ✅ Education & certification upload
- ✅ Dynamic consultation fee management
- ✅ Real-time availability & working hours
- ✅ Online/Offline status toggle

#### **Patient Management System**
- ✅ Real-time patient queue management
- ✅ Accept/reject consultation requests
- ✅ Comprehensive patient profiles (demographics, allergies, medical history)
- ✅ AI-powered pre-diagnosis summaries
- ✅ Priority tagging system (critical/normal)
- ✅ Family history tracking

#### **Multi-Modal Consultation Platform**
- ✅ **HD Video Consultations** with low bandwidth fallback
- ✅ **Voice Calls** for audio-only consultations
- ✅ **Real-time Text Chat** with file sharing
- ✅ **Hybrid Mode** combining video, chat, and file sharing
- ✅ **Screen Sharing** for medical images and PDFs
- ✅ **Digital Whiteboard** with annotation tools
- ✅ **Multi-doctor Group Consultations**
- ✅ **Call Recording** with patient consent
- ✅ **AI Transcription** of consultation notes
- ✅ **Real-time Language Translation**

#### **Advanced Diagnostics & Testing**
- ✅ Lab test ordering with direct integration
- ✅ Medical image annotation and highlighting
- ✅ AI-suggested diagnoses with verification
- ✅ Visual inspections via camera integration
- ✅ Wearable device vitals integration
- ✅ Investigation ordering (MRI, blood tests, ECG)
- ✅ ICD-10 and SNOMED coding
- ✅ Patient video upload capabilities

#### **Digital Prescription Management**
- ✅ Digital prescription generation
- ✅ Verified drug database integration
- ✅ Dosage, frequency, and instruction management
- ✅ Drug interaction warnings
- ✅ Side effects notifications
- ✅ Non-medication treatments
- ✅ Lifestyle change recommendations
- ✅ Follow-up scheduling
- ✅ EMR integration
- ✅ Multi-format prescription delivery (email/WhatsApp/PDF)

#### **Patient Follow-up & Monitoring**
- ✅ Patient progress timeline tracking
- ✅ Automated medication reminders
- ✅ Lab test and check-up reminders
- ✅ Chronic condition trend monitoring
- ✅ AI-generated health reports
- ✅ Urgent attention flagging
- ✅ Wearable device data integration

#### **Emergency Healthcare System**
- ✅ Real-time SOS alert system
- ✅ Urgent video call initiation
- ✅ GPS-based ambulance dispatch
- ✅ Step-by-step emergency guidance (CPR, choking, seizures)
- ✅ Hospital coordination for immediate admission
- ✅ 24/7 emergency response

#### **Doctor Collaboration Network**
- ✅ Specialist referral system
- ✅ Second opinion consultations
- ✅ Case discussion forums
- ✅ Multi-doctor approval workflows
- ✅ Live medical conferences
- ✅ Secure patient data sharing

#### **Comprehensive Medical Documentation**
- ✅ SOAP notes (Subjective, Objective, Assessment, Plan)
- ✅ Photo/video documentation during consultations
- ✅ Digital signature integration
- ✅ Lab report approvals
- ✅ Medical record exports (patient/insurance)
- ✅ HIPAA-compliant storage

#### **Financial Management System**
- ✅ Dynamic consultation fee setting (per minute/session)
- ✅ Real-time earnings dashboard
- ✅ Secure payment processing
- ✅ Bank/UPI withdrawal system
- ✅ Consultation tracking and analytics
- ✅ Patient refund handling
- ✅ Tax statement generation
- ✅ Invoice management

#### **Admin & Compliance Management**
- ✅ HIPAA/GDPR compliance monitoring
- ✅ CME (Continuing Medical Education) tracking
- ✅ Hospital notices and updates
- ✅ Compliance form management
- ✅ Ethics reporting system
- ✅ System training modules

#### **Security & Privacy**
- ✅ End-to-end encrypted communications
- ✅ Two-factor authentication
- ✅ Biometric login support
- ✅ Session timeout management
- ✅ Role-based access control
- ✅ Comprehensive audit logging
- ✅ Data anonymization
- ✅ Sensitive data locking

### 🔧 Advanced Micro-Functionalities

- ✅ **Quick Voice Notes** for patient files
- ✅ **Anatomical Diagram Drawing** for patient education
- ✅ **Educational Video Sharing** during consultations
- ✅ **Instant Language Translation** for cross-language conversations
- ✅ **Offline Consultation Mode** (store-and-forward)
- ✅ **Medical Certificates** (return to work, fit to travel)
- ✅ **Nurse Task Assignment** post-consultation
- ✅ **Color-coded Urgency Tags** for patient cases
- ✅ **Dark Mode** support
- ✅ **Pinned Patients** for quick access
- ✅ **Private Reminders** system

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **Vite 5.4.2** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 10.16** - Animation library
- **React Router DOM 6.26** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Chart.js & React-ChartJS-2** - Data visualization
- **React Toastify** - Notification system

### Backend & Services
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Python** - AI/ML services
- **Docker** - Containerization
- **Nginx** - Reverse proxy and load balancer

### AI & Medical Services
- **Medical AI Models** - Diagnosis assistance
- **Voice Processing** - Speech-to-text conversion
- **Report Analysis** - Automated medical report interpretation
- **Emergency Assistant** - AI-powered emergency guidance
- **Prescription Generator** - Intelligent prescription assistance

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **TypeScript** - Type checking (partial)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)
- MongoDB (for database)
- Python 3.8+ (for AI services)

### 1. Clone the Repository
```bash
git clone https://github.com/kranthikiran885366/167---AI-Based-Doctor-Virtual-Hospital-System.git
cd 167---AI-Based-Doctor-Virtual-Hospital-System/project
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install AI service dependencies
cd ai-services
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup
Create `.env` files for different services:

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001
VITE_AI_SERVICE_URL=http://localhost:8000
```

**Backend (server/.env)**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/virtual-hospital
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

**AI Services (ai-services/.env)**
```env
FLASK_PORT=8000
MODEL_PATH=./models
MONGODB_URI=mongodb://localhost:27017/virtual-hospital
```

### 4. Database Setup
```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Initialize database
cd database
node mongo-init.js
```

### 5. Start Development Servers

**Option A: Manual Start**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
npm start

# Terminal 3: AI Services
cd ai-services
python main.py

# Terminal 4: Database (if not using Docker)
mongod
```

**Option B: Docker Compose**
```bash
docker-compose up -d
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **AI Services**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017

## 🏗️ Project Structure

```
project/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── EmergencyHandler.jsx
│   │   ├── MedicalDocumentation.jsx
│   │   ├── PatientMonitoring.jsx
│   │   └── ...
│   ├── pages/                    # Main application pages
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├���─ DoctorProfile.jsx     # Doctor profile management
│   │   ├── PatientManagement.jsx # Patient queue & management
│   │   ├── ConsultationModes.jsx # Video/audio consultations
│   │   ├── DiagnosticsTesting.jsx# Lab tests & diagnostics
│   │   ├── Prescription.jsx      # Digital prescriptions
│   │   ├── Emergency.jsx         # Emergency response
│   │   ├── Collaboration.jsx     # Doctor collaboration
│   │   ├── FinanceEarnings.jsx   # Financial management
│   │   └── ...
│   ├── context/                  # React context providers
│   ├── utils/                    # Utility functions
│   └── App.jsx                   # Main application component
├── server/                       # Backend Node.js application
│   ├── models/                   # Database models
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Custom middleware
│   └── index.js                  # Server entry point
├── ai-services/                  # Python AI/ML services
│   ├── models/                   # AI model definitions
│   ├── services/                 # AI service implementations
│   └── main.py                   # AI service entry point
├── database/                     # Database configuration
├── nginx/                        # Nginx configuration
├── scripts/                      # Deployment & utility scripts
└── public/                       # Static assets
```

## 🖥️ Usage Guide

### For Doctors

1. **Profile Setup**
   - Complete medical license verification
   - Upload credentials and certifications
   - Set consultation fees and availability

2. **Patient Management**
   - Monitor patient queue in real-time
   - Review AI pre-diagnosis summaries
   - Accept/reject consultation requests

3. **Consultations**
   - Conduct HD video/audio consultations
   - Use digital whiteboard for explanations
   - Record sessions (with consent)
   - Generate AI-powered transcriptions

4. **Medical Documentation**
   - Create comprehensive SOAP notes
   - Capture photos/videos during consultations
   - Generate digital prescriptions
   - Export medical records

5. **Collaboration**
   - Refer patients to specialists
   - Request second opinions
   - Participate in case discussions
   - Join multi-doctor conferences

### For Administrators

1. **System Management**
   - Monitor platform performance
   - Manage user accounts and permissions
   - Configure system settings
   - Review audit logs

2. **Compliance Monitoring**
   - Track HIPAA compliance status
   - Monitor CME requirements
   - Manage hospital notices
   - Generate compliance reports

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Doctor Endpoints
- `GET /api/doctors/profile` - Get doctor profile
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/schedule` - Get doctor schedule
- `PUT /api/doctors/availability` - Update availability

### Patient Endpoints
- `GET /api/patients` - Get patient list
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient record
- `PUT /api/patients/:id` - Update patient record

### Consultation Endpoints
- `POST /api/consultations` - Start consultation
- `GET /api/consultations/:id` - Get consultation details
- `PUT /api/consultations/:id` - Update consultation
- `POST /api/consultations/:id/notes` - Add consultation notes

### AI Service Endpoints
- `POST /api/ai/diagnose` - AI diagnosis assistance
- `POST /api/ai/analyze-report` - Medical report analysis
- `POST /api/ai/transcribe` - Audio transcription
- `POST /api/ai/emergency-guide` - Emergency guidance

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test

# Run AI service tests
cd ai-services
python -m pytest

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build

# Build AI services Docker image
cd ai-services
docker build -t ai-services .
```

### Docker Deployment
```bash
# Build all services
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration
Set production environment variables:
- Database connection strings
- JWT secrets
- API keys for external services
- SSL certificates
- SMTP configuration for email notifications

## 🔒 Security Considerations

- All communications are end-to-end encrypted
- HIPAA compliant data storage and transmission
- Regular security audits and penetration testing
- Multi-factor authentication required
- Role-based access control implemented
- Comprehensive audit logging
- Data anonymization for analytics
- Secure session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components
- Maintain code coverage above 80%
- Write comprehensive tests
- Follow HIPAA compliance guidelines
- Document all API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Mallela Kranthi Kiran** - Lead Developer
- **GitHub**: [@kranthikiran885366](https://github.com/kranthikiran885366)

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: kranthikiran885366@gmail.com

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete doctor functionality implementation
- ✅ AI-powered medical assistance
- ✅ Multi-modal consultation platform
- ✅ Comprehensive patient management
- ✅ Financial and compliance management
- ✅ Security and privacy features

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app development (React Native)
- [ ] Advanced AI diagnostic models
- [ ] IoT device integration
- [ ] Blockchain medical records
- [ ] Machine learning patient outcomes prediction
- [ ] Advanced analytics dashboard
- [ ] Integration with major EHR systems
- [ ] Multilingual support expansion

---

**🏥 Transforming Healthcare Through Technology**

This AI-Based Doctor Virtual Hospital System represents the future of healthcare delivery, combining cutting-edge technology with compassionate medical care to create an accessible, efficient, and secure platform for virtual healthcare services.
