import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
              <svg 
                className="w-7 h-7 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                {/* Bar chart bars */}
                <rect x="4" y="16" width="2.5" height="6" rx="0.5" />
                <rect x="7.5" y="12" width="2.5" height="10" rx="0.5" />
                <rect x="11" y="8" width="2.5" height="14" rx="0.5" />
                <rect x="14.5" y="14" width="2.5" height="8" rx="0.5" />
                <rect x="18" y="10" width="2.5" height="12" rx="0.5" />
                
                {/* AI sparkle on top of highest bar */}
                <g fill="currentColor" stroke="none">
                  <circle cx="12.25" cy="6" r="0.5" />
                  <path d="M12.25 4.5l0.3 0.9h0.9l-0.7 0.5 0.3 0.9-0.8-0.6-0.8 0.6 0.3-0.9-0.7-0.5h0.9z" />
                </g>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Blockwise AI
            </h1>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
