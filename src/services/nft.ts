import { ethers } from 'ethers';
import PurchaseNFTAbi from '../contracts/PurchaseNFT.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

export const mintPurchaseNFT = async (
  account: string,
  tokenId: number,
  tokenUri: string
) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      PurchaseNFTAbi,
      signer
    );

    const tx = await contract.mint(account, tokenId, tokenUri);
    await tx.wait();

    return tokenId;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};