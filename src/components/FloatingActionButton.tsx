import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { getOwnedNFTs, OwnedNFT } from '../utils/checkNftOwnership';
import NFTOwnershipModal from './NFTOwnershipModal';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import deliveryABI from '../contracts/delivery.json';

const FloatingActionButton: React.FC = () => {
  const { isConnected, account, connect } = useWallet();
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<OwnedNFT | null>(null);
  const [showDeliveryQR, setShowDeliveryQR] = useState(false);
  const [confirmingTokenId, setConfirmingTokenId] = useState<string | null>(null);

  // Fetch user's owned NFTs
  const fetchOwnedNFTs = async () => {
    if (!isConnected || !account || !window.ethereum) {
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nfts = await getOwnedNFTs(account, provider);
      const activeNFTs = nfts.filter(nft => !nft.burned);
      setOwnedNFTs(activeNFTs);
    } catch (error) {
      console.error('Error fetching orders:', {
        error,
        account,
        timestamp: new Date().toISOString()
      });
      if (error instanceof Error) {
        toast.error(`Error fetching orders: ${error.message}`);
      } else {
        toast.error('Error fetching orders');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOwnedNFTs();
  }, [isConnected, account]);

  // Listen for new orders
  useEffect(() => {
    if (!isConnected || !account || !window.ethereum) return;

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, deliveryABI.abi, provider);

    // Listen for TransferSingle events where the user is the recipient
    const filter = contract.filters.TransferSingle(null, null, account);
    
    const handleTransfer = async () => {
      console.log('New order detected, reconnecting wallet');
      // Disconnect and reconnect wallet to refresh state
      if (window.ethereum) {
        try {
          // Request account access to trigger reconnection
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Reconnect using our connect function
          await connect();
        } catch (error) {
          console.error('Error reconnecting wallet:', error);
        }
      }
    };

    contract.on(filter, handleTransfer);

    return () => {
      contract.removeListener(filter, handleTransfer);
    };
  }, [isConnected, account, connect]);

  // Show QR code for delivery confirmation
  const handleShowQRCode = (nft: OwnedNFT) => {
    setSelectedNFT(nft);
    setShowDeliveryQR(true);
  };

  // Handle delivery confirmation
  const handleConfirmDelivery = async (nft: OwnedNFT) => {
    if (!account || !window.ethereum) {
      console.error('Wallet not connected for delivery confirmation:', {
        hasAccount: !!account,
        hasEthereum: !!window.ethereum,
        timestamp: new Date().toISOString()
      });
      toast.error('Wallet not connected');
      return;
    }

    if (confirmingTokenId === nft.tokenId) {
      console.warn('Delivery confirmation already in progress:', {
        tokenId: nft.tokenId,
        timestamp: new Date().toISOString()
      });
      toast.error('Delivery confirmation already in progress');
      return;
    }

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error('Contract address not configured:', {
        timestamp: new Date().toISOString()
      });
      toast.error('Smart contract address not configured');
      return;
    }

    try {
      setConfirmingTokenId(nft.tokenId);
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, deliveryABI.abi, signer);
      
      const pendingToast = toast.loading('Confirming delivery... Please approve the transaction in MetaMask');
      
      const tx = await contract.confirmDelivery(nft.tokenId);
      toast.loading('Transaction sent! Waiting for confirmation...', { id: pendingToast });
      
      await tx.wait();

      // Reconnect wallet after delivery confirmation
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          await connect();
        } catch (error) {
          console.error('Error reconnecting wallet after delivery:', error);
        }
      }

      toast.success('Delivery confirmed successfully!', { id: pendingToast });

      // Reset states
      setShowDeliveryQR(false);
      setSelectedNFT(null);
    } catch (error) {
      console.error('Error confirming delivery:', {
        error,
        tokenId: nft.tokenId,
        account,
        timestamp: new Date().toISOString()
      });

      if (error instanceof Error) {
        if (error.message.includes('user rejected action') || error.message.includes('user denied')) {
          toast.error('Transaction was rejected. Please try again and approve the transaction in MetaMask.');
        } else if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient funds to complete the transaction. Please ensure you have enough MATIC for gas.');
        } else if (error.message.includes('network changed')) {
          toast.error('Network changed. Please ensure you are on the correct network (Polygon).');
        } else {
          toast.error(`Failed to confirm delivery: ${error.message}`);
        }
      } else {
        toast.error('Failed to confirm delivery. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setConfirmingTokenId(null);
    }
  };

  if (!isConnected) {
    return null;
  }

  const undeliveredNFTs = ownedNFTs.filter(nft => !nft.delivered);
  const deliveredNFTs = ownedNFTs.filter(nft => nft.delivered);
  const sortedNFTs = [...undeliveredNFTs, ...deliveredNFTs];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Package className="h-6 w-6" />
        )}
        {!isLoading && undeliveredNFTs.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {undeliveredNFTs.length}
          </span>
        )}
      </motion.button>

      <NFTOwnershipModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowDeliveryQR(false);
          setSelectedNFT(null);
        }}
        ownedNFTs={sortedNFTs}
        onConfirmDelivery={handleConfirmDelivery}
        onShowQRCode={handleShowQRCode}
        showDeliveryQR={showDeliveryQR}
        selectedNFT={selectedNFT}
        isLoading={isLoading}
        confirmingTokenId={confirmingTokenId}
      />
    </>
  );
};

export default FloatingActionButton;