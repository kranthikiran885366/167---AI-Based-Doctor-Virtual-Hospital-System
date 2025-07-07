import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Pill, 
  Heart, 
  Droplets, 
  Moon, 
  Sun,
  Plus,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const NurseReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'medication',
    title: '',
    time: '',
    frequency: 'daily',
    notes: ''
  });

  const reminderTypes = [
    { id: 'medication', name: 'Medication', icon: Pill, color: 'bg-blue-500' },
    { id: 'water', name: 'Water Intake', icon: Droplets, color: 'bg-cyan-500' },
    { id: 'exercise', name: 'Exercise', icon: Heart, color: 'bg-red-500' },
    { id: 'sleep', name: 'Sleep', icon: Moon, color: 'bg-purple-500' },
    { id: 'checkup', name: 'Health Checkup', icon: Clock, color: 'bg-green-500' }
  ];

  const frequencies = [
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'custom', name: 'Custom' }
  ];

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('nurseReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      // Set default reminders
      const defaultReminders = [
        {
          id: 1,
          type: 'medication',
          title: 'Take Morning Vitamins',
          time: '08:00',
          frequency: 'daily',
          notes: 'Take with breakfast',
          isActive: true,
          lastCompleted: null
        },
        {
          id: 2,
          type: 'water',
          title: 'Drink Water',
          time: '10:00',
          frequency: 'daily',
          notes: 'Stay hydrated throughout the day',
          isActive: true,
          lastCompleted: null
        },
        {
          id: 3,
          type: 'exercise',
          title: 'Evening Walk',
          time: '18:00',
          frequency: 'daily',
          notes: '30 minutes of light exercise',
          isActive: true,
          lastCompleted: null
        }
      ];
      setReminders(defaultReminders);
      localStorage.setItem('nurseReminders', JSON.stringify(defaultReminders));
    }

    // Set up notification checking
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.time === currentTime) {
          showNotification(reminder);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  const showNotification = (reminder) => {
    const reminderType = reminderTypes.find(type => type.id === reminder.type);
    const Icon = reminderType?.icon || Bell;
    
    toast.info(
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <div>
          <div className="font-medium">{reminder.title}</div>
          <div className="text-sm opacity-75">{reminder.notes}</div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );

    // Request browser notification permission
    if (Notification.permission === 'granted') {
      new Notification(`AI Nurse Reminder: ${reminder.title}`, {
        body: reminder.notes,
        icon: '/medical-icon.svg'
      });
    }
  };

  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      isActive: true,
      lastCompleted: null
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    localStorage.setItem('nurseReminders', JSON.stringify(updatedReminders));
    
    setNewReminder({
      type: 'medication',
      title: '',
      time: '',
      frequency: 'daily',
      notes: ''
    });
    setShowAddForm(false);
    toast.success('Reminder added successfully');
  };

  const toggleReminder = (id) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('nurseReminders', JSON.stringify(updatedReminders));
  };

  const completeReminder = (id) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, lastCompleted: new Date().toISOString() } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('nurseReminders', JSON.stringify(updatedReminders));
    toast.success('Reminder completed!');
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('nurseReminders', JSON.stringify(updatedReminders));
    toast.success('Reminder deleted');
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('Notifications enabled');
        }
      });
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Nurse Reminders</h2>
            <p className="text-gray-600 text-sm">Your personal health assistant</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Add New Reminder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {reminderTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="e.g., Take morning medication"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map(freq => (
                    <option key={freq.id} value={freq.id}>{freq.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <input
                  type="text"
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                  placeholder="Additional instructions or notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addReminder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Reminder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reminders Set</h3>
            <p className="text-gray-500">Add your first reminder to get started</p>
          </div>
        ) : (
          reminders.map((reminder) => {
            const reminderType = reminderTypes.find(type => type.id === reminder.type);
            const Icon = reminderType?.icon || Bell;
            const isCompleted = reminder.lastCompleted && 
              new Date(reminder.lastCompleted).toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  reminder.isActive 
                    ? isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${reminderType?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{reminder.time}</span>
                        </span>
                        <span className="capitalize">{reminder.frequency}</span>
                        {reminder.notes && (
                          <span className="text-gray-500">• {reminder.notes}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {reminder.isActive && !isCompleted && (
                      <button
                        onClick={() => completeReminder(reminder.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}

                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        reminder.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={reminder.isActive ? 'Disable reminder' : 'Enable reminder'}
                    >
                      {reminder.isActive ? <AlertCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete reminder"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Daily Health Tips */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Sun className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Today's Health Tip</h3>
        </div>
        <p className="text-gray-700 text-sm">
          💧 Remember to drink water regularly throughout the day. Aim for 8 glasses to stay properly hydrated and maintain optimal health.
        </p>
      </div>
    </div>
  );
};

export default NurseReminders;