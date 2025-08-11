import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Camera,
  Settings,
  Monitor,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Share,
  Record,
  StopCircle,
  Play,
  Pause,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Signal,
  User,
  Clock,
  Calendar,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Eye,
  Thermometer,
  Send,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const VideoConsultation = () => {
  const { user } = useUser();
  const [consultationMode, setConsultationMode] = useState('video'); // video, voice, text
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('high'); // high, medium, low
  const [bandwidth, setBandwidth] = useState(1000); // kbps
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      status: 'online',
      isVideoEnabled: true,
      isAudioEnabled: true,
      stream: null
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'Patient',
      status: 'online',
      isVideoEnabled: true,
      isAudioEnabled: true,
      stream: null
    }
  ]);

  // Call statistics
  const [callStats, setCallStats] = useState({
    packetsLost: 0,
    jitter: 0,
    latency: 15,
    bitrate: 800,
    resolution: '1280x720',
    fps: 30
  });

  // Video quality settings
  const [videoSettings, setVideoSettings] = useState({
    resolution: '720p',
    framerate: 30,
    bitrate: 1000,
    codec: 'h264'
  });

  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Monitor connection quality
  useEffect(() => {
    const qualityMonitor = setInterval(() => {
      // Simulate network monitoring
      const randomBandwidth = 500 + Math.random() * 1500;
      setBandwidth(randomBandwidth);
      
      if (randomBandwidth > 1000) {
        setConnectionQuality('high');
      } else if (randomBandwidth > 500) {
        setConnectionQuality('medium');
      } else {
        setConnectionQuality('low');
      }

      // Update call statistics
      setCallStats(prev => ({
        ...prev,
        packetsLost: Math.floor(Math.random() * 5),
        jitter: Math.floor(Math.random() * 10),
        latency: 10 + Math.floor(Math.random() * 50),
        bitrate: Math.floor(randomBandwidth * 0.8)
      }));
    }, 2000);

    return () => clearInterval(qualityMonitor);
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Bandwidth fallback logic
  useEffect(() => {
    if (connectionQuality === 'low' && consultationMode === 'video') {
      toast.warning('Low bandwidth detected. Consider switching to voice mode for better quality.');
      
      // Auto-adjust video quality
      setVideoSettings(prev => ({
        ...prev,
        resolution: '480p',
        framerate: 15,
        bitrate: 300
      }));
    } else if (connectionQuality === 'high') {
      setVideoSettings(prev => ({
        ...prev,
        resolution: '720p',
        framerate: 30,
        bitrate: 1000
      }));
    }
  }, [connectionQuality, consultationMode]);

  const startCall = async () => {
    try {
      const constraints = getStreamConstraints();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
      
      setIsCallActive(true);
      setCallDuration(0);
      
      // Initialize WebRTC peer connection
      initializePeerConnection(stream);
      
      toast.success('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call. Please check camera and microphone permissions.');
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    setIsRecording(false);
    
    toast.info('Call ended');
  };

  const getStreamConstraints = () => {
    const baseConstraints = {
      audio: isAudioEnabled ? {
        echoCancellation: audioSettings.echoCancellation,
        noiseSuppression: audioSettings.noiseSuppression,
        autoGainControl: audioSettings.autoGainControl,
        sampleRate: audioSettings.sampleRate
      } : false,
      video: false
    };

    if (consultationMode === 'video' && isVideoEnabled) {
      const videoConstraints = {
        width: getResolutionDimensions(videoSettings.resolution).width,
        height: getResolutionDimensions(videoSettings.resolution).height,
        frameRate: videoSettings.framerate,
        facingMode: 'user'
      };
      
      baseConstraints.video = videoConstraints;
    }

    return baseConstraints;
  };

  const getResolutionDimensions = (resolution) => {
    const resolutions = {
      '1080p': { width: 1920, height: 1080 },
      '720p': { width: 1280, height: 720 },
      '480p': { width: 854, height: 480 },
      '360p': { width: 640, height: 360 }
    };
    return resolutions[resolution] || resolutions['720p'];
  };

  const initializePeerConnection = (stream) => {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(config);
    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      remoteVideoRef.current.srcObject = remoteStream;
    };

    // Monitor connection state
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
    };
  };

  const switchMode = (mode) => {
    setConsultationMode(mode);
    
    if (isCallActive) {
      // Update stream constraints based on new mode
      updateStreamConstraints(mode);
    }
    
    toast.info(`Switched to ${mode} mode`);
  };

  const updateStreamConstraints = async (mode) => {
    try {
      const constraints = getStreamConstraints();
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Replace tracks in existing peer connection
      if (peerConnectionRef.current) {
        const videoTrack = newStream.getVideoTracks()[0];
        const audioTrack = newStream.getAudioTracks()[0];
        
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      }
      
      localVideoRef.current.srcObject = newStream;
      localStreamRef.current = newStream;
    } catch (error) {
      console.error('Error updating stream:', error);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info('Recording started');
    // Implement actual recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success('Recording saved');
    // Implement actual recording stop logic
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user?.name || 'Doctor',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'high': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'medium': return <Signal className="w-4 h-4 text-yellow-500" />;
      case 'low': return <WifiOff className="w-4 h-4 text-red-500" />;
      default: return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HD Video Consultation</h1>
              <p className="text-gray-600">Advanced Telemedicine Platform</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Call Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getConnectionIcon()}
                      <span className="text-sm font-medium">
                        {connectionQuality.toUpperCase()} ({Math.round(bandwidth)} kbps)
                      </span>
                    </div>
                    {isCallActive && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <div className="flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-xs">REC</span>
                      </div>
                    )}
                    
                    {/* Mode Indicators */}
                    <div className="flex space-x-1">
                      {['video', 'voice', 'text'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => switchMode(mode)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            consultationMode === mode
                              ? 'bg-white text-blue-600'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {mode === 'video' && <Video className="w-3 h-3 inline mr-1" />}
                          {mode === 'voice' && <Mic className="w-3 h-3 inline mr-1" />}
                          {mode === 'text' && <MessageSquare className="w-3 h-3 inline mr-1" />}
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Grid */}
              <div className="relative bg-gray-900" style={{ aspectRatio: '16/9' }}>
                {consultationMode === 'video' && (
                  <>
                    {/* Remote Video (Main) */}
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Local Video (Picture-in-Picture) */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                        You
                      </div>
                    </div>

                    {/* Connection Status Overlay */}
                    {connectionQuality === 'low' && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Poor Connection</span>
                      </div>
                    )}
                  </>
                )}

                {consultationMode === 'voice' && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-16 h-16" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Voice Call Active</h3>
                      <p className="text-blue-200">Audio quality optimized for low bandwidth</p>
                      <div className="mt-4 flex justify-center space-x-4">
                        {isAudioEnabled && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-6 bg-green-400 rounded animate-pulse" />
                            <div className="w-2 h-8 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-10 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {consultationMode === 'text' && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <MessageSquare className="w-32 h-32 mx-auto mb-6 text-blue-400" />
                      <h3 className="text-2xl font-semibold mb-2">Text Chat Mode</h3>
                      <p className="text-blue-200">Minimal bandwidth usage</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div className="bg-white p-6">
                <div className="flex items-center justify-center space-x-4">
                  {!isCallActive ? (
                    <button
                      onClick={startCall}
                      className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-6 h-6" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={toggleAudio}
                        className={`p-3 rounded-full transition-colors ${
                          isAudioEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-colors ${
                          isVideoEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`p-3 rounded-full transition-colors ${
                          isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isRecording ? <StopCircle className="w-5 h-5" /> : <Record className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={() => toast.info('Screen sharing started')}
                        className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        <Share className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={endCall}
                        className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <PhoneOff className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center space-x-2 mt-4">
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                    <Stethoscope className="w-4 h-4 inline mr-1" />
                    Medical Notes
                  </button>
                  <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Prescription
                  </button>
                  <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Participants ({participants.length})</h3>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                    <div className="flex space-x-1">
                      {participant.isVideoEnabled ? (
                        <Video className="w-3 h-3 text-green-500" />
                      ) : (
                        <VideoOff className="w-3 h-3 text-gray-400" />
                      )}
                      {participant.isAudioEnabled ? (
                        <Mic className="w-3 h-3 text-green-500" />
                      ) : (
                        <MicOff className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Quality */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Connection Quality</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bandwidth:</span>
                  <span className="text-sm font-medium">{Math.round(bandwidth)} kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Latency:</span>
                  <span className="text-sm font-medium">{callStats.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Packets Lost:</span>
                  <span className="text-sm font-medium">{callStats.packetsLost}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution:</span>
                  <span className="text-sm font-medium">{callStats.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frame Rate:</span>
                  <span className="text-sm font-medium">{callStats.fps} fps</span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Quality:</span>
                    <span className={`text-sm font-medium ${
                      connectionQuality === 'high' ? 'text-green-600' :
                      connectionQuality === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {connectionQuality.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        connectionQuality === 'high' ? 'bg-green-500' :
                        connectionQuality === 'medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: connectionQuality === 'high' ? '100%' : 
                               connectionQuality === 'medium' ? '60%' : '30%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Chat Messages</h3>
              
              <div 
                ref={chatContainerRef}
                className="h-64 overflow-y-auto space-y-3 mb-4"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${
                    message.sender === (user?.name || 'Doctor') ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === (user?.name || 'Doctor')
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p>{message.content}</p>
                      <span className="text-xs opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {chatMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings Quick Access */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Video Quality</label>
                  <select
                    value={videoSettings.resolution}
                    onChange={(e) => setVideoSettings(prev => ({ ...prev, resolution: e.target.value }))}
                    className="w-full mt-1 text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="1080p">1080p HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                    <option value="360p">360p Low</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Echo Cancellation</span>
                  <button
                    onClick={() => setAudioSettings(prev => ({ ...prev, echoCancellation: !prev.echoCancellation }))}
                    className={`w-8 h-4 rounded-full transition-colors ${
                      audioSettings.echoCancellation ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                      audioSettings.echoCancellation ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Noise Suppression</span>
                  <button
                    onClick={() => setAudioSettings(prev => ({ ...prev, noiseSuppression: !prev.noiseSuppression }))}
                    className={`w-8 h-4 rounded-full transition-colors ${
                      audioSettings.noiseSuppression ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                      audioSettings.noiseSuppression ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
