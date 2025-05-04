import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useWallet } from '../hooks/useWallet';
import { PaymentMethod } from '../types';
import { uploadJSONToIPFS } from '../utils/ipfsUpload';
import { getSigner } from '../utils/getSigner';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isConnected, connect, provider } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('eth');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'confirm' | 'success'>('cart');
  const [qrData, setQrData] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    try {
      setIsProcessing(true);
      
      // Handle wallet connection if not connected
      if (!isConnected) {
        await connect();
        // Wait for connection to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Move to payment step if in cart
      if (checkoutStep === 'cart') {
        setCheckoutStep('payment');
        setIsProcessing(false);
        return;
      }

      // Move to confirmation step if in payment
      if (checkoutStep === 'payment') {
        setCheckoutStep('confirm');
        setIsProcessing(false);
        return;
      }

      // Handle final checkout in confirmation step
      if (checkoutStep === 'confirm') {
        // Prepare order data for IPFS
        const orderData = {
          items: cartItems,
          totalPrice,
          timestamp: new Date().toISOString(),
          paymentMethod
        };

        // Get signer using utility function
        const signer = await getSigner();
        
        // Upload to IPFS and mint NFT using utility function
        const { ipfsURI, qrData } = await uploadJSONToIPFS(orderData, signer);
        
        // Show QR code
        setQrData(qrData);
        setShowQR(true);
        
        // Clear cart after successful minting
        clearCart();
        
        // Move to success step
        setCheckoutStep('success');
        toast.success('Order processed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md h-full shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            {checkoutStep === 'cart' ? 'Your Cart' : 
             checkoutStep === 'payment' ? 'Payment Method' : 
             checkoutStep === 'confirm' ? 'Confirm Order' : 'Purchase Complete'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex border dark:border-gray-800 rounded-lg overflow-hidden"
                  >
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={item.image || 'https://placehold.co/100/e2e8f0/94a3b8?text=Image'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="mt-auto flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border dark:border-gray-700 rounded-l-md bg-gray-50 dark:bg-gray-800 disabled:opacity-50"
                        >
                          -
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b dark:border-gray-700">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border dark:border-gray-700 rounded-r-md bg-gray-50 dark:bg-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t dark:border-gray-800">
                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isConnected ? 'Proceed to Payment' : 'Connect Wallet to Checkout'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {checkoutStep === 'payment' && (
          <>
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Items ({cartItems.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="font-medium mb-3">Choose Payment Method</h3>
              <div className="space-y-3">
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'eth'}
                    onChange={() => setPaymentMethod('eth')}
                    className="mr-2"
                  />
                  <span className="font-medium">Ethereum</span>
                  <div className="ml-6 text-sm text-gray-500 dark:text-gray-400">
                    {(totalPrice / 3000).toFixed(6)} ETH
                  </div>
                </label>
                
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'usdc'}
                    onChange={() => setPaymentMethod('usdc')}
                    className="mr-2"
                  />
                  <span className="font-medium">USDC</span>
                  <div className="ml-6 text-sm text-gray-500 dark:text-gray-400">
                    {totalPrice.toFixed(2)} USDC
                  </div>
                </label>
                
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'fiat'}
                    onChange={() => setPaymentMethod('fiat')}
                    className="mr-2"
                  />
                  <span className="font-medium">Credit/Debit Card</span>
                  <div className="ml-6 text-sm text-gray-500 dark:text-gray-400">
                    Standard fiat payment
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Continue to Confirmation
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => setCheckoutStep('cart')}
                className="w-full mt-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'confirm' && (
          <>
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900 mb-6">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Secure Blockchain Transaction</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your payment will be processed securely on the blockchain with no intermediaries.
                </p>
              </div>

              <h3 className="font-medium mb-3">Order Details</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Payment Method</span>
                  <span className="font-medium">
                    {paymentMethod === 'eth' ? 'Ethereum' : 
                     paymentMethod === 'usdc' ? 'USDC' : 'Credit/Debit Card'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {paymentMethod === 'eth' ? `${(totalPrice / 3000).toFixed(6)} ETH` : 
                     paymentMethod === 'usdc' ? `${totalPrice.toFixed(2)} USDC` : 
                     `$${totalPrice.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p className="mb-2">
                  By confirming this order, you agree to the terms of service and privacy policy.
                </p>
                <p>
                  Once confirmed, this transaction cannot be reversed as it will be recorded on the blockchain.
                </p>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Confirm and Pay
              </button>
              <button
                onClick={() => setCheckoutStep('payment')}
                className="w-full mt-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Back to Payment Options
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'success' && (
          <>
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900 mb-6">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Purchase Successful!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your purchase has been recorded on the blockchain and an NFT has been generated for verification.
                </p>
              </div>

              {showQR && qrData && (
                <div className="text-center mb-6">
                  <QRCode value={qrData} size={200} className="mx-auto mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scan this QR code to verify your purchase
                  </p>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">NFT Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  IPFS URL: {qrData}
                </p>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800">
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Cart;