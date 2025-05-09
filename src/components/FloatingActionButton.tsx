import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { getOwnedNFTs, OwnedNFT } from '../utils/checkNftOwnership';
import NFTOwnershipModal from './NFTOwnershipModal';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import deliveryABI from '../contracts/delivery.json';

const FloatingActionButton: React.FC = () => {
  const { isConnected, account } = useWallet();
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<OwnedNFT | null>(null);
  const [showDeliveryQR, setShowDeliveryQR] = useState(false);
  const [confirmingTokenId, setConfirmingTokenId] = useState<string | null>(null);

  // Fetch user's owned NFTs
  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!isConnected || !account || !window.ethereum) {
        console.log('Wallet not connected or missing provider/account', {
          isConnected,
          hasEthereum: !!window.ethereum,
          account
        });
        return;
      }

      setIsLoading(true);
      try {
        console.log('Starting NFT fetch for account:', account);
        
        // Create a new provider instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log('Provider network:', network);
        console.log('Contract address:', import.meta.env.VITE_CONTRACT_ADDRESS);
        
        const nfts = await getOwnedNFTs(account, provider);
        // Filter out burnt NFTs
        const activeNFTs = nfts.filter(nft => !nft.burned);
        console.log('Fetched NFTs:', activeNFTs);
        setOwnedNFTs(activeNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        if (error instanceof Error) {
          toast.error(`Error fetching orders: ${error.message}`);
        } else {
          toast.error('Error fetching orders');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [isConnected, account]);

  // Show QR code for delivery confirmation
  const handleShowQRCode = (nft: OwnedNFT) => {
    setSelectedNFT(nft);
    setShowDeliveryQR(true);
  };

  // Handle delivery confirmation
  const handleConfirmDelivery = async (nft: OwnedNFT) => {
    if (!account || !window.ethereum) {
      toast.error('Wallet not connected');
      return;
    }

    if (confirmingTokenId === nft.tokenId) {
      toast.error('Delivery confirmation already in progress');
      return;
    }

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) {
      toast.error('Smart contract address not configured');
      return;
    }

    try {
      setConfirmingTokenId(nft.tokenId);
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, deliveryABI.abi, signer);

      console.log('Confirming delivery for token:', nft.tokenId);
      
      // Show a toast to indicate the transaction is pending
      const pendingToast = toast.loading('Confirming delivery... Please approve the transaction in MetaMask');
      
      const tx = await contract.confirmDelivery(nft.tokenId);
      console.log('Transaction sent:', tx.hash);
      
      // Update toast to show transaction is processing
      toast.loading('Transaction sent! Waiting for confirmation...', { id: pendingToast });
      
      await tx.wait();
      console.log('Transaction confirmed');

      // Refresh list after confirmation
      const updatedNFTs = await getOwnedNFTs(account, provider);
      // Filter out burnt NFTs
      const activeNFTs = updatedNFTs.filter(nft => !nft.burned);
      setOwnedNFTs(activeNFTs);

      // Show success toast
      toast.success('Delivery confirmed successfully!', { id: pendingToast });

      // Reset states
      setShowDeliveryQR(false);
      setSelectedNFT(null);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      
      // Handle specific error cases
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

  // Don't show button if not connected or no NFTs
  if (!isConnected) {
    console.log('Wallet not connected, hiding button');
    return null;
  }
  
  if (ownedNFTs.length === 0) {
    console.log('No NFTs found, hiding button');
    return null;
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Package className="h-6 w-6" />
        {ownedNFTs.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {ownedNFTs.length}
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
        ownedNFTs={ownedNFTs}
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