// component/FloatingActionButton.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { getOwnedNFTs, OwnedNFT } from '../utils/checkNftOwnership';
import NFTOwnershipModal from './NFTOwnershipModal';

const FloatingActionButton: React.FC = () => {
  const { isConnected, provider, account } = useWallet();
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (isConnected && provider && account) {
        setIsLoading(true);
        try {
          const nfts = await getOwnedNFTs(account, provider);
          setOwnedNFTs(nfts);
        } catch (error) {
          console.error('Error fetching owned NFTs:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOwnedNFTs();
  }, [isConnected, provider, account]);

  if (!isConnected || ownedNFTs.length === 0) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg z-50"
        onClick={() => setIsModalOpen(true)}
      >
        <QrCode className="h-6 w-6" />
        {isLoading && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      <NFTOwnershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ownedNFTs={ownedNFTs}
      />
    </>
  );
};

export default FloatingActionButton;