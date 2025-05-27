import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LoyaltyProvider } from './contexts/LoyaltyContext.tsx'; // Import LoyaltyProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoyaltyProvider> {/* Wrap App with LoyaltyProvider */}
      <App />
    </LoyaltyProvider>
  </StrictMode>
);
