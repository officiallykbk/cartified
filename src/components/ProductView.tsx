import React from 'react';
import { ArrowLeft, Shield, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { Product } from '../types';
import toast from 'react-hot-toast';
import ConnectWallet from './ConnectWallet';

interface ProductViewProps {
  product: Product;
  onBack: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({ product, onBack }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  {product.isVerified && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <Shield className="h-5 w-5 mr-1" />
                      <span className="font-medium">Verified Product</span>
                    </div>
                  )}
                </div>
              </div>
              <ConnectWallet />
            </div>

            <div className="border-t dark:border-gray-800 py-4 mb-6">
              <div className="text-3xl font-bold mb-2">${product.price.toFixed(2)}</div>
              {product.cryptoPrice && (
                <div className="text-gray-600 dark:text-gray-400">
                  {product.cryptoPrice.eth.toFixed(6)} ETH
                </div>
              )}
            </div>

            <div className="prose dark:prose-invert mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            </div>

            <div className="border-t dark:border-gray-800 py-4 mb-6">
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {product.inStock} items in stock
                </span>
              </div>

              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  Sold by {product.seller.name}
                  {product.seller.verified && (
                    <span className="text-blue-500 ml-1">(Verified Seller)</span>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductView;