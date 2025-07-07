const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const diagnosisRoutes = require('./routes/diagnosis');
const reportRoutes = require('./routes/reports');
const prescriptionRoutes = require('./routes/prescription');
const emergencyRoutes = require('./routes/emergency');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-doctor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('join-emergency', (userId) => {
    socket.join(`emergency-${userId}`);
    console.log(`🚨 User ${userId} joined emergency room`);
  });
  
  socket.on('emergency-alert', (data) => {
    io.to(`emergency-${data.userId}`).emit('emergency-response', data);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Doctor Backend is running',
    timestamp: new Date().toISOString(),
    company: 'MVK Solutions'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AI Doctor Backend running on port ${PORT}`);
  console.log(`🏥 MVK Solutions - Virtual Hospital System`);
});

module.exports = { app, io };