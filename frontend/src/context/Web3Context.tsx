import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import toast from 'react-hot-toast';
import BaseBountyABI from '../utils/BaseBountyABI.json';

const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_NAME = 'Base';
const BASE_RPC_URL = 'https://mainnet.base.org';

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  contract: Contract | null;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  switchToBase: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const checkNetwork = async (provider: BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      setIsCorrectNetwork(chainId === BASE_CHAIN_ID);
      return chainId === BASE_CHAIN_ID;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const switchToBase = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
      });
      toast.success('Switched to Base network');
    } catch (error: any) {
      // Chain not added, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                chainName: BASE_CHAIN_NAME,
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [BASE_RPC_URL],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          });
          toast.success('Base network added');
        } catch (addError) {
          console.error('Error adding Base network:', addError);
          toast.error('Failed to add Base network');
        }
      } else {
        console.error('Error switching network:', error);
        toast.error('Failed to switch network');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(browserProvider);

      // Check network
      const correctNetwork = await checkNetwork(browserProvider);
      if (!correctNetwork) {
        toast.error('Please switch to Base network');
        await switchToBase();
      }

      // Initialize contract
      if (contractAddress) {
        const contractInstance = new ethers.Contract(
          contractAddress,
          BaseBountyABI,
          signer
        );
        setContract(contractInstance);
      }

      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setProvider(null);
        setContract(null);
        toast.info('Wallet disconnected');
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          connectWallet();
        }
      } catch (error) {
        console.error('Error auto-connecting:', error);
      }
    };

    autoConnect();
  }, []);

  const value = {
    account,
    provider,
    contract,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    switchToBase,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
