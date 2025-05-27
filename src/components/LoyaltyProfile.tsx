import React from 'react';
import { useLoyaltyContext } from '../contexts/LoyaltyContext';
import { useWallet } from '../hooks/useWallet';

const LoyaltyProfile: React.FC = () => {
  const { loyaltyPoints, loading, error, fetchLoyaltyData } = useLoyaltyContext();
  const { walletAddress, provider } = useWallet();

  const handleRefresh = () => {
    if (walletAddress && provider) {
      fetchLoyaltyData(walletAddress, provider);
    }
  };

  if (!walletAddress) {
    return (
      <div className="p-2 text-xs text-gray-600 dark:text-gray-400">
        Connect wallet to view points.
      </div>
    );
  }

  return (
    <div className="p-2 text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2">
      {loading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-red-500 dark:text-red-400 text-xs">Error!</p>}
      
      {!loading && !error && (
        <p className="font-medium text-gray-800 dark:text-gray-200">
          Points: <span className="font-bold">{loyaltyPoints}</span>
        </p>
      )}
      
      <button 
        onClick={handleRefresh} 
        disabled={loading || !walletAddress || !provider}
        className="px-2 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors duration-150 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      >
        {loading ? '...' : 'Refresh'}
      </button>
    </div>
  );
};

export default LoyaltyProfile;
