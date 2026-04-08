function escapeHtml(text) {
  if (!text) {
    return '';
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return String(text).replace(/[&<>"'/]/g, (char) => map[char]);
}

function formatServiceName(service) {
  const serviceNames = {
    cybersecurity: 'Cybersecurity Services',
    cloud: 'Cloud Infrastructure',
    ai: 'AI Integration Services',
    website: 'Custom Website Development',
    software: 'Enterprise Software Solutions',
    consulting: 'General Consulting',
  };

  return serviceNames[service] || service;
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  escapeHtml,
  formatServiceName,
  createSlug,
};