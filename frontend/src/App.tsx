import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import sdk from '@farcaster/miniapp-sdk';
import { useWeb3 } from './context/Web3Context';
import Header from './components/Header';
import BountyList from './components/BountyList';
import CreateBountyForm from './components/CreateBountyForm';
import UserProfile from './components/UserProfile';
import BountyDetail from './components/BountyDetail';

type View = 'list' | 'create' | 'profile' | 'detail';

function App() {
  const { account, connectWallet } = useWeb3();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedBountyId, setSelectedBountyId] = useState<bigint | null>(null);

  // Initialize Farcaster Mini App SDK
  useEffect(() => {
    // Notify the Mini App that we're ready to display
    // This hides the splash screen and shows the app
    sdk.actions.ready();
  }, []);

  const handleViewBounty = (bountyId: bigint) => {
    setSelectedBountyId(bountyId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBountyId(null);
  };

  const renderView = () => {
    if (!account) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="card max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary-400">BaseBounty</h1>
              <p className="text-gray-400">
                Decentralized marketplace for micro-tasks on Base L2
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Connect your wallet to start posting tasks or earning as a worker
              </p>
              <button onClick={connectWallet} className="btn-primary w-full">
                Connect Wallet
              </button>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Make sure you're on Base network to use this app
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'create':
        return (
          <CreateBountyForm
            onSuccess={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'profile':
        return <UserProfile onBack={() => setCurrentView('list')} />;
      case 'detail':
        return selectedBountyId ? (
          <BountyDetail bountyId={selectedBountyId} onBack={handleBackToList} />
        ) : (
          <BountyList onViewBounty={handleViewBounty} />
        );
      case 'list':
      default:
        return <BountyList onViewBounty={handleViewBounty} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />

      {account && (
        <Header
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}

      <main className="container mx-auto px-4 py-8">{renderView()}</main>

      {account && (
        <footer className="border-t border-gray-800 mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>Built on Base L2 with Farcaster Mini Apps</p>
            <p className="mt-2">Secure, decentralized, and transparent</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
