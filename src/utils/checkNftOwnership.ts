import { ethers } from 'ethers';
import Cartified1155ABI from '../contracts/delivery.json';

const CONTRACT_ADDRESS: string = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export interface OwnedNFT {
  tokenId: string;
  ipfsURI: string;
  delivered: boolean;
  burned: boolean;
  amount: string;
}

async function getMaxTokenId(contract: ethers.Contract): Promise<number> {
  try {
    // Try to get the latest token ID from TransferSingle events
    const filter = contract.filters.TransferSingle(null, null, null, null, null);
    const events = await contract.queryFilter(filter, -10000); // Look back 10000 blocks
    
    let maxTokenId = 0;
    for (const event of events) {
      if (event instanceof ethers.EventLog) {
        const args = event.args as unknown as { id: bigint };
        const tokenId = Number(args.id);
        if (tokenId > maxTokenId) {
          maxTokenId = tokenId;
        }
      }
    }
    
    // Add some buffer to account for any new tokens
    return maxTokenId + 5;
  } catch (error) {
    console.warn('Error getting max token ID from events, defaulting to 100:', error);
    return 100; // Fallback to a reasonable default
  }
}

export async function getOwnedNFTs(userAddress: string, provider: ethers.Provider): Promise<OwnedNFT[]> {
  try {
    // Validate inputs
    if (!userAddress) {
      throw new Error('User address is required');
    }
    if (!provider) {
      throw new Error('Provider is required');
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address is not configured');
    }
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      throw new Error(`Invalid contract address: ${CONTRACT_ADDRESS}`);
    }
    if (!ethers.isAddress(userAddress)) {
      throw new Error(`Invalid user address: ${userAddress}`);
    }

    console.log('Starting NFT fetch with:', {
      userAddress,
      contractAddress: CONTRACT_ADDRESS,
      network: await provider.getNetwork()
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Cartified1155ABI.abi, provider);
    
    // Get dynamic max token ID
    const maxTokenId = await getMaxTokenId(contract);
    console.log('Max token ID to check:', maxTokenId);
    
    const ownedNFTs: OwnedNFT[] = [];
    
    // Check each token ID up to maxTokenId
    for (let tokenId = 1; tokenId <= maxTokenId; tokenId++) {
      try {
        console.log('Checking token ID:', tokenId);
        const balance = await contract.balanceOf(userAddress, tokenId);
        console.log('Balance for token', tokenId, ':', balance.toString());
        
        if (balance > 0) {
          console.log('Found owned token:', tokenId);
          try {
            console.log('Fetching order details for token:', tokenId);
            const order = await contract.orders(tokenId);
            console.log('Order details:', {
              isDelivered: order.isDelivered,
              isBurned: order.isBurned,
              amount: order.amount.toString()
            });

            console.log('Fetching URI for token:', tokenId);
            const uri = await contract.uri(tokenId);
            console.log('URI:', uri);
            
            ownedNFTs.push({
              tokenId: tokenId.toString(),
              ipfsURI: uri,
              delivered: order.isDelivered,
              burned: order.isBurned,
              amount: ethers.formatEther(order.amount)
            });
            console.log('Successfully added NFT to list:', tokenId);
          } catch (orderError) {
            console.error(`Error fetching details for token ${tokenId}:`, orderError);
            // Add NFT with default values if order details fail
            ownedNFTs.push({
              tokenId: tokenId.toString(),
              ipfsURI: '',
              delivered: false,
              burned: false,
              amount: '0'
            });
          }
        }
      } catch (error) {
        console.error(`Error checking token ${tokenId}:`, error);
        // Continue checking other tokens even if one fails
        continue;
      }
    }
    
    console.log('Final owned NFTs list:', ownedNFTs);
    return ownedNFTs;
  } catch (error) {
    console.error('Error in getOwnedNFTs:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

export async function hasNftTokens(userAddress: string, provider: ethers.Provider): Promise<boolean> {
  try {
    const ownedNFTs = await getOwnedNFTs(userAddress, provider);
    return ownedNFTs.length > 0;
  } catch (error) {
    console.error('Error in hasNftTokens:', error);
    return false;
  }
}