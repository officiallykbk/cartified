import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
}

export default function QRCodeModal({ isOpen, onClose, data }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your NFT QR Code</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex justify-center">
            <QRCodeSVG
              value={data}
              size={256}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
          </div>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Scan this QR code to view your NFT
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 