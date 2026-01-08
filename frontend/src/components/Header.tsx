import React from 'react';
import { useWeb3 } from '../context/Web3Context';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { account, isCorrectNetwork, switchToBase } = useWeb3();

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
