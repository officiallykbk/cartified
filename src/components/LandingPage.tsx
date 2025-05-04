import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';

interface LandingPageProps {
  setShowLanding: (show: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setShowLanding }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
      <Logo/>
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
            >
              Decentralized Shopping
              <br />
              Reimagined
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Shop securely with blockchain verification, NFT receipts, and seamless crypto payments.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <ConnectWallet className="px-8 py-3" />
              <button 
                onClick={() => setShowLanding(false)}
                className="px-8 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
              >
                Explore Products
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Cartified?</h2>
            <p className="text-gray-600 dark:text-gray-300">Experience the future of online shopping with blockchain technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Products</h3>
              <p className="text-gray-600 dark:text-gray-400">Every product is verified on the blockchain, ensuring authenticity and origin.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600 dark:text-gray-400">Smart contract powered transactions with instant NFT receipts.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Instant transactions and verifications using modern blockchain technology.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Products Listed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400">Verification Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support Available</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-blue-600 dark:bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Cartified for secure, verified purchases.
            <br />
            &copy; {new Date().getFullYear()} Cartified by KBN &mdash; Carted, Certified, Verified
          </p>
          <div className="flex justify-center">
  <ConnectWallet/>
</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;