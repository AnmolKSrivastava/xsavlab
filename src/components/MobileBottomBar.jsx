import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

const MobileBottomBar = () => {
  const actions = [
    { icon: Phone, label: 'Call', color: 'from-green-500 to-green-600' },
    { icon: MessageCircle, label: 'Chat', color: 'from-primary to-secondary' },
    { icon: Calendar, label: 'Book', color: 'from-purple-500 to-purple-600' },
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
            className={`bg-gradient-to-r ${action.color} py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg`}
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
