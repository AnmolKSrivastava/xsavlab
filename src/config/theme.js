// Theme Configuration - Edit this file to change the entire site theme

export const themes = {
  // Current Theme: Corporate Balanced
  current: {
    name: 'Corporate Balanced',
    
    // Color Palette
    colors: {
      primary: '#00D4FF',        // Cyan - Main brand color
      secondary: '#7B61FF',      // Purple - Secondary accent
      dark: '#0B0F19',           // Dark background
      darkNavy: '#0A1628',       // Dark navy background
      
      // Extended palette
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      
      // Gradients (as CSS)
      gradientPrimary: 'linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(11, 15, 25, 0.8) 0%, rgba(10, 22, 40, 0.8) 100%)',
    },
    
    // Typography
    typography: {
      fontFamily: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
      fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    
    // Spacing & Layout
    spacing: {
      section: '6rem',      // py-24
      container: '7xl',     // max-w-7xl
      cardPadding: '2rem',  // p-8
      gap: '2rem',          // gap-8
    },
    
    // Effects & Animations
    effects: {
      borderRadius: {
        sm: '0.5rem',   // 8px
        md: '0.75rem',  // 12px
        lg: '1rem',     // 16px
        xl: '1.5rem',   // 24px
      },
      shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        primary: '0 20px 25px -5px rgba(0, 212, 255, 0.25)',
        secondary: '0 20px 25px -5px rgba(123, 97, 255, 0.25)',
      },
      blur: {
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
      },
      transition: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
      animations: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
    
    // Component Specific
    components: {
      navbar: {
        height: '5rem',           // h-20
        background: 'rgba(10, 22, 40, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.2)',
      },
      card: {
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.4) 100%)',
        borderColor: 'rgba(55, 65, 81, 0.5)',
        hoverBorderColor: 'rgba(0, 212, 255, 0.5)',
      },
      button: {
        primary: {
          background: '#00D4FF',
          hover: 'rgba(0, 212, 255, 0.9)',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          border: '#6B7280',
          hoverBorder: '#00D4FF',
          text: '#FFFFFF',
        },
      },
      mobileBottomBar: {
        callButton: {
          gradientFrom: '#10B981',
          gradientTo: '#059669',
        },
        chatButton: {
          useTheme: true, // Uses primary-to-secondary gradient
        },
        bookButton: {
          gradientFrom: '#A855F7',
          gradientTo: '#9333EA',
        },
      },
    },
  },
  
  // Alternative Theme: Neural Network (Uncomment to use)
  neuralNetwork: {
    name: 'Neural Network',
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      dark: '#0F0F23',
      darkNavy: '#1A1A2E',
      success: '#00FF88',
      warning: '#FFB800',
      danger: '#FF006E',
      info: '#00B4D8',
      gradientPrimary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
    },
    typography: {
      fontFamily: {
        heading: "'Space Grotesk', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
      fontSize: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        '5xl': '3rem', '6xl': '3.75rem',
      },
      fontWeight: {
        normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800',
      },
    },
    spacing: {
      section: '6rem',
      container: '7xl',
      cardPadding: '2rem',
      gap: '2rem',
    },
    effects: {
      borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
      shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        primary: '0 20px 25px -5px rgba(102, 126, 234, 0.3)',
        secondary: '0 20px 25px -5px rgba(118, 75, 162, 0.3)',
      },
      blur: { sm: '4px', md: '12px', lg: '24px', xl: '40px' },
      transition: { fast: '150ms', base: '300ms', slow: '500ms' },
    },
    components: {
      navbar: {
        height: '5rem',
        background: 'rgba(26, 26, 46, 0.95)',
        borderColor: 'rgba(102, 126, 234, 0.3)',
      },
      card: {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        hoverBorderColor: 'rgba(102, 126, 234, 0.5)',
      },
      button: {
        primary: {
          background: '#667EEA',
          hover: 'rgba(102, 126, 234, 0.9)',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          border: '#764BA2',
          hoverBorder: '#667EEA',
          text: '#FFFFFF',
        },
      },
      mobileBottomBar: {
        callButton: {
          gradientFrom: '#667EEA',
          gradientTo: '#764BA2',
        },
        chatButton: {
          useTheme: true, // Uses primary-to-secondary gradient
        },
        bookButton: {
          gradientFrom: '#8E54E9',
          gradientTo: '#4776E6',
        },
      },
    },
  },
  
  // Cyberpunk Theme
  cyberpunk: {
    name: 'Cyberpunk Tech',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF006E',
      dark: '#0A0E27',
      darkNavy: '#050A1E',
      success: '#00FF88',
      warning: '#FFD60A',
      danger: '#FF3D00',
      info: '#00E5FF',
      gradientPrimary: 'linear-gradient(135deg, #00FFFF 0%, #FF006E 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 10, 30, 0.95) 100%)',
    },
    typography: {
      fontFamily: {
        heading: "'Orbitron', sans-serif",
        body: "'Exo 2', sans-serif",
        mono: "'Share Tech Mono', monospace",
      },
      fontSize: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        '5xl': '3rem', '6xl': '3.75rem',
      },
      fontWeight: {
        normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '900',
      },
    },
    spacing: {
      section: '7rem',
      container: '7xl',
      cardPadding: '2rem',
      gap: '2.5rem',
    },
    effects: {
      borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
      shadow: {
        sm: '0 0 10px rgba(0, 255, 255, 0.2)',
        md: '0 0 20px rgba(0, 255, 255, 0.3)',
        lg: '0 0 30px rgba(0, 255, 255, 0.4)',
        xl: '0 0 40px rgba(0, 255, 255, 0.5)',
        primary: '0 0 30px rgba(0, 255, 255, 0.6)',
        secondary: '0 0 30px rgba(255, 0, 110, 0.6)',
      },
      blur: { sm: '2px', md: '8px', lg: '16px', xl: '32px' },
      transition: { fast: '100ms', base: '200ms', slow: '400ms' },
    },
    components: {
      navbar: {
        height: '5rem',
        background: 'rgba(5, 10, 30, 0.98)',
        borderColor: 'rgba(0, 255, 255, 0.5)',
      },
      card: {
        background: 'rgba(10, 14, 39, 0.6)',
        borderColor: 'rgba(0, 255, 255, 0.3)',
        hoverBorderColor: 'rgba(255, 0, 110, 0.8)',
      },
      button: {
        primary: {
          background: '#00FFFF',
          hover: '#00E5E5',
          text: '#000000',
        },
        secondary: {
          background: 'transparent',
          border: '#FF006E',
          hoverBorder: '#00FFFF',
          text: '#FFFFFF',
        },
      },
      mobileBottomBar: {
        callButton: {
          gradientFrom: '#00FF88',
          gradientTo: '#00FFFF',
        },
        chatButton: {
          useTheme: true, // Uses primary-to-secondary gradient
        },
        bookButton: {
          gradientFrom: '#FF006E',
          gradientTo: '#FFD60A',
        },
      },
    },
  },

  // Deep Space Theme
  deepSpace: {
    name: 'Deep Space',
    colors: {
      primary: '#8B5CF6',        // Vibrant violet
      secondary: '#6366F1',      // Indigo
      dark: '#0C0A1D',           // Deep space black
      darkNavy: '#050314',       // Deeper space
      success: '#A78BFA',        // Light purple (nebula)
      warning: '#FCD34D',        // Cosmic yellow
      danger: '#F87171',         // Supernova red
      info: '#60A5FA',           // Stellar blue
      gradientPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(12, 10, 29, 0.95) 0%, rgba(5, 3, 20, 0.98) 100%)',
    },
    typography: {
      fontFamily: {
        heading: "'Rajdhani', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'IBM Plex Mono', monospace",
      },
      fontSize: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        '5xl': '3rem', '6xl': '3.75rem',
      },
      fontWeight: {
        normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800',
      },
    },
    spacing: {
      section: '6.5rem',
      container: '7xl',
      cardPadding: '2rem',
      gap: '2rem',
    },
    effects: {
      borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.25rem', xl: '1.75rem' },
      shadow: {
        sm: '0 0 15px rgba(139, 92, 246, 0.15)',
        md: '0 0 25px rgba(139, 92, 246, 0.25)',
        lg: '0 0 40px rgba(139, 92, 246, 0.35)',
        xl: '0 0 60px rgba(139, 92, 246, 0.45)',
        primary: '0 0 40px rgba(139, 92, 246, 0.5)',
        secondary: '0 0 40px rgba(99, 102, 241, 0.5)',
      },
      blur: { sm: '6px', md: '14px', lg: '28px', xl: '45px' },
      transition: { fast: '200ms', base: '350ms', slow: '600ms' },
      animations: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
    components: {
      navbar: {
        height: '5rem',
        background: 'rgba(5, 3, 20, 0.97)',
        borderColor: 'rgba(139, 92, 246, 0.25)',
      },
      card: {
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.25)',
        hoverBorderColor: 'rgba(139, 92, 246, 0.6)',
      },
      button: {
        primary: {
          background: '#8B5CF6',
          hover: 'rgba(139, 92, 246, 0.9)',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          border: '#6366F1',
          hoverBorder: '#8B5CF6',
          text: '#FFFFFF',
        },
      },
      mobileBottomBar: {
        callButton: {
          gradientFrom: '#A78BFA',
          gradientTo: '#8B5CF6',
        },
        chatButton: {
          useTheme: true, // Uses primary-to-secondary gradient
        },
        bookButton: {
          gradientFrom: '#6366F1',
          gradientTo: '#4F46E5',
        },
      },
    },
  },

  // Quantum Computing Theme
  quantumComputing: {
    name: 'Quantum Computing',
    colors: {
      primary: '#667EEA',        // Quantum blue
      secondary: '#764BA2',      // Violet
      dark: '#0A0A15',           // Quantum void
      darkNavy: '#050510',       // Deep quantum space
      success: '#00FFB3',        // Quantum success state
      warning: '#FFD700',        // Quantum entanglement
      danger: '#FF4E8D',         // Quantum error
      info: '#4FC3F7',           // Quantum information
      accent: '#C0C0C0',         // Silver accent
      gradientPrimary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #C0C0C0 100%)',
      gradientDark: 'linear-gradient(135deg, rgba(10, 10, 21, 0.95) 0%, rgba(5, 5, 16, 0.98) 100%)',
      gradientIridescent: 'linear-gradient(45deg, #667EEA 0%, #764BA2 25%, #C0C0C0 50%, #667EEA 75%, #764BA2 100%)',
    },
    typography: {
      fontFamily: {
        heading: "'Poppins', sans-serif",
        body: "'Poppins', sans-serif",
        mono: "'Roboto Mono', monospace",
      },
      fontSize: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        '5xl': '3rem', '6xl': '3.75rem',
      },
      fontWeight: {
        normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800',
      },
    },
    spacing: {
      section: '6rem',
      container: '7xl',
      cardPadding: '2rem',
      gap: '2rem',
    },
    effects: {
      borderRadius: { sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
      shadow: {
        sm: '0 0 20px rgba(102, 126, 234, 0.2)',
        md: '0 0 30px rgba(102, 126, 234, 0.3)',
        lg: '0 0 50px rgba(102, 126, 234, 0.4)',
        xl: '0 0 70px rgba(102, 126, 234, 0.5)',
        primary: '0 0 40px rgba(102, 126, 234, 0.6), 0 0 80px rgba(102, 126, 234, 0.3)',
        secondary: '0 0 40px rgba(118, 75, 162, 0.6), 0 0 80px rgba(118, 75, 162, 0.3)',
        quantum: '0 0 60px rgba(192, 192, 192, 0.5), 0 0 100px rgba(102, 126, 234, 0.3)',
      },
      blur: { sm: '8px', md: '16px', lg: '32px', xl: '50px' },
      transition: { fast: '180ms', base: '320ms', slow: '550ms' },
      animations: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        quantumPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '1',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '0.8',
            filter: 'hue-rotate(20deg)'
          },
        },
        waveInterference: {
          '0%': { transform: 'translateX(0) scaleX(1)' },
          '25%': { transform: 'translateX(5px) scaleX(0.98)' },
          '50%': { transform: 'translateX(0) scaleX(1.02)' },
          '75%': { transform: 'translateX(-5px) scaleX(0.98)' },
          '100%': { transform: 'translateX(0) scaleX(1)' },
        },
        particleFloat: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: '0.6'
          },
          '33%': { 
            transform: 'translate(10px, -10px) rotate(120deg)',
            opacity: '1'
          },
          '66%': { 
            transform: 'translate(-10px, 5px) rotate(240deg)',
            opacity: '0.8'
          },
        },
      },
    },
    components: {
      navbar: {
        height: '5rem',
        background: 'rgba(5, 5, 16, 0.96)',
        borderColor: 'rgba(102, 126, 234, 0.3)',
      },
      card: {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 50%, rgba(192, 192, 192, 0.08) 100%)',
        borderColor: 'rgba(102, 126, 234, 0.3)',
        hoverBorderColor: 'rgba(192, 192, 192, 0.6)',
      },
      button: {
        primary: {
          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          hover: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
          text: '#FFFFFF',
        },
        secondary: {
          background: 'transparent',
          border: '#C0C0C0',
          hoverBorder: '#667EEA',
          text: '#FFFFFF',
        },
      },
      mobileBottomBar: {
        callButton: {
          gradientFrom: '#667EEA',
          gradientTo: '#4FC3F7',
        },
        chatButton: {
          useTheme: true, // Uses primary-to-secondary gradient
        },
        bookButton: {
          gradientFrom: '#764BA2',
          gradientTo: '#C0C0C0',
        },
      },
    },
  },
};

// Export the active theme
export const theme = themes.quantumComputing;

// Helper function to get theme value
export const getTheme = () => theme;

// Helper to switch themes (for future use)
export const setActiveTheme = (themeName) => {
  if (themes[themeName]) {
    return themes[themeName];
  }
  return themes.current;
};
