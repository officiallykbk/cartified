import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import LandingPage from './components/LandingPage';
import Web3Provider from './providers/Web3Provider';
import WalletConnect from './components/WalletConnect';
import { CartProvider } from './contexts/CartContext';
import { AnimatePresence } from 'framer-motion';
import FloatingActionButton from './components/FloatingActionButton';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  return (
    <Web3Provider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {showLanding ? (
            <LandingPage setShowLanding={setShowLanding} />
          ) : (
            <>
              <Header 
                onCartClick={() => setIsCartOpen(true)} 
                onWalletClick={() => setIsWalletModalOpen(true)}
              />
              
              <main className="pt-16 md:pt-20 px-4 md:px-8 max-w-7xl mx-auto">
                <ProductGrid />
              </main>

              <FloatingActionButton />
            </>
          )}
          
          <AnimatePresence>
            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
          </AnimatePresence>
          
          <AnimatePresence>
            {isWalletModalOpen && (
              <WalletConnect onClose={() => setIsWalletModalOpen(false)} />
            )}
          </AnimatePresence>
          
          <Toaster position="bottom-center" />
        </div>
      </CartProvider>
    </Web3Provider>
  );
}

export default App;