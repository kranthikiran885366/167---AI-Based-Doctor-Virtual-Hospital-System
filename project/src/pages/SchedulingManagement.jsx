import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Settings, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Bell,
  RefreshCw,
  User,
  Stethoscope,
  FileText,
  Star,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';

const SchedulingManagement = () => {
  const [currentView, setCurrentView] = useState('week'); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [timeZone, setTimeZone] = useState('America/New_York');
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });
  const [selectedDuration, setSelectedDuration] = useState(30);

  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P001',
      date: '2024-01-15',
      time: '09:00',
      duration: 30,
      type: 'consultation',
      mode: 'video',
      status: 'confirmed',
      reason: 'Chest pain follow-up',
      priority: 'normal',
      insurance: 'Blue Cross',
      fee: 200,
      isFirstVisit: false,
      patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      patientId: 'P002',
      date: '2024-01-15',
      time: '10:00',
      duration: 45,
      type: 'emergency',
      mode: 'video',
      status: 'pending',
      reason: 'Severe headache',
      priority: 'high',
      insurance: 'Aetna',
      fee: 300,
      isFirstVisit: true,
      patientPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&auto=format'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'P003',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      type: 'consultation',
      mode: 'phone',
      status: 'confirmed',
      reason: 'Diabetes management',
      priority: 'normal',
      insurance: 'Medicare',
      fee: 150,
      isFirstVisit: false,
      patientPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format'
    }
  ]);

  // Waitlist for overbooked slots
  const [waitlist, setWaitlist] = useState([
    {
      id: 4,
      patientName: 'Sarah Wilson',
      preferredTime: '10:00',
      date: '2024-01-15',
      priority: 'normal',
      reason: 'Routine check-up',
      waitingSince: '2024-01-14'
    }
  ]);

  // Blocked time slots
  const [blockedSlots, setBlockedSlots] = useState([
    {
      id: 1,
      date: '2024-01-15',
      startTime: '12:00',
      endTime: '13:00',
      reason: 'Lunch Break',
      type: 'break'
    }
  ]);

  const timeSlots = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const getDaysInWeek = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (date) => {
    const dateString = formatDate(date);
    return appointments.filter(apt => apt.date === dateString);
  };

  const isSlotBlocked = (date, time) => {
    const dateString = formatDate(date);
    return blockedSlots.some(blocked => 
      blocked.date === dateString && 
      time >= blocked.startTime && 
      time < blocked.endTime
    );
  };

  const isSlotBooked = (date, time) => {
    const dateString = formatDate(date);
    return appointments.some(apt => 
      apt.date === dateString && 
      apt.time === time
    );
  };

  const acceptAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'confirmed' }
        : apt
    ));
    toast.success('Appointment confirmed');
  };

  const rejectAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    toast.success('Appointment rejected');
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, date: newDate, time: newTime, status: 'rescheduled' }
        : apt
    ));
    toast.success('Appointment rescheduled');
  };

  const blockTimeSlot = (date, startTime, endTime, reason) => {
    const newBlock = {
      id: Date.now(),
      date: formatDate(date),
      startTime,
      endTime,
      reason,
      type: 'manual'
    };
    setBlockedSlots(prev => [...prev, newBlock]);
    toast.success('Time slot blocked');
  };

  const addToWaitlist = (patientData) => {
    const waitlistEntry = {
      id: Date.now(),
      ...patientData,
      waitingSince: new Date().toISOString().split('T')[0]
    };
    setWaitlist(prev => [...prev, waitlistEntry]);
    toast.success('Patient added to waitlist');
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'normal': return 'border-l-4 border-green-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Management</h1>
              <p className="text-gray-600">Manage appointments, calendar, and availability</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="UTC">UTC</option>
              </select>
              
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Appointment</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* View Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['day', 'week', 'month'].map(view => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      currentView === view
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate(-1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    ...(currentView === 'day' && { day: 'numeric' })
                  })}
                </h2>
                <button
                  onClick={() => navigateDate(1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 min slots</option>
                  <option value={30}>30 min slots</option>
                  <option value={45}>45 min slots</option>
                  <option value={60}>60 min slots</option>
                </select>
              </div>
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {currentView === 'day' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <p className="opacity-90">Daily Schedule</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Time Zone: {timeZone}</p>
                  <p className="text-sm opacity-90">
                    {getAppointmentsForDate(currentDate).length} appointments
                  </p>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map(time => {
                const dayAppointments = getAppointmentsForDate(currentDate).filter(apt => apt.time === time);
                const isBlocked = isSlotBlocked(currentDate, time);

                return (
                  <div key={time} className={`flex border-b border-gray-100 hover:bg-gray-50 ${
                    isBlocked ? 'bg-red-50' : ''
                  }`}>
                    <div className="w-20 p-4 border-r border-gray-200 bg-gray-50 flex items-center">
                      <span className="text-sm font-medium text-gray-600">{time}</span>
                    </div>
                    <div
                      className="flex-1 p-4 min-h-[80px] cursor-pointer"
                      onClick={() => !isBlocked && setSelectedSlot({ date: currentDate, time })}
                    >
                      {dayAppointments.length > 0 ? (
                        <div className="space-y-2">
                          {dayAppointments.map(appointment => (
                            <div
                              key={appointment.id}
                              className={`p-3 rounded-lg ${getPriorityColor(appointment.priority)} bg-white shadow-sm border`}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={appointment.patientPhoto}
                                  alt={appointment.patientName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                                      {appointment.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{appointment.duration} min</span>
                                    <span className="text-xs text-gray-500">${appointment.fee}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {appointment.mode === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                                  {appointment.mode === 'phone' && <Phone className="w-4 h-4 text-green-500" />}
                                  {appointment.mode === 'text' && <MessageSquare className="w-4 h-4 text-purple-500" />}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          {isBlocked ? (
                            <div className="flex items-center space-x-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">Blocked</span>
                            </div>
                          ) : (
                            <span className="text-sm">Available</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-500">Time</span>
              </div>
              {getDaysInWeek(currentDate).map((day, index) => (
                <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50">
                  <div className="p-3 border-r border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-600">{time}</span>
                  </div>
                  {getDaysInWeek(currentDate).map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDate(day).filter(apt => apt.time === time);
                    const isBlocked = isSlotBlocked(day, time);
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`p-2 border-r border-gray-200 last:border-r-0 min-h-[60px] ${
                          isBlocked ? 'bg-red-50' : 'hover:bg-blue-50 cursor-pointer'
                        }`}
                        onClick={() => !isBlocked && setSelectedSlot({ date: day, time })}
                      >
                        {dayAppointments.map(appointment => (
                          <div
                            key={appointment.id}
                            className={`p-2 rounded-lg text-xs mb-1 ${getPriorityColor(appointment.priority)} bg-white shadow-sm`}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={appointment.patientPhoto}
                                alt={appointment.patientName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {appointment.patientName}
                                </p>
                                <p className="text-gray-500 truncate">
                                  {appointment.reason}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {appointment.mode === 'video' && <Video className="w-3 h-3 text-blue-500" />}
                                {appointment.mode === 'phone' && <Phone className="w-3 h-3 text-green-500" />}
                                {appointment.mode === 'text' && <MessageSquare className="w-3 h-3 text-purple-500" />}
                              </div>
                            </div>
                            <div className={`mt-1 px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </div>
                          </div>
                        ))}
                        {isBlocked && (
                          <div className="p-2 bg-red-100 rounded-lg text-xs text-red-800">
                            Blocked
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'month' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Month Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <h2 className="text-2xl font-bold">
                {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </h2>
              <p className="opacity-90">Monthly Overview</p>
            </div>

            {/* Month Grid */}
            <div className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
              </div>

              {/* Month Days */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay());

                  const days = [];
                  for (let i = 0; i < 42; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    const isCurrentMonth = date.getMonth() === month;
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayAppointments = getAppointmentsForDate(date);

                    days.push(
                      <div
                        key={i}
                        className={`p-2 min-h-[100px] border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => {
                          setCurrentDate(new Date(date));
                          setCurrentView('day');
                        }}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {date.getDate()}
                        </div>

                        {dayAppointments.length > 0 && (
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 3).map(appointment => (
                              <div
                                key={appointment.id}
                                className={`p-1 rounded text-xs ${getPriorityColor(appointment.priority)} bg-opacity-20`}
                              >
                                <div className="truncate font-medium">{appointment.patientName}</div>
                                <div className="truncate text-gray-600">{appointment.time}</div>
                              </div>
                            ))}
                            {dayAppointments.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayAppointments.length - 3} more
                              </div>
                            )}
                          </div>
                        )}

                        {dayAppointments.length === 0 && isCurrentMonth && (
                          <div className="flex items-center justify-center h-16 text-gray-300">
                            <Plus className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Pending Appointments */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Pending Appointments</h3>
              <div className="space-y-4">
                {appointments.filter(apt => apt.status === 'pending').map(appointment => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-2 ${getPriorityColor(appointment.priority)} bg-white`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={appointment.patientPhoto}
                          alt={appointment.patientName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                          <p className="text-gray-600">{appointment.reason}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{appointment.date} at {appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.duration} min</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${appointment.fee}</span>
                            </span>
                          </div>
                          {appointment.isFirstVisit && (
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              First Visit
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => acceptAppointment(appointment.id)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => rejectAppointment(appointment.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Waitlist */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waitlist</h3>
              <div className="space-y-3">
                {waitlist.map(patient => (
                  <div key={patient.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-gray-900">{patient.patientName}</h4>
                    <p className="text-sm text-gray-600">{patient.reason}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Preferred: {patient.preferredTime}
                      </span>
                      <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-semibold text-gray-900">{appointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">
                    {appointments.filter(apt => apt.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {appointments.filter(apt => apt.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Waitlist</span>
                  <span className="font-semibold text-orange-600">{waitlist.length}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expected Revenue</span>
                    <span className="font-semibold text-blue-600">
                      ${appointments.reduce((sum, apt) => sum + apt.fee, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Override */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-semibold">Emergency Override</h3>
                <p className="opacity-90">Instantly make yourself available for urgent cases</p>
              </div>
            </div>
            <button
              onClick={() => toast.success('Emergency mode activated')}
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Activate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingManagement;
