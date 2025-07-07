// Offline storage utilities for the AI Doctor system
export class OfflineStorageService {
  constructor() {
    this.dbName = 'AIDoctorDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // Initialize IndexedDB
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('medicalRecords')) {
          const medicalStore = db.createObjectStore('medicalRecords', { keyPath: 'id', autoIncrement: true });
          medicalStore.createIndex('userId', 'userId', { unique: false });
          medicalStore.createIndex('type', 'type', { unique: false });
          medicalStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('prescriptions')) {
          const prescriptionStore = db.createObjectStore('prescriptions', { keyPath: 'id', autoIncrement: true });
          prescriptionStore.createIndex('userId', 'userId', { unique: false });
          prescriptionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('reminders')) {
          const reminderStore = db.createObjectStore('reminders', { keyPath: 'id', autoIncrement: true });
          reminderStore.createIndex('userId', 'userId', { unique: false });
          reminderStore.createIndex('time', 'time', { unique: false });
        }

        if (!db.objectStoreNames.contains('healthData')) {
          const healthStore = db.createObjectStore('healthData', { keyPath: 'id', autoIncrement: true });
          healthStore.createIndex('userId', 'userId', { unique: false });
          healthStore.createIndex('date', 'date', { unique: false });
          healthStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('action', 'action', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Generic method to add data to a store
  async addData(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add({ ...data, timestamp: new Date().toISOString() });

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to add data to ${storeName}`));
      };
    });
  }

  // Generic method to get data from a store
  async getData(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get data from ${storeName}`));
      };
    });
  }

  // Generic method to get all data from a store
  async getAllData(storeName, userId = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (userId) {
        const index = store.index('userId');
        request = index.getAll(userId);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all data from ${storeName}`));
      };
    });
  }

  // Generic method to update data in a store
  async updateData(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ ...data, updatedAt: new Date().toISOString() });

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to update data in ${storeName}`));
      };
    });
  }

  // Generic method to delete data from a store
  async deleteData(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete data from ${storeName}`));
      };
    });
  }

  // Save medical record offline
  async saveMedicalRecord(record) {
    try {
      const id = await this.addData('medicalRecords', record);
      
      // Add to sync queue
      await this.addToSyncQueue('CREATE_MEDICAL_RECORD', { ...record, localId: id });
      
      return id;
    } catch (error) {
      console.error('Error saving medical record offline:', error);
      throw error;
    }
  }

  // Save prescription offline
  async savePrescription(prescription) {
    try {
      const id = await this.addData('prescriptions', prescription);
      
      // Add to sync queue
      await this.addToSyncQueue('CREATE_PRESCRIPTION', { ...prescription, localId: id });
      
      return id;
    } catch (error) {
      console.error('Error saving prescription offline:', error);
      throw error;
    }
  }

  // Save health data offline
  async saveHealthData(healthData) {
    try {
      const id = await this.addData('healthData', healthData);
      
      // Add to sync queue
      await this.addToSyncQueue('CREATE_HEALTH_DATA', { ...healthData, localId: id });
      
      return id;
    } catch (error) {
      console.error('Error saving health data offline:', error);
      throw error;
    }
  }

  // Save reminder offline
  async saveReminder(reminder) {
    try {
      const id = await this.addData('reminders', reminder);
      
      // Add to sync queue
      await this.addToSyncQueue('CREATE_REMINDER', { ...reminder, localId: id });
      
      return id;
    } catch (error) {
      console.error('Error saving reminder offline:', error);
      throw error;
    }
  }

  // Add item to sync queue
  async addToSyncQueue(action, data) {
    try {
      return await this.addData('syncQueue', {
        action,
        data,
        synced: false,
        retryCount: 0
      });
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      throw error;
    }
  }

  // Get all unsynced items
  async getUnsyncedItems() {
    try {
      const allItems = await this.getAllData('syncQueue');
      return allItems.filter(item => !item.synced);
    } catch (error) {
      console.error('Error getting unsynced items:', error);
      return [];
    }
  }

  // Mark item as synced
  async markAsSynced(id) {
    try {
      const item = await this.getData('syncQueue', id);
      if (item) {
        item.synced = true;
        item.syncedAt = new Date().toISOString();
        await this.updateData('syncQueue', item);
      }
    } catch (error) {
      console.error('Error marking item as synced:', error);
    }
  }

  // Sync data with server
  async syncWithServer() {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping sync');
      return;
    }

    try {
      const unsyncedItems = await this.getUnsyncedItems();
      
      for (const item of unsyncedItems) {
        try {
          await this.syncItem(item);
          await this.markAsSynced(item.id);
        } catch (error) {
          console.error('Error syncing item:', error);
          
          // Increment retry count
          item.retryCount = (item.retryCount || 0) + 1;
          
          // Remove from queue if too many retries
          if (item.retryCount > 3) {
            await this.deleteData('syncQueue', item.id);
          } else {
            await this.updateData('syncQueue', item);
          }
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  }

  // Sync individual item
  async syncItem(item) {
    const { action, data } = item;
    
    switch (action) {
      case 'CREATE_MEDICAL_RECORD':
        await this.syncMedicalRecord(data);
        break;
      case 'CREATE_PRESCRIPTION':
        await this.syncPrescription(data);
        break;
      case 'CREATE_HEALTH_DATA':
        await this.syncHealthData(data);
        break;
      case 'CREATE_REMINDER':
        await this.syncReminder(data);
        break;
      default:
        console.warn('Unknown sync action:', action);
    }
  }

  // Sync medical record with server
  async syncMedicalRecord(record) {
    const response = await fetch('/api/medical-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      throw new Error('Failed to sync medical record');
    }

    return await response.json();
  }

  // Sync prescription with server
  async syncPrescription(prescription) {
    const response = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(prescription)
    });

    if (!response.ok) {
      throw new Error('Failed to sync prescription');
    }

    return await response.json();
  }

  // Sync health data with server
  async syncHealthData(healthData) {
    const response = await fetch('/api/health-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(healthData)
    });

    if (!response.ok) {
      throw new Error('Failed to sync health data');
    }

    return await response.json();
  }

  // Sync reminder with server
  async syncReminder(reminder) {
    const response = await fetch('/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(reminder)
    });

    if (!response.ok) {
      throw new Error('Failed to sync reminder');
    }

    return await response.json();
  }

  // Clear all offline data
  async clearAllData() {
    try {
      const stores = ['medicalRecords', 'prescriptions', 'reminders', 'healthData', 'syncQueue'];
      
      for (const storeName of stores) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }

  // Get storage usage
  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage,
          available: estimate.quota,
          percentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      } catch (error) {
        console.error('Error getting storage usage:', error);
        return null;
      }
    }
    return null;
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();
export default offlineStorage;