// API configuration
const API_CONFIG = {
  // Development: Local emulator
  development: 'http://localhost:5001/xsavlab/us-central1/sendEnquiry',
  
  // Production: Firebase Cloud Functions
  production: process.env.REACT_APP_ENQUIRY_ENDPOINT || 'https://us-central1-xsavlab.cloudfunctions.net/sendEnquiry',
};

export const getEnquiryEndpoint = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? API_CONFIG.development : API_CONFIG.production;
};

/**
 * Submit enquiry to backend
 * @param {Object} enquiryData - Form data with name, email, company, service, message
 * @returns {Promise<Object>} - Response from Cloud Function
 */
export const submitEnquiry = async (enquiryData) => {
  try {
    const endpoint = getEnquiryEndpoint();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit enquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
};
