// contexts/WalletContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

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
  provider?: ethers.providers.Web3Provider
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [account, setAccount] = useState<string>('')
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [ensName, setEnsName] = useState<string | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        await connect()
      }
    }
    checkConnection()
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    try {
      setStatus('connecting')
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      
      // Request accounts first
      const accounts = await web3Provider.send('eth_requestAccounts', [])
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }
      
      // Set provider after accounts are approved
      setProvider(web3Provider)
      
      const network = await web3Provider.getNetwork()
      const balance = await web3Provider.getBalance(accounts[0])
      
      // Try to resolve ENS name
      let name = null
      if (network.chainId === 1) { // Only try ENS on Ethereum mainnet
        name = await web3Provider.lookupAddress(accounts[0])
      }

      setAccount(accounts[0])
      setChainId(network.chainId)
      setBalance(ethers.utils.formatEther(balance))
      setEnsName(name)
      setStatus('connected')

      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setStatus('disconnected')
      setProvider(undefined)
      throw error // Re-throw the error to be handled by the caller
    }
  }

  const disconnect = () => {
    setAccount('')
    setChainId(null)
    setBalance('0')
    setEnsName(null)
    setStatus('disconnected')
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      // Refresh balance when account changes
      if (provider) {
        provider.getBalance(accounts[0]).then(bal => {
          setBalance(ethers.utils.formatEther(bal))
        })
      }
    }
  }

  const handleChainChanged = (chainId: string) => {
    const newChainId = parseInt(chainId, 16)
    setChainId(newChainId)
    // Reset ENS name when chain changes
    setEnsName(null)
  }

  const switchNetwork = async (newChainId: number) => {
    if (!window.ethereum) return false
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${newChainId.toString(16)}` }]
      })
      return true
    } catch (error: unknown) {
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
      console.error('Error switching network:', error)
      return false
    }
  }

  const addNetwork = async (chainId: number) => {
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

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export { WalletContext }