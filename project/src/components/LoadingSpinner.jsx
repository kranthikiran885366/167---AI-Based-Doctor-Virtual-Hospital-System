import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5"
        >
          <div className="w-12 h-12 bg-[#1E40AF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="font-display text-xl font-700 text-slate-900 tracking-tight">AI Doctor</h1>
            <p className="text-sm text-slate-400 mt-0.5">Preparing your workspace</p>
          </div>

          <div className="w-40 h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-[#1E40AF] rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
