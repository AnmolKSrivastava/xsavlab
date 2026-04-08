import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, BarChart3, TrendingUp, Globe } from 'lucide-react';

const SiteSettingsTab = ({ user, userRole }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [statistics, setStatistics] = useState({
    // About Section
    foundedYear: 2018,
    clientsServed: 500,
    industries: 25,
    clientSatisfaction: 99.9,
    // Services/Trust
    successRate: 99.8,
    organizations: 500,
    // Hero Section
    threatDetection: 99.9,
    yearsExperience: 15,
    // How It Works
    deploymentWeeks: '2-4',
    projectSuccessRate: 98,
    supportCoverage: '24/7',
    successfulProjects: 500,
    // AI Demo
    cloudCostReduction: 40,
  });

  const [caseStudies, setCaseStudies] = useState({
    finserve: { threatReduction: 92, fasterResponse: 65, complianceAchieved: 100 },
    retailmax: { costSavings: 42, uptimeSLA: 99.9, performanceBoost: 3 },
    healthtech: { queriesAutomated: 80, responseTimeCut: 50, patientSatisfaction: 4.8 },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getSiteSettings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }

      const data = await response.json();
      if (data.statistics) {
        setStatistics(data.statistics);
      }
      if (data.caseStudies) {
        setCaseStudies(data.caseStudies);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/updateSiteSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ statistics, caseStudies }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setStatistics(prev => ({
      ...prev,
      [field]: field === 'deploymentWeeks' || field === 'supportCoverage' ? value : (parseFloat(value) || 0),
    }));
  };

  const handleCaseStudyChange = (company, field, value) => {
    setCaseStudies(prev => ({
      ...prev,
      [company]: {
        ...prev[company],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Site Statistics</h3>
          <p className="text-gray-400">Manage numbers displayed across your website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Statistics Form */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Main Statistics (About Section)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Founded Year
            </label>
            <input
              type="number"
              value={statistics.foundedYear}
              onChange={(e) => handleChange('foundedYear', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="2018"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in About section</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Clients Served
            </label>
            <input
              type="number"
              value={statistics.clientsServed}
              onChange={(e) => handleChange('clientsServed', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.clientsServed}+"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industries
            </label>
            <input
              type="number"
              value={statistics.industries}
              onChange={(e) => handleChange('industries', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="25"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.industries}+"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Satisfaction (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.clientSatisfaction}
              onChange={(e) => handleChange('clientSatisfaction', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.9"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.clientSatisfaction}%"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Success Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.successRate}
              onChange={(e) => handleChange('successRate', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.8"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in Services section</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organizations
            </label>
            <input
              type="number"
              value={statistics.organizations}
              onChange={(e) => handleChange('organizations', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Trust section count, displays as "{statistics.organizations}+"</p>
          </div>
        </div>
      </div>

      {/* Hero Section Stats */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Hero Section Metrics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Threat Detection Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={statistics.threatDetection}
              onChange={(e) => handleChange('threatDetection', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="99.9"
            />
            <p className="text-xs text-gray-500 mt-1">Hero section: "Threat Detection"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              value={statistics.yearsExperience}
              onChange={(e) => handleChange('yearsExperience', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="15"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.yearsExperience}+ Years Experience"</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          How It Works Section - Key Metrics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Typical Deployment
            </label>
            <input
              type="text"
              value={statistics.deploymentWeeks}
              onChange={(e) => handleChange('deploymentWeeks', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="2-4"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., "2-4" (shows "2-4 Weeks")</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Success Rate (%)
            </label>
            <input
              type="number"
              value={statistics.projectSuccessRate}
              onChange={(e) => handleChange('projectSuccessRate', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="98"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.projectSuccessRate}%"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Support Coverage
            </label>
            <input
              type="text"
              value={statistics.supportCoverage}
              onChange={(e) => handleChange('supportCoverage', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="24/7"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., "24/7"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Successful Projects
            </label>
            <input
              type="number"
              value={statistics.successfulProjects}
              onChange={(e) => handleChange('successfulProjects', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">Displays as "{statistics.successfulProjects}+"</p>
          </div>
        </div>
      </div>

      {/* AI Demo Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          AI Demo Section
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cloud Cost Reduction (%)
            </label>
            <input
              type="number"
              value={statistics.cloudCostReduction}
              onChange={(e) => handleChange('cloudCostReduction', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="40"
            />
            <p className="text-xs text-gray-500 mt-1">Used in AI chatbot demo responses</p>
          </div>
        </div>
      </div>

      {/* Case Studies Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6">
          Case Studies - Results Metrics
        </h4>
        
        {/* FinServe Global */}
        <div className="mb-8">
          <h5 className="text-md font-semibold text-primary mb-4">FinServe Global (Financial Services)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Threat Reduction (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.threatReduction}
                onChange={(e) => handleCaseStudyChange('finserve', 'threatReduction', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Faster Response (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.fasterResponse}
                onChange={(e) => handleCaseStudyChange('finserve', 'fasterResponse', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Compliance Achieved (%)</label>
              <input
                type="number"
                value={caseStudies.finserve.complianceAchieved}
                onChange={(e) => handleCaseStudyChange('finserve', 'complianceAchieved', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* RetailMax Corp */}
        <div className="mb-8">
          <h5 className="text-md font-semibold text-primary mb-4">RetailMax Corp (E-Commerce)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cost Savings (%)</label>
              <input
                type="number"
                value={caseStudies.retailmax.costSavings}
                onChange={(e) => handleCaseStudyChange('retailmax', 'costSavings', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Uptime SLA (%)</label>
              <input
                type="number"
                step="0.1"
                value={caseStudies.retailmax.uptimeSLA}
                onChange={(e) => handleCaseStudyChange('retailmax', 'uptimeSLA', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Performance Boost (x)</label>
              <input
                type="number"
                value={caseStudies.retailmax.performanceBoost}
                onChange={(e) => handleCaseStudyChange('retailmax', 'performanceBoost', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* HealthTech Solutions */}
        <div>
          <h5 className="text-md font-semibold text-primary mb-4">HealthTech Solutions (Healthcare)</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Queries Automated (%)</label>
              <input
                type="number"
                value={caseStudies.healthtech.queriesAutomated}
                onChange={(e) => handleCaseStudyChange('healthtech', 'queriesAutomated', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Response Time Cut (%)</label>
              <input
                type="number"
                value={caseStudies.healthtech.responseTimeCut}
                onChange={(e) => handleCaseStudyChange('healthtech', 'responseTimeCut', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Patient Satisfaction (/5)</label>
              <input
                type="number"
                step="0.1"
                value={caseStudies.healthtech.patientSatisfaction}
                onChange={(e) => handleCaseStudyChange('healthtech', 'patientSatisfaction', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> After saving, changes will be visible immediately across your entire website: Hero, About, Services, Trust, How It Works, Case Studies, and AI Demo sections.
        </p>
      </div>
    </div>
  );
};

export default SiteSettingsTab;
