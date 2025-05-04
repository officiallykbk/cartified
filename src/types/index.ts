export interface Product {
  id: number;
  name: string;
  price: number;
  cryptoPrice?: {
    eth: number;
    usdc: number;
  };
  image: string;
  category: string;
  seller: {
    id: string;
    name: string;
    verified: boolean;
  };
  rating: number;
  reviews: number;
  description: string;
  inStock: number;
  isVerified: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type WalletStatus = 'disconnected' | 'connecting' | 'connected';

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

export type PaymentMethod = 'eth' | 'usdc' | 'fiat';

export interface TransactionRecord {
  id: string;
  timestamp: number;
  products: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
}