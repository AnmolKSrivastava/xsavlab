/* 
 * HOW TO ADD TEAM PROFILE IMAGES
 * 
 * Step 1: Add your images to src/assets/images/team/
 * Example files:
 *   - amit-kumar.jpg
 *   - sarah-chen.jpg
 *   - michael-rodriguez.jpg
 * 
 * Step 2: Import images at the top of About.jsx:
 */

// Add these imports at the top of src/components/About.jsx
import amitKumarImg from '../assets/images/team/amit-kumar.jpg';
import sarahChenImg from '../assets/images/team/sarah-chen.jpg';
import michaelRodriguezImg from '../assets/images/team/michael-rodriguez.jpg';

/*
 * Step 3: Update the team array to use the imported images:
 */

const team = [
  {
    name: 'Amit Kumar',
    role: 'Founder and Chief Executive Officer',
    bio: 'With over 15 years in cybersecurity, Amit leads our security operations and ensures enterprise-grade protection for all clients.',
    image: amitKumarImg,  // ← Change from null to amitKumarImg
    linkedin: 'https://linkedin.com',
    email: 'amittiwary@xsavlab.com',
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Cloud Solutions',
    bio: 'Sarah specializes in cloud architecture and DevOps, helping organizations migrate and optimize their infrastructure.',
    image: sarahChenImg,  // ← Change from null to sarahChenImg
    linkedin: 'https://linkedin.com',
    email: 'sarah@xsavlab.com',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Lead Software Architect',
    bio: 'Michael brings 12+ years of software development expertise, crafting custom solutions that drive business growth.',
    image: michaelRodriguezImg,  // ← Change from null to michaelRodriguezImg
    linkedin: 'https://linkedin.com',
    email: 'michael@xsavlab.com',
  },
];

/*
 * IMPORTANT NOTES:
 * 
 * - Image format: JPG, PNG, or WebP
 * - Recommended size: 256x256px (square, will be displayed in 128x128px circle)
 * - Keep files under 500KB for optimal performance
 * - If image is null, a Shield icon will be shown as placeholder
 * 
 * ALTERNATIVE: Using public folder
 * If you prefer to use the public folder instead:
 * 
 * 1. Place images in public/images/team/
 * 2. Reference them like this:
 *    image: '/images/team/amit-kumar.jpg'
 * 
 * The src/assets approach is recommended for better webpack optimization.
 */
