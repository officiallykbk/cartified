import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { mockProducts } from '../data/mockProducts';

const categories = ["All", "Fashion", "Electronics", "Home", "Food", "Digital"];

const ProductGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = selectedCategory === "All" 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="py-8">
      {/* Categories Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative flex-1 overflow-hidden">
          <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
        >
          <h3 className="font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <option>All Methods</option>
                <option>Ethereum</option>
                <option>USDC</option>
                <option>Traditional Payment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Verification Status</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Blockchain Verified
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Verified Sellers
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;