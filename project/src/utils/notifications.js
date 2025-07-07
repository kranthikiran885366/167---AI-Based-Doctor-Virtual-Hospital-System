// Notification utilities for the AI Doctor system
export class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.registration = null;
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }
    return false;
  }

  // Register service worker for push notifications
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }

  // Show local notification
  showNotification(title, options = {}) {
    if (this.permission === 'granted') {
      const defaultOptions = {
        icon: '/medical-icon-192.png',
        badge: '/medical-icon-192.png',
        vibrate: [100, 50, 100],
        requireInteraction: false,
        ...options
      };

      return new Notification(title, defaultOptions);
    }
    return null;
  }

  // Schedule medication reminder
  scheduleMedicationReminder(medication, time) {
    const now = new Date();
    const reminderTime = new Date();
    const [hours, minutes] = time.split(':');
    
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification('Medication Reminder', {
        body: `Time to take your ${medication.name}`,
        icon: '/medical-icon-192.png',
        tag: `medication-${medication.id}`,
        actions: [
          {
            action: 'taken',
            title: 'Mark as Taken'
          },
          {
            action: 'snooze',
            title: 'Remind Later'
          }
        ]
      });
    }, delay);
  }

  // Show health tip notification
  showHealthTip(tip) {
    this.showNotification('Daily Health Tip', {
      body: tip,
      icon: '/medical-icon-192.png',
      tag: 'health-tip',
      requireInteraction: false
    });
  }

  // Show emergency alert
  showEmergencyAlert(message, location) {
    this.showNotification('Emergency Alert', {
      body: message,
      icon: '/medical-icon-192.png',
      tag: 'emergency',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      actions: [
        {
          action: 'call-emergency',
          title: 'Call 108'
        },
        {
          action: 'share-location',
          title: 'Share Location'
        }
      ]
    });
  }

  // Show appointment reminder
  showAppointmentReminder(appointment) {
    this.showNotification('Appointment Reminder', {
      body: `You have an appointment at ${appointment.time}`,
      icon: '/medical-icon-192.png',
      tag: `appointment-${appointment.id}`,
      requireInteraction: true
    });
  }

  // Show diagnosis result notification
  showDiagnosisResult(diagnosis) {
    this.showNotification('AI Diagnosis Complete', {
      body: `Diagnosis: ${diagnosis.condition} (${diagnosis.confidence}% confidence)`,
      icon: '/medical-icon-192.png',
      tag: 'diagnosis-result',
      actions: [
        {
          action: 'view-details',
          title: 'View Details'
        },
        {
          action: 'get-prescription',
          title: 'Get Prescription'
        }
      ]
    });
  }

  // Show report analysis notification
  showReportAnalysis(analysis) {
    this.showNotification('Report Analysis Complete', {
      body: `Your ${analysis.type} has been analyzed`,
      icon: '/medical-icon-192.png',
      tag: 'report-analysis',
      actions: [
        {
          action: 'view-results',
          title: 'View Results'
        }
      ]
    });
  }

  // Handle notification clicks
  handleNotificationClick(event) {
    const { action, notification } = event;
    
    switch (action) {
      case 'taken':
        // Mark medication as taken
        this.markMedicationTaken(notification.tag);
        break;
      case 'snooze':
        // Snooze reminder for 15 minutes
        this.snoozeMedicationReminder(notification.tag, 15);
        break;
      case 'call-emergency':
        // Open phone dialer with emergency number
        window.open('tel:108');
        break;
      case 'share-location':
        // Share current location
        this.shareLocation();
        break;
      case 'view-details':
      case 'view-results':
        // Open app to relevant page
        this.openApp('/dashboard');
        break;
      case 'get-prescription':
        // Open prescription page
        this.openApp('/prescription');
        break;
      default:
        // Default action - open app
        this.openApp('/');
    }
    
    notification.close();
  }

  // Mark medication as taken
  markMedicationTaken(tag) {
    const medicationId = tag.replace('medication-', '');
    // Update medication status in localStorage or send to backend
    const reminders = JSON.parse(localStorage.getItem('nurseReminders') || '[]');
    const updatedReminders = reminders.map(reminder => 
      reminder.id.toString() === medicationId 
        ? { ...reminder, lastCompleted: new Date().toISOString() }
        : reminder
    );
    localStorage.setItem('nurseReminders', JSON.stringify(updatedReminders));
  }

  // Snooze medication reminder
  snoozeMedicationReminder(tag, minutes) {
    const medicationId = tag.replace('medication-', '');
    setTimeout(() => {
      this.showNotification('Medication Reminder (Snoozed)', {
        body: 'Time to take your medication',
        icon: '/medical-icon-192.png',
        tag: `medication-${medicationId}-snooze`
      });
    }, minutes * 60 * 1000);
  }

  // Share current location
  async shareLocation() {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        if (navigator.share) {
          await navigator.share({
            title: 'Emergency Location',
            text: 'I need help at this location',
            url: locationUrl
          });
        } else {
          // Fallback - copy to clipboard
          await navigator.clipboard.writeText(locationUrl);
          this.showNotification('Location Copied', {
            body: 'Location URL copied to clipboard',
            icon: '/medical-icon-192.png'
          });
        }
      } catch (error) {
        console.error('Error sharing location:', error);
      }
    }
  }

  // Open app to specific page
  openApp(path = '/') {
    if ('serviceWorker' in navigator && 'clients' in self) {
      // Try to focus existing window first
      self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
          clients[0].focus();
          clients[0].navigate(path);
        } else {
          // Open new window
          self.clients.openWindow(path);
        }
      });
    } else {
      // Fallback
      window.open(path, '_blank');
    }
  }

  // Initialize notification service
  async initialize() {
    const permissionGranted = await this.requestPermission();
    const swRegistered = await this.registerServiceWorker();
    
    if (permissionGranted && swRegistered) {
      // Set up notification click handler
      if (this.registration) {
        this.registration.addEventListener('notificationclick', this.handleNotificationClick.bind(this));
      }
      
      // Schedule daily health tips
      this.scheduleDailyHealthTips();
      
      return true;
    }
    
    return false;
  }

  // Schedule daily health tips
  scheduleDailyHealthTips() {
    const tips = [
      "Remember to drink water regularly throughout the day",
      "Take a 5-minute break every hour to stretch",
      "Aim for 7-9 hours of sleep each night",
      "Include fruits and vegetables in every meal",
      "Practice deep breathing for stress relief"
    ];

    // Show tip at 9 AM daily
    const now = new Date();
    const tipTime = new Date();
    tipTime.setHours(9, 0, 0, 0);
    
    if (tipTime <= now) {
      tipTime.setDate(tipTime.getDate() + 1);
    }

    const delay = tipTime.getTime() - now.getTime();
    
    setTimeout(() => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      this.showHealthTip(randomTip);
      
      // Schedule next tip for tomorrow
      setInterval(() => {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showHealthTip(randomTip);
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, delay);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;