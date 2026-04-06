import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch and cache site settings
 * Returns statistics and other configurable site content
 */
const useSiteSettings = () => {
  const [settings, setSettings] = useState({
    statistics: {
      // About Section
      foundedYear: 2018,
      clientsServed: 500,
      industries: 25,
      clientSatisfaction: 99.9,
      
      // Services/Trust Sections
      successRate: 99.8,
      organizations: 500,
      
      // Hero Section
      threatDetection: 99.9,
      yearsExperience: 15,
      
      // How It Works Section
      deploymentWeeks: '2-4',
      projectSuccessRate: 98,
      supportCoverage: '24/7',
      successfulProjects: 500,
      
      // AI Demo Section
      cloudCostReduction: 40,
    },
    caseStudies: {
      finserve: {
        threatReduction: 92,
        fasterResponse: 65,
        complianceAchieved: 100,
      },
      retailmax: {
        costSavings: 42,
        uptimeSLA: 99.9,
        performanceBoost: 3,
      },
      healthtech: {
        queriesAutomated: 80,
        responseTimeCut: 50,
        patientSatisfaction: 4.8,
      },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getSiteSettings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }

      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err.message);
      // Keep using default values on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refetch: fetchSettings };
};

export default useSiteSettings;
