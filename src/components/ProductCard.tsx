import React from 'react';
import { ShoppingCart, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image || 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Image'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.isVerified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm ml-1">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
          {product.description || 'No description available'}
        </p>
        
        <div className="mt-2 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
            {product.cryptoPrice && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {product.cryptoPrice.eth.toFixed(4)} ETH
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        
        {product.seller.verified && (
          <div className="mt-2 text-xs flex items-center text-gray-500 dark:text-gray-400">
            <Shield className="w-3 h-3 mr-1 text-blue-500" />
            Verified Seller
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;