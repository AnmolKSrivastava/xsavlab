import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import useSiteSettings from '../hooks/useSiteSettings';

const AIDemo = () => {
  const { settings } = useSiteSettings();
  const stats = settings.statistics;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m XSAV AI Assistant. I can help you with cybersecurity assessments, cloud solutions, and AI agent development. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    security: 'Great question! Our cybersecurity services include VAPT, 24/7 SOC monitoring, and AI-powered threat detection. We\'ve helped over 500 enterprises secure their infrastructure. Would you like to schedule a free security audit?',
    cloud: `Our cloud solutions cover AWS, Azure, and GCP. We specialize in cloud migration, DevOps automation, and cost optimization. On average, our clients reduce cloud costs by ${stats.cloudCostReduction}% while improving performance. Interested in a cloud assessment?`,
    ai: 'We build custom AI agents for process automation, customer service, and data analysis. Our AI agents integrate seamlessly with your existing systems and can be deployed in weeks, not months. Want to see a demo?',
    pricing: 'Our pricing is tailored to your specific needs. We offer flexible packages starting from enterprise plans. Should I connect you with our sales team for a custom quote?',
    demo: 'Absolutely! I can schedule a personalized demo with our solutions architect. They\'ll walk you through live examples and answer all your technical questions. What day works best for you?',
    default: 'That\'s a great question! Our team specializes in that area. I\'d be happy to connect you with one of our experts who can provide detailed information. Would you like to schedule a consultation?',
  };

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    if (message.includes('security') || message.includes('cybersecurity') || message.includes('vapt') || message.includes('soc')) {
      return predefinedResponses.security;
    } else if (message.includes('cloud') || message.includes('aws') || message.includes('azure') || message.includes('devops')) {
      return predefinedResponses.cloud;
    } else if (message.includes('ai') || message.includes('agent') || message.includes('automation') || message.includes('bot')) {
      return predefinedResponses.ai;
    } else if (message.includes('price') || message.includes('pricing') || message.includes('cost')) {
      return predefinedResponses.pricing;
    } else if (message.includes('demo') || message.includes('show') || message.includes('example')) {
      return predefinedResponses.demo;
    } else {
      return predefinedResponses.default;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getResponse(input);
      const aiMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    'Tell me about your security services',
    'How can AI agents help my business?',
    'What cloud platforms do you support?',
    'Schedule a demo',
  ];

  return (
    <section id="ai-demo" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold">Live AI Demo</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Interact with Our AI
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the power of our AI assistant. Ask questions about our services,
            get instant insights, or schedule a consultation.
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass rounded-2xl overflow-hidden glow"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">XSAV AI Assistant</div>
                <div className="text-xs text-green-400 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-primary' : 'bg-secondary/20'}`}>
                      {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-r from-primary to-secondary' : 'glass'}`}>
                      <p className="text-sm md:text-base">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-2"
              >
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="glass p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 pb-4">
            <div className="text-xs text-gray-400 mb-2">Quick questions:</div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-2 glass rounded-full hover:bg-primary/20 transition-colors"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-primary transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full glow"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIDemo;
