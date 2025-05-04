import React from 'react';
import { motion } from 'framer-motion';
import { X, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';
import { OwnedNFT } from '../utils/checkNftOwnership';

interface NFTOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedNFTs: OwnedNFT[];
}

const NFTOwnershipModal: React.FC<NFTOwnershipModalProps> = ({ isOpen, onClose, ownedNFTs }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            Your Order NFTs
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {ownedNFTs.length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No NFTs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ownedNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="border dark:border-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Order #{nft.tokenId}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        nft.delivered
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}
                    >
                      {nft.delivered ? 'Delivered' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-center">
                    <QRCode
                      value={nft.ipfsURI}
                      size={200}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Scan to verify order details
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NFTOwnershipModal; 