import React, { useState } from 'react';
import { X, Wallet, AlertCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';

interface WalletConnectProps {
  onClose: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onClose }) => {
  const { connect, isConnected, account, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = (walletType: string) => {
    setSelectedWallet(walletType);
    setIsConnecting(true);
    
    setTimeout(() => {
      connect();
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {!isConnected && !isConnecting && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your wallet to access decentralized shopping features and make secure transactions.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleConnect('metamask')}
                  className="w-full p-3 flex items-center justify-between border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      🦊
                    </div>
                    <span className="font-medium">MetaMask</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button
                  onClick={() => handleConnect('walletconnect')}
                  className="w-full p-3 flex items-center justify-between border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      🔗
                    </div>
                    <span className="font-medium">WalletConnect</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button
                  onClick={() => handleConnect('coinbase')}
                  className="w-full p-3 flex items-center justify-between border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      💰
                    </div>
                    <span className="font-medium">Coinbase Wallet</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>
                  New to crypto wallets? <a href="#" className="underline font-medium">Learn more about wallets</a>
                </p>
              </div>
            </>
          )}

          {isConnecting && (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
              <h3 className="font-medium text-lg mb-2">Connecting to {selectedWallet}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please approve the connection in your wallet...
              </p>
            </div>
          )}

          {isConnected && (
            <>
              <div className="py-4 text-center mb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
                  <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-lg mb-1">Wallet Connected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm break-all">
                  {account}
                </p>
              </div>
              
              <div className="space-y-3">
                <a 
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full p-3 flex items-center justify-between border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium">View on Explorer</span>
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </a>
                
                <button
                  onClick={disconnect}
                  className="w-full p-3 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  Disconnect Wallet
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletConnect;