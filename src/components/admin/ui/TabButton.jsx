import React from 'react';

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
      active
        ? 'text-[#38BDF8] border-b-2 border-[#38BDF8] bg-[#38BDF8]/5'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default TabButton;
