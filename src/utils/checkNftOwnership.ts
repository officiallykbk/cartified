// utils/checkNftOwnership.ts
import { ethers } from 'ethers';
import deliveryABI from '../contracts/delivery.json';

const CONTRACT_ADDRESS ='0xB524a7d13A835aDb68c3C41de7a9609A2208a1C7';

export interface OwnedNFT {
  tokenId: string;
  ipfsURI: string;
  delivered: boolean;
}

export async function getOwnedNFTs(userAddress: string, provider: ethers.Provider): Promise<OwnedNFT[]> {
  try {
    console.log('Checking NFTs for address:', userAddress);
    console.log('Using contract address:', CONTRACT_ADDRESS);
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, deliveryABI.abi, provider);
    
    // Get the current token ID to know the range to check
    const currentTokenId = await contract.currentTokenId();
    console.log('Current token ID:', currentTokenId.toString());
    
    const ownedNFTs: OwnedNFT[] = [];
    
    // Check each token ID up to the current one
    for (let tokenId = 1; tokenId <= currentTokenId; tokenId++) {
      console.log('Checking token ID:', tokenId);
      const balance = await contract.balanceOf(userAddress, tokenId);
      console.log('Balance for token', tokenId, ':', balance.toString());
      
      if (balance > 0) {
        console.log('Found owned NFT:', tokenId);
        // Get the order details
        const order = await contract.orders(tokenId);
        const delivered = await contract.getOrderStatus(tokenId);
        
        ownedNFTs.push({
          tokenId: tokenId.toString(),
          ipfsURI: order.ipfsURI,
          delivered
        });
      }
    }
    
    console.log('Total owned NFTs found:', ownedNFTs.length);
    return ownedNFTs;
  } catch (error) {
    console.error('Error fetching owned NFTs:', error);
    return [];
  }
}

export async function hasNftTokens(userAddress: string, provider: ethers.Provider): Promise<boolean> {
  const ownedNFTs = await getOwnedNFTs(userAddress, provider);
  return ownedNFTs.length > 0;
}