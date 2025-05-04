// utils/getSigner.ts
import { ethers } from "ethers";

export const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask to continue.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a new Web3Provider instance
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get the signer
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error("Error getting signer:", error);
    throw new Error("Failed to connect to MetaMask. Please try again.");
  }
};
