import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Activity } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center"
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Doctor</h1>
          <p className="text-gray-600 mb-4">MVK Solutions</p>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              <Heart className="w-6 h-6 text-red-500" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              <Activity className="w-6 h-6 text-green-500" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            >
              <Stethoscope className="w-6 h-6 text-blue-500" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto"
            style={{ maxWidth: '200px' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 mt-4"
          >
            Initializing AI Healthcare System...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-xs text-gray-400"
          >
            Setting up secure medical environment
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
