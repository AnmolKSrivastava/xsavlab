import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'Security Services',
    'Cloud Solutions',
    'AI Agents',
    'Pricing',
  ];

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    setMessages([...messages, { role: 'user', text }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Thanks for your interest in ${text}! Let me connect you with a specialist. Would you like to book a consultation?`,
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-2xl z-50 glow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] glass rounded-2xl shadow-2xl overflow-hidden z-50 glow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">XSAV AI Assistant</div>
                  <div className="text-xs text-green-400 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary'
                        : 'bg-white/5'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <motion.button
                  key={reply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(reply)}
                  className="text-xs px-3 py-2 bg-white/5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {reply}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
