import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Minimalist Leather Wallet",
    price: 49.99,
    cryptoPrice: {
      eth: 0.0167,
      usdc: 49.99
    },
    image: "https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fashion",
    seller: {
      id: "0x123",
      name: "LeatherGoodsDAO",
      verified: true
    },
    rating: 4.8,
    reviews: 124,
    description: "Handcrafted minimalist wallet with RFID protection. Verified on blockchain with authenticity certificate.",
    inStock: 15,
    isVerified: true
  },
  {
    id: 2,
    name: "Digital Art Collection: Abstract Future",
    price: 299.99,
    cryptoPrice: {
      eth: 0.1,
      usdc: 299.99
    },
    image: "https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Digital",
    seller: {
      id: "0x456",
      name: "CryptoArtist",
      verified: true
    },
    rating: 4.9,
    reviews: 57,
    description: "Limited edition digital art with provable scarcity. Includes physical display frame with authentication chip.",
    inStock: 3,
    isVerified: true
  },
  {
    id: 3,
    name: "Smart Home Hub",
    price: 199.99,
    cryptoPrice: {
      eth: 0.067,
      usdc: 199.99
    },
    image: "https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Electronics",
    seller: {
      id: "0x789",
      name: "TechInnovators",
      verified: true
    },
    rating: 4.6,
    reviews: 231,
    description: "Decentralized smart home hub with blockchain-based security and no central server dependency.",
    inStock: 42,
    isVerified: true
  },
  {
    id: 4,
    name: "Sustainable Bamboo Sunglasses",
    price: 79.99,
    cryptoPrice: {
      eth: 0.027,
      usdc: 79.99
    },
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fashion",
    seller: {
      id: "0xabc",
      name: "EcoFashion",
      verified: false
    },
    rating: 4.3,
    reviews: 89,
    description: "Handcrafted sunglasses made from sustainable bamboo. Each purchase plants a tree via transparent donation tracking.",
    inStock: 27,
    isVerified: false
  },
  {
    id: 5,
    name: "Blockchain Verified Sneakers",
    price: 149.99,
    cryptoPrice: {
      eth: 0.05,
      usdc: 149.99
    },
    image: "https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fashion",
    seller: {
      id: "0xdef",
      name: "AuthenticKicks",
      verified: true
    },
    rating: 4.7,
    reviews: 176,
    description: "Limited edition sneakers with NFC chip linked to blockchain verification system. Provable authenticity and ownership history.",
    inStock: 8,
    isVerified: true
  },
  {
    id: 6,
    name: "Organic Coffee Subscription",
    price: 24.99,
    cryptoPrice: {
      eth: 0.0083,
      usdc: 24.99
    },
    image: "https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Food",
    seller: {
      id: "0x111",
      name: "DirectTrade",
      verified: true
    },
    rating: 4.9,
    reviews: 312,
    description: "Monthly subscription of organic coffee with blockchain-tracked origin. Smart contract ensures fair payment to farmers.",
    inStock: 100,
    isVerified: true
  },
  {
    id: 7,
    name: "Blockchain Development Course",
    price: 199.99,
    cryptoPrice: {
      eth: 0.067,
      usdc: 199.99
    },
    image: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Digital",
    seller: {
      id: "0x222",
      name: "CryptoEdu",
      verified: true
    },
    rating: 4.8,
    reviews: 245,
    description: "Comprehensive course on blockchain development. Access is unlocked via NFT that appreciates as you complete modules.",
    inStock: 999,
    isVerified: true
  },
  {
    id: 8,
    name: "Smart Contract Audit Service",
    price: 499.99,
    cryptoPrice: {
      eth: 0.167,
      usdc: 499.99
    },
    image: "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Digital",
    seller: {
      id: "0x333",
      name: "SecurityDAO",
      verified: true
    },
    rating: 4.9,
    reviews: 67,
    description: "Professional audit of your smart contracts by certified security experts. Includes formal verification and bug bounty setup.",
    inStock: 10,
    isVerified: true
  },
  {
    id: 9,
    name: "Decentralized Cloud Storage",
    price: 9.99,
    cryptoPrice: {
      eth: 0.0033,
      usdc: 9.99
    },
    image: "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Tech",
    seller: {
      id: "0x444",
      name: "StorageNodes",
      verified: true
    },
    rating: 4.6,
    reviews: 89,
    description: "Decentralized cloud storage subscription. Your files are encrypted and distributed across the blockchain network for security.",
    inStock: 999,
    isVerified: true
  },
  {
    id: 10,
    name: "Handcrafted Chess Set",
    price: 199.99,
    cryptoPrice: {
      eth: 0.067,
      usdc: 199.99
    },
    image: "https://images.pexels.com/photos/814133/pexels-photo-814133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Home",
    seller: {
      id: "0x555",
      name: "ArtisanGuild",
      verified: false
    },
    rating: 4.7,
    reviews: 45,
    description: "Handcrafted wooden chess set. Each piece has a unique identifier verified on blockchain to authenticate craftsmanship.",
    inStock: 7,
    isVerified: false
  },
  {
    id: 11,
    name: "VR Fitness System",
    price: 399.99,
    cryptoPrice: {
      eth: 0.133,
      usdc: 399.99
    },
    image: "https://images.pexels.com/photos/3761344/pexels-photo-3761344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Electronics",
    seller: {
      id: "0x666",
      name: "FitnessChain",
      verified: true
    },
    rating: 4.5,
    reviews: 134,
    description: "VR fitness system that rewards workouts with cryptocurrency tokens. Verified movement tracking and achievement system.",
    inStock: 23,
    isVerified: true
  },
  {
    id: 12,
    name: "Farm-to-Table Meat Box",
    price: 129.99,
    cryptoPrice: {
      eth: 0.043,
      usdc: 129.99
    },
    image: "https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Food",
    seller: {
      id: "0x777",
      name: "DirectFarm",
      verified: true
    },
    rating: 4.9,
    reviews: 203,
    description: "Monthly meat subscription with blockchain-verified origin. Scan QR code to see the farm, animal welfare standards, and delivery tracking.",
    inStock: 16,
    isVerified: true
  }
];