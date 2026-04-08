import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const SettingsTab = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-300">Two-Factor Authentication</span>
          </div>
          <span className="text-sm text-gray-500">Recommended</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-gray-300">Session Timeout</span>
          </div>
          <span className="text-sm text-gray-500">30 minutes</span>
        </div>
      </div>
    </div>
    
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <p className="text-blue-400 text-sm">
        <strong>Firebase Project:</strong> Configure additional security settings in your Firebase Console.
      </p>
    </div>
  </div>
);

export default SettingsTab;
