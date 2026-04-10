import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
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
};

let cachedSettings = null;
let inFlightSettingsRequest = null;

const SETTINGS_ENDPOINT = 'https://us-central1-xsavlab.cloudfunctions.net/getSiteSettings';

/**
 * Custom hook to fetch and cache site settings
 * Returns statistics and other configurable site content
 */
const useSiteSettings = (options = {}) => {
  const { deferFetch = false } = options;

  const [settings, setSettings] = useState(cachedSettings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cachedSettings);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedSettings) {
      setLoading(false);
      return;
    }

    if (!deferFetch) {
      fetchSettings();
      return;
    }

    // Defer non-critical data fetches to reduce contention during first paint.
    const idleHandle =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => fetchSettings(), { timeout: 2000 })
        : window.setTimeout(() => fetchSettings(), 1200);

    return () => {
      if ('cancelIdleCallback' in window && typeof idleHandle === 'number') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, [deferFetch]);

  const fetchSettings = async (forceRefresh = false) => {
    if (cachedSettings && !forceRefresh) {
      setSettings(cachedSettings);
      setLoading(false);
      return cachedSettings;
    }

    if (inFlightSettingsRequest) {
      try {
        const sharedData = await inFlightSettingsRequest;
        setSettings(sharedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    inFlightSettingsRequest = (async () => {
      const response = await fetch(SETTINGS_ENDPOINT);

      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }

      const data = await response.json();
      cachedSettings = data;
      return data;
    })();

    try {
      const data = await inFlightSettingsRequest;
      setSettings(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err.message);
      // Keep using default values on error
    } finally {
      inFlightSettingsRequest = null;
      setLoading(false);
    }
  };

  const refetch = () => fetchSettings(true);

  return { settings, loading, error, refetch };
};

export default useSiteSettings;
