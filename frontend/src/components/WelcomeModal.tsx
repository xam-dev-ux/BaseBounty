import React, { useState, useEffect } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to BaseBounty! 🎯
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your decentralized marketplace for micro-tasks on Base L2
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* How it works */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How It Works
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                BaseBounty connects task creators with skilled workers using secure blockchain payments.
                Build your onchain reputation, complete tasks, and earn ETH on Base L2.
              </p>
            </section>

            {/* For Task Creators */}
            <section className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Post a Task
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">1.</span>
                  <span>Click "Create Bounty" and describe your task</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">2.</span>
                  <span>Set the payment amount (min 0.000001 ETH + 2% platform fee)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">3.</span>
                  <span>Review applications and select a worker</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">4.</span>
                  <span>Accept completed work to release payment automatically</span>
                </li>
              </ol>
            </section>

            {/* For Workers */}
            <section className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Earn as a Worker
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-green-600">1.</span>
                  <span>Browse available bounties and find tasks you can complete</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-green-600">2.</span>
                  <span>Apply with a brief message about your qualifications</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-green-600">3.</span>
                  <span>Complete the work and submit proof (links, files, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-green-600">4.</span>
                  <span>Receive ETH payment automatically when approved</span>
                </li>
              </ol>
            </section>

            {/* Key Features */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Features
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Secure Payments</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Funds held in smart contract</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Build Reputation</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Onchain ratings & history</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Dispute Resolution</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Community voting system</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useWelcomeModal = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return { showWelcome, closeWelcome };
};

export default WelcomeModal;
