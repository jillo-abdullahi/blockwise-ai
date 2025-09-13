import React from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
              <Logo className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Blockwise AI
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
