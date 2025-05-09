import { ethers } from 'ethers';
import ABI from '../contracts/delivery.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const confirmDelivery = async (tokenId: number) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    const tx = await contract.confirmDelivery(tokenId);
    await tx.wait();

    return true;
  } catch (error) {
    console.error('Error confirming delivery:', error);
    throw error;
  }
};

export const burnOrder = async (tokenId: number) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    const tx = await contract.burnOrder(tokenId);
    await tx.wait();

    return true;
  } catch (error) {
    console.error('Error burning order:', error);
    throw error;
  }
};