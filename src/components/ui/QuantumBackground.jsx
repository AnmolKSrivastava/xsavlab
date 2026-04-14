import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const QuantumBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const isLowPowerMode = prefersReducedMotion || isMobile;

  // Generate particle positions once to prevent expensive random recalculation on re-renders
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2, // 2-8px
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 10 + 15, // 15-25s
  })), []);

  if (isLowPowerMode) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-navy via-dark to-dark-navy opacity-95" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.12) 0%, transparent 55%), radial-gradient(circle at 78% 22%, rgba(118, 75, 162, 0.12) 0%, transparent 48%)',
          }}
        />
        <div className="absolute inset-0 opacity-4">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="quantum-grid-static" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="1" fill="rgba(102, 126, 234, 0.55)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#quantum-grid-static)" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-navy via-dark to-dark-navy opacity-95" />
      
      {/* Quantum wave overlay - subtle gradient shift */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary wave - creates interference pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Grid pattern - quantum circuit inspired */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quantum-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="rgba(102, 126, 234, 0.6)" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(102, 126, 234, 0.1)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(102, 126, 234, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quantum-grid)" />
        </svg>
      </div>

      {/* Floating quantum particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(192, 192, 192, 0.4) 100%)`,
              boxShadow: '0 0 12px rgba(102, 126, 234, 0.45)',
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Larger floating orbs - fewer, more prominent */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          right: '15%',
          bottom: '15%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, -25, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-10"
        style={{
          left: '60%',
          top: '40%',
          background: 'radial-gradient(circle, rgba(192, 192, 192, 0.3) 0%, transparent 70%)',
          filter: 'blur(42px)',
        }}
        animate={{
          y: [0, 35, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
    </div>
  );
};

export default QuantumBackground;
