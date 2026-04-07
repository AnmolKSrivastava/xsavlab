import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { theme } from '../../config/theme';

const MobileBottomBar = () => {
  const actions = [
    { 
      icon: Phone, 
      label: 'Call', 
      gradient: `linear-gradient(to right, ${theme.components.mobileBottomBar.callButton.gradientFrom}, ${theme.components.mobileBottomBar.callButton.gradientTo})` 
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      gradient: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` 
    },
    { 
      icon: Calendar, 
      label: 'Book', 
      gradient: `linear-gradient(to right, ${theme.components.mobileBottomBar.bookButton.gradientFrom}, ${theme.components.mobileBottomBar.bookButton.gradientTo})` 
    },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-40"
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: action.gradient }}
            className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg text-white"
          >
            <action.icon className="w-4 h-4" />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileBottomBar;
