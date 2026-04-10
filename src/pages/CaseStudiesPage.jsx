import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Cloud, ArrowRight, Award, Filter } from 'lucide-react';
import CountUpNumber from '../components/ui/CountUpNumber';

const CaseStudyCard = ({ company, industry, challenge, solution, results, icon: Icon, index, testimonial, clientName, clientRole, clientCompany }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary/50 rounded-xl p-8 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {company}
          </h3>
          <span className="text-sm text-primary font-medium">{industry}</span>
        </div>
        <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Challenge */}
      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Challenge</div>
        <p className="text-gray-300 text-sm leading-relaxed">{challenge}</p>
      </div>

      {/* Solution */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Solution</div>
        <p className="text-gray-300 text-sm leading-relaxed">{solution}</p>
      </div>

      {/* Results */}
      {results && results.length > 0 && (
        <div className="border-t border-gray-700 pt-6">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Results</div>
          <div className="grid grid-cols-3 gap-4">
            {results.map((result, idx) => (
              <div key={idx} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-3xl font-bold text-primary mb-1"
                >
                  {result.value && (
                    <CountUpNumber
                      end={parseFloat(result.value) || 0}
                      decimals={result.value.includes('.') ? 1 : 0}
                      suffix={result.suffix || ''}
                      prefix={result.prefix || ''}
                    />
                  )}
                </motion.div>
                <div className="text-xs text-gray-400">{result.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Testimonial */}
      {testimonial && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-sm text-gray-300 italic mb-3">"{testimonial}"</p>
            {(clientName || clientRole) && (
              <p className="text-xs text-gray-400">
                — {clientName}
                {clientRole && <span className="text-gray-500">, {clientRole}</span>}
                {clientCompany && <span className="text-gray-500"> at {clientCompany}</span>}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const CaseStudiesPage = () => {
  const navigate = useNavigate();
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getSuccessStories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch success stories');
      }

      const data = await response.json();
      setSuccessStories(data.stories || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setSuccessStories([]);
    } finally {
      setLoading(false);
    }
  };

  // Map industry to icon
  const getIconForIndustry = (industry) => {
    const lowerIndustry = (industry || '').toLowerCase();
    if (lowerIndustry.includes('finance') || lowerIndustry.includes('banking')) {
      return Shield;
    } else if (lowerIndustry.includes('retail') || lowerIndustry.includes('commerce')) {
      return Cloud;
    } else if (lowerIndustry.includes('health')) {
      return TrendingUp;
    } else {
      return Award;
    }
  };

  // Transform success stories to case format
  const cases = successStories.map((story) => ({
    company: story.company,
    industry: story.industry,
    challenge: story.challenge,
    solution: story.solution,
    results: story.results || [],
    testimonial: story.testimonial,
    clientName: story.clientName,
    clientRole: story.clientRole,
    clientCompany: story.clientCompany,
    icon: getIconForIndustry(story.industry),
  }));

  // Get unique industries for filter
  const industries = ['all', ...new Set(successStories.map(story => story.industry))];

  // Filter cases by industry
  const filteredCases = selectedIndustry === 'all' 
    ? cases 
    : cases.filter(c => c.industry === selectedIndustry);

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-4"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Success Stories</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real Results For
              <span className="text-primary"> Real Businesses</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how we've helped organizations across industries solve complex security and infrastructure challenges. Each case study showcases our commitment to delivering measurable, impactful results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      {industries.length > 1 && (
        <section className="py-8 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2 text-gray-400">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by Industry:</span>
              </div>
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedIndustry === industry
                      ? 'bg-primary text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Case Studies Grid */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading success stories...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {selectedIndustry === 'all' 
                  ? 'No success stories available yet' 
                  : `No success stories found for ${selectedIndustry}`}
              </p>
              <p className="text-sm text-gray-500">
                {selectedIndustry === 'all' 
                  ? 'Check back soon for client success stories' 
                  : 'Try selecting a different industry'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredCases.map((caseStudy, index) => (
                  <CaseStudyCard key={caseStudy.company} {...caseStudy} index={index} />
                ))}
              </div>

              {/* Results Count */}
              <div className="text-center mt-12 text-gray-500 text-sm">
                Showing {filteredCases.length} {filteredCases.length === 1 ? 'case study' : 'case studies'}
                {selectedIndustry !== 'all' && ` for ${selectedIndustry}`}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to transform your organization?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who've enhanced their security posture and optimized their infrastructure with XSAV Lab.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contact')}
              className="bg-primary hover:bg-primary/90 text-dark-navy px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all inline-flex items-center space-x-2"
            >
              <span>Start Your Success Story</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;

