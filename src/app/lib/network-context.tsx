"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from './contract';
import toast from 'react-hot-toast';

interface NetworkContextType {
  isCorrectNetwork: boolean;
  currentChainId: string | null;
  switchToCorrectNetwork: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

type NetworkProviderProps = {
  children: ReactNode;
};

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const chainId = network.chainId.toString();
          setCurrentChainId(chainId);
          setIsCorrectNetwork(chainId === NETWORK_CONFIG.chainId);
        } catch (error) {
          console.error('Error checking network:', error);
        }
      }
    };

    checkNetwork();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        setCurrentChainId(chainId);
        setIsCorrectNetwork(chainId === NETWORK_CONFIG.chainId);
        
        if (chainId !== NETWORK_CONFIG.chainId) {
          toast.error('Please switch to Polygon Mumbai network');
        } else {
          toast.success('Connected to Polygon Mumbai network');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const switchToCorrectNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet found');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
      toast.success('Network switched successfully');
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
          toast.success('Polygon Mumbai network added');
          return true;
        } catch (addError) {
          toast.error('Failed to add Polygon Mumbai network');
          return false;
        }
      }
      toast.error('Failed to switch network');
      return false;
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        isCorrectNetwork,
        currentChainId,
        switchToCorrectNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}; 