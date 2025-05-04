import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { truncateAddress } from '../utils/address';

interface ConnectWalletProps {
  className?: string;
  onConnect?: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ className = '', onConnect }) => {
  const { isConnected, account, connect, disconnect } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
      onConnect?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`  bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500
      text-white
      font-bold
      px-8 py-3
      rounded-full
      shadow-lg
      hover:from-purple-500 hover:to-blue-600
      hover:scale-105
      transition-all
      duration-200
      border-2 border-white
      outline-none
      focus:ring-4 focus:ring-blue-300 flex gap-1 ${
        isConnected
          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
      } ${className}`}
    >
      <Wallet className="h-4 w-4" />
      <span className="text-sm font-medium">
        {isConnected ? truncateAddress(account) : 'Connect Wallet'}
      </span>
    </button>
  );
};

export default ConnectWallet;