"use client";

import React from 'react';
import { useWallet } from '../lib/wallet-context';
import { shortenAddress } from '../lib/utils';

export const WalletConnect: React.FC = () => {
  const { isConnected, walletAddress, connect, disconnect, error } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {error && (
        <span className="text-red-500 text-sm mr-2">
          {error}
        </span>
      )}
      
      {isConnected ? (
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm mr-2">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-400"></span>
            {shortenAddress(walletAddress)}
          </span>
          <button 
            onClick={disconnect}
            className="text-sm text-gray-400 hover:text-gray-300 underline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            strokeWidth="1.5"
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
}; 