
import React from 'react';
import { ReadmeConfig } from '../types';

interface ReadmeSettingsProps {
  config: ReadmeConfig;
  onConfigChange: (config: ReadmeConfig) => void;
}

export const ReadmeSettings: React.FC<ReadmeSettingsProps> = ({ config, onConfigChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onConfigChange({ ...config, [name]: finalValue });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Project Name</label>
          <input
            name="projectName"
            value={config.projectName}
            onChange={handleChange}
            placeholder="e.g. My Awesome Tool"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Repo URL (Optional)</label>
          <input
            name="repoUrl"
            value={config.repoUrl || ''}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Style</label>
            <select
              name="style"
              value={config.style}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="minimal">Minimal</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="playful">Playful ✨</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="includeBadges"
              checked={config.includeBadges}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Include Badges</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="includeLicense"
              checked={config.includeLicense}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Include License Section</span>
          </label>
        </div>
      </div>
    </div>
  );
};
