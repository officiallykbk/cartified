import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWallet } from '../hooks/useWallet';
import contractAbi from '../contracts/delivery.json'; // Import the ABI

const CONTRACT_ADDRESS = '0xB524a7d13A835aDb68c3C41de7a9609A2208a1C7';

// Define the shape of the context data
interface LoyaltyContextData {
  loyaltyPoints: number;
  loading: boolean;
  error: string | null;
  fetchLoyaltyData: (userAddress: string, provider: ethers.providers.Web3Provider) => Promise<void>;
}

// Create the context with a default undefined value
const LoyaltyContext = createContext<LoyaltyContextData | undefined>(undefined);

// Define the props for the LoyaltyProvider
interface LoyaltyProviderProps {
  children: ReactNode;
}

// Create the LoyaltyProvider component
export const LoyaltyProvider: React.FC<LoyaltyProviderProps> = ({ children }) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress, provider } = useWallet();

  const fetchLoyaltyData = useCallback(async (userAddress: string, web3Provider: ethers.providers.Web3Provider) => {
    if (!userAddress || !web3Provider) {
      // Reset points if wallet is not connected properly
      setLoyaltyPoints(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, web3Provider);
      const filter = contract.filters.OrderMinted(null, userAddress); // Filter by userAddress as 'to'

      // Query events from block 0 to latest.
      // Consider using a more specific fromBlock in a production environment if contract deployment block is known.
      const events = await contract.queryFilter(filter, 0, 'latest');

      let totalPoints = 0;
      for (const event of events) {
        if (event.args && event.args.ipfsURI) {
          try {
            // Ensure IPFS URI is accessible, replace ipfs:// with a public gateway if necessary
            const accessibleIpfsUrl = event.args.ipfsURI.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
            const response = await axios.get(accessibleIpfsUrl);
            if (response.data && typeof response.data.totalPrice === 'number') {
              totalPoints += response.data.totalPrice; // Assuming 1 point per dollar
            }
          } catch (ipfsError) {
            console.error(`Failed to fetch or process IPFS data from URI: ${event.args.ipfsURI}`, ipfsError);
            // Optionally, set a partial error or continue processing other events
          }
        }
      }

      setLoyaltyPoints(totalPoints);
    } catch (e: any) {
      console.error('Failed to fetch loyalty data:', e);
      setError(e.message || 'Failed to fetch loyalty data.');
      setLoyaltyPoints(0); // Reset points on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies for useCallback as it's called from useEffect with specific params

  useEffect(() => {
    if (walletAddress && provider) {
      fetchLoyaltyData(walletAddress, provider);
    } else {
      // Reset points if wallet is disconnected or provider is unavailable
      setLoyaltyPoints(0);
      setError(null); // Clear any previous errors
    }
  }, [walletAddress, provider, fetchLoyaltyData]);

  return (
    <LoyaltyContext.Provider value={{ loyaltyPoints, loading, error, fetchLoyaltyData }}>
      {children}
    </LoyaltyContext.Provider>
  );
};

// Custom hook to use the LoyaltyContext
export const useLoyaltyContext = () => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyaltyContext must be used within a LoyaltyProvider');
  }
  return context;
};
