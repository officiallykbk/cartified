import React, { useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { WalletStatus, WalletInfo } from '../types';
import { ethers } from 'ethers';

interface Web3ProviderProps {
  children: React.ReactNode;
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [account, setAccount] = useState<string>('');
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');

  const connect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      setStatus('connecting');
      
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAccount(account);

      // Get network info
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      // Get balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      setStatus('connected');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatus('disconnected');
      throw error;
    }
  };

  const disconnect = () => {
    setAccount('');
    setChainId(null);
    setBalance('0');
    setStatus('disconnected');
  };

  const switchNetwork = async (newChainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  };

  const getWalletInfo = (): WalletInfo => {
    return {
      address: account,
      balance,
      network: chainId === 1 ? 'Ethereum' : chainId === 137 ? 'Polygon' : 'Unknown',
    };
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(parseInt(newChainId, 16));
    };

    const ethereum = window.ethereum;
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        status,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        account,
        chainId,
        balance,
        connect,
        disconnect,
        switchNetwork,
        getWalletInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default Web3Provider;