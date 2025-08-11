import React from 'react';
import { motion } from 'framer-motion';
import { Bell, TrendingUp, Heart, Activity } from 'lucide-react';

const PatientFollowup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Patient Follow-up & Monitoring
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Track patient progress, manage reminders, and monitor chronic conditions with real-time insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
            <div className="text-sm text-gray-600">Active Reminders</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">87%</div>
            <div className="text-sm text-gray-600">Adherence Rate</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
            <div className="text-sm text-gray-600">Chronic Patients</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-sm text-gray-600">Data Sync Rate</div>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <p className="text-gray-600 mb-4">
            This comprehensive patient follow-up system will include:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Patient progress timeline tracking</li>
            <li>• Automated medication reminders</li>
            <li>• Chronic condition monitoring</li>
            <li>• Wearable device integration</li>
            <li>• AI-powered health trend analysis</li>
            <li>• Follow-up appointment scheduling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientFollowup;
