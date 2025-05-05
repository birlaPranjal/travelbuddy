"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  provider: ethers.BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

type WalletProviderProps = {
  children: ReactNode;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          
          if (accounts.length > 0) {
            const address = accounts[0].address;
            setWalletAddress(address);
            setIsConnected(true);
            setProvider(browserProvider);
          }
        } catch (err) {
          console.error("Failed to check existing connection:", err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountArray = Array.isArray(accounts) ? accounts : [];
        
        if (accountArray.length === 0) {
          // User disconnected
          setIsConnected(false);
          setWalletAddress(null);
          setProvider(null);
        } else {
          // Account changed
          setWalletAddress(accountArray[0] as string);
          setIsConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          try {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          } catch (error) {
            console.error('Error removing event listener:', error);
          }
        }
      };
    }
  }, []);

  const connect = async () => {
    setError(null);
    
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('No Ethereum wallet found. Please install MetaMask.');
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request accounts safely
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (requestError) {
        console.error("User rejected the request:", requestError);
        setError('Connection rejected. Please approve the connection request.');
        return;
      }
      
      const accounts = await browserProvider.listAccounts();
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0].address);
        setIsConnected(true);
        setProvider(browserProvider);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setProvider(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        provider,
        connect,
        disconnect,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (eventName: string, handler: (args: unknown) => void) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (eventName: string, handler: (args: unknown) => void) => void;
      isMetaMask?: boolean;
      isConnected?: () => boolean;
      chainId?: string;
      selectedAddress?: string;
    };
  }
} 