'use client'
import { createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast';

type EthereumEvent = 'accountsChanged' | 'chainChanged';
type EthereumCallback = ((accounts: string[]) => void) | ((chainId: string) => void);

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: EthereumEvent, callback: EthereumCallback) => void;
  removeListener: (event: EthereumEvent, callback: EthereumCallback) => void;
  selectedAddress?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type WalletStatus = 'disconnected' | 'connecting' | 'connected'

interface WalletInfo {
  address: string
  balance: string
  network: string
  ensName?: string | null
}

interface WalletContextType {
  status: WalletStatus
  isConnected: boolean
  isConnecting: boolean
  account: string
  chainId: number | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<boolean>
  getWalletInfo: () => WalletInfo
  provider?: ethers.BrowserProvider
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [account, setAccount] = useState<string>('')
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [ensName, setEnsName] = useState<string | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        console.log('Found existing wallet connection, connecting...');
        await connect()
      }
    }
    checkConnection()
  }, [])

  // Debug effect to track provider state
  useEffect(() => {
    console.log('Provider state changed:', {
      hasProvider: !!provider,
      status,
      account,
      chainId
    });
  }, [provider, status, account, chainId]);

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!')
      return
    }

    try {
      console.log('Starting wallet connection...');
      setStatus('connecting')
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request accounts first
      console.log('Requesting accounts...');
      const accounts = await web3Provider.send('eth_requestAccounts', [])
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }
      
      // Set provider after accounts are approved
      console.log('Setting provider...');
      setProvider(web3Provider)
      
      const network = await web3Provider.getNetwork()
      console.log('Connected to network:', network);
      
      // Check if we're on the correct network
      const expectedChainId = Number(import.meta.env.VITE_CHAIN_ID || '137'); // Default to Polygon
      if (Number(network.chainId) !== expectedChainId) {
        console.log(`Switching to chain ID ${expectedChainId}...`);
        await switchNetwork(expectedChainId);
        // Recreate provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
      }

      const balance = await web3Provider.getBalance(accounts[0])
      console.log('Account balance:', ethers.formatEther(balance));
      
      // Try to resolve ENS name
      let name = null
      if (network.chainId === 1n) { // Only try ENS on Ethereum mainnet
        name = await web3Provider.lookupAddress(accounts[0])
      }

      setAccount(accounts[0])
      setChainId(Number(network.chainId))
      setBalance(ethers.formatEther(balance))
      setEnsName(name)
      setStatus('connected')

      // Set up event listeners
      console.log('Setting up event listeners...');
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    } catch (error) {
      console.error('Error in connect:', error);
      setStatus('disconnected')
      setProvider(undefined)
      toast.error(
        error instanceof Error
        ? error.message
        : 'Wallet connection was interrupted or failed.'
      )
      throw error
    }
  }

  const disconnect = () => {
    console.log('Disconnecting wallet...');
    setAccount('')
    setChainId(null)
    setBalance('0')
    setEnsName(null)
    setProvider(undefined)
    setStatus('disconnected')
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  const handleAccountsChanged = async (accounts: string[]) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      // Refresh balance when account changes
      if (provider) {
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
      }
    }
  }

  const handleChainChanged = async (chainId: string) => {
    console.log('Chain changed:', chainId);
    const newChainId = parseInt(chainId, 16)
    setChainId(newChainId)
    // Reset ENS name when chain changes
    setEnsName(null)
    
    // Recreate provider on chain change
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(newProvider)
    }
  }

  const switchNetwork = async (newChainId: number) => {
    if (!window.ethereum) return false
    
    try {
      console.log(`Switching to network ${newChainId}...`);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${newChainId.toString(16)}` }]
      })
      return true
    } catch (error: unknown) {
      console.error('Error switching network:', error);
      // This error code indicates the chain hasn't been added to MetaMask
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await addNetwork(newChainId)
          return true
        } catch (addError) {
          console.error('Error adding network:', addError)
          return false
        }
      }
      return false
    }
  }

  const addNetwork = async (chainId: number) => {
    if (!window.ethereum) return;
    
    // You would add your network configurations here
    // Example for Polygon:
    if (chainId === 137) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/']
        }]
      })
    }
  }

  const getWalletInfo = (): WalletInfo => {
    return {
      address: account,
      balance,
      network: chainId === 1 ? 'Ethereum' : 
               chainId === 137 ? 'Polygon' : 
               chainId === 56 ? 'BNB Chain' : 'Unknown',
      ensName
    }
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

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
        provider
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext }