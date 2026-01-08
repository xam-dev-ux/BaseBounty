import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { account, isCorrectNetwork, switchToBase } = useWeb3();
  const { isDarkMode, toggleTheme } = useTheme();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1
              className="text-2xl font-bold text-primary-400 cursor-pointer"
              onClick={() => onNavigate('list')}
            >
              BaseBounty
            </h1>
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => onNavigate('list')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'list' || currentView === 'detail'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Bounties
              </button>
              <button
                onClick={() => onNavigate('create')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'create'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Create Bounty
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'profile'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {!isCorrectNetwork && (
              <button
                onClick={switchToBase}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
              >
                Switch to Base
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-300">
                {account ? formatAddress(account) : 'Not connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex space-x-2 mt-4">
          <button
            onClick={() => onNavigate('list')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentView === 'list' || currentView === 'detail'
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 bg-gray-700'
            }`}
          >
            Bounties
          </button>
          <button
            onClick={() => onNavigate('create')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentView === 'create'
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 bg-gray-700'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentView === 'profile'
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 bg-gray-700'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
