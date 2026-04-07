import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  TrendingUp,
  Users,
  Award,
  Globe,
  Heart,
  Zap,
  Target
} from 'lucide-react';

const CareersPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://us-central1-xsavlab.cloudfunctions.net/getJobs');
        
        if (!response.ok) throw new Error('Failed to fetch jobs');

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment;
    const matchesLocation = filterLocation === 'all' || job.location.includes(filterLocation);
    const matchesType = filterType === 'all' || job.jobType === filterType;

    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  // Get unique values for filters
  const departments = [...new Set(jobs.map(job => job.department))];
  const locations = [...new Set(jobs.map(job => job.location))];
  const jobTypes = [...new Set(jobs.map(job => job.jobType))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Join Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Be part of a team that's revolutionizing cybersecurity and cloud infrastructure. 
              Shape the future of digital security with cutting-edge technology.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="all">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Loading opportunities...</p>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center"
            >
              <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">No Open Positions Yet</h3>
              <p className="text-gray-400 mb-6">
                We don't have any open positions matching your criteria right now, but we're always growing!
              </p>
              <p className="text-gray-400">
                Check back soon or send us your resume at{' '}
                <a href="mailto:careers@xsavlab.com" className="text-primary hover:underline">
                  careers@xsavlab.com
                </a>
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-400">
                  Showing <span className="text-white font-semibold">{filteredJobs.length}</span>{' '}
                  {filteredJobs.length === 1 ? 'position' : 'positions'}
                </p>
              </div>

              <div className="grid gap-6">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-primary/50 hover:bg-gray-800/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                              {job.title}
                            </h3>
                            {job.featured && (
                              <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30 mb-2">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {job.jobType}
                          </span>
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {job.experienceLevel}
                          </span>
                          {job.salaryRange && job.salaryRange !== 'Competitive' && (
                            <span className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              {job.salaryRange}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                        {job.requirements && job.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 3).map((req, i) => (
                              <span
                                key={i}
                                className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full"
                              >
                                {req.length > 40 ? req.substring(0, 40) + '...' : req}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="text-gray-400 text-xs px-3 py-1">
                                +{job.requirements.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/careers/${job.id}`);
                          }}
                          className="flex-1 lg:flex-none bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                        >
                          Apply Now
                        </button>
                        {job.applicantCount > 0 && (
                          <div className="flex-1 lg:flex-none text-center text-gray-400 text-xs px-4 py-2 bg-gray-700/50 rounded-lg">
                            {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Join <span className="text-primary">XSAV Lab</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not just building software — we're building the future of secure digital infrastructure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Cutting-Edge Technology',
                description: 'Work with the latest technologies in cybersecurity, cloud, and AI'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Collaborative Culture',
                description: 'Join a team of passionate experts who support each other\'s growth'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Career Growth',
                description: 'Continuous learning opportunities and clear career progression paths'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Remote-First',
                description: 'Work from anywhere with flexible hours that fit your lifestyle'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Competitive Benefits',
                description: 'Comprehensive health coverage, equity options, and generous PTO'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Meaningful Impact',
                description: 'Protect businesses and contribute to a safer digital world'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. 
              Send us your resume and let's talk about future opportunities!
            </p>
            <a
              href="mailto:careers@xsavlab.com"
              className="inline-block bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Send Your Resume
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
