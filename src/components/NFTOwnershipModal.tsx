import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { OwnedNFT } from '../utils/checkNftOwnership';
import { Package, CheckCircle, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface NFTOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedNFTs: OwnedNFT[];
  onConfirmDelivery: (nft: OwnedNFT) => Promise<void>;
  onShowQRCode: (nft: OwnedNFT) => void;
  showDeliveryQR: boolean;
  selectedNFT: OwnedNFT | null;
  isLoading: boolean;
  confirmingTokenId: string | null;
}

const NFTOwnershipModal: React.FC<NFTOwnershipModalProps> = ({
  isOpen,
  onClose,
  ownedNFTs,
  onConfirmDelivery,
  onShowQRCode,
  showDeliveryQR,
  selectedNFT,
  isLoading,
  confirmingTokenId
}) => {
  const getQRCodeValue = (nft: OwnedNFT) => {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const qrData = {
      type: 'delivery_confirmation',
      tokenId: nft.tokenId,
      contractAddress: contractAddress,
      timestamp: Date.now(),
      network: 'polygon'
    };
    return JSON.stringify(qrData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900/95 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-100"
                  >
                    {showDeliveryQR ? 'Show QR Code to Delivery Person' : 'Your Orders'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {showDeliveryQR && selectedNFT ? (
                  <div className="mt-4">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl mb-6 border border-gray-700">
                        <h4 className="font-semibold text-lg mb-3 text-gray-100">Order Details</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Order #{selectedNFT.tokenId}</p>
                          <p className="text-sm text-gray-300">Amount: {selectedNFT.amount} MATIC</p>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-gray-100 mb-4">
                        Show this QR code to the delivery person
                      </h4>
                      <div className="flex justify-center p-4 bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                        <QRCodeSVG
                          value={getQRCodeValue(selectedNFT)}
                          size={256}
                          level="H"
                          includeMargin={true}
                          className="mx-auto"
                          bgColor="transparent"
                          fgColor="#ffffff"
                        />
                      </div>
                      <p className="mt-4 text-sm text-gray-400">
                        The delivery person will scan this code to confirm delivery
                      </p>
                      <button
                        onClick={() => onConfirmDelivery(selectedNFT)}
                        disabled={isLoading || confirmingTokenId === selectedNFT.tokenId}
                        className={`mt-6 px-6 py-3 rounded-xl text-white font-medium transition-all ${
                          isLoading && confirmingTokenId === selectedNFT.tokenId
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isLoading && confirmingTokenId === selectedNFT.tokenId
                          ? 'Confirming...'
                          : 'Confirm Delivery'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    {ownedNFTs.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No active orders found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ownedNFTs.map((nft) => (
                          <div
                            key={nft.tokenId}
                            className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                                <Package className="h-6 w-6 text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-100">Order #{nft.tokenId}</p>
                                <p className="text-sm text-gray-400">
                                  Amount: {nft.amount} MATIC
                                </p>
                                <p className="text-sm text-gray-400">
                                  Status:{' '}
                                  {nft.delivered ? (
                                    <span className="text-green-400 flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Delivered
                                    </span>
                                  ) : (
                                    <span className="text-yellow-400">Pending</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {!nft.delivered && !nft.burned && (
                              <button
                                onClick={() => onShowQRCode(nft)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 transition-all ${
                                  isLoading
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-sm hover:shadow-md'
                                }`}
                              >
                                <QrCode className="h-4 w-4" />
                                <span>Show QR</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NFTOwnershipModal; 