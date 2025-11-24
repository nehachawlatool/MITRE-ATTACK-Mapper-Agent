import React from 'react';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-cyber-900 border-b border-cyber-700 py-4 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center space-x-3">
        <div className="relative w-8 h-8 flex items-center justify-center bg-cyber-800 rounded border border-cyber-accent">
          <div className="absolute w-2 h-2 bg-cyber-accent rounded-full animate-pulse"></div>
          <svg className="w-5 h-5 text-cyber-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">
          MITRE<span className="text-cyber-accent">ATT&CK</span> MAPPER
        </h1>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <span className="hidden md:inline">Powered by Gemini 3.0 Pro</span>
        <div className="h-2 w-2 rounded-full bg-cyber-success shadow-[0_0_10px_#05f26c]"></div>
      </div>
    </header>
  );
};

export default Header;