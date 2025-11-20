import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Hexagon Background */}
        <motion.path
          d="M50 5 L93.3 25 V75 L50 95 L6.7 75 V25 L50 5Z"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Chart Line */}
        <motion.path
          d="M25 65 L40 50 L55 60 L75 35"
          className="stroke-white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Dot at end of chart */}
        <motion.circle
          cx="75"
          cy="35"
          r="4"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, delay: 2 }}
        />
      </svg>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />
    </div>
  );
};
