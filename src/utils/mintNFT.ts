import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import deliveryABI from '../contracts/delivery.json';

// Update with your deployed contract address on Sonic Blaze testnet
const CONTRACT_ADDRESS = '0xB524a7d13A835aDb68c3C41de7a9609A2208a1C7'; // Replace with actual deployed contract address
const BLOCK_EXPLORER_URL = 'https://testnet.sonicscan.org/tx/'; // Sonic Blaze testnet explorer

export const mintNFT = async (ipfsURI: string, signer: ethers.Signer) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, deliveryABI.abi, signer);
    
    // Call mintOrder with just the IPFS URI
    const tx = await contract.mintOrder(ipfsURI);
    const receipt = await tx.wait();
    
    // Find the OrderMinted event in the receipt
    const orderMintedEvent = receipt.logs?.find(
      (log: ethers.Log) => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog?.name === 'OrderMinted';
        } catch {
          return false;
        }
      }
    );
    
    if (!orderMintedEvent) {
      throw new Error('OrderMinted event not found in transaction receipt');
    }
    
    // Parse the event data
    const parsedLog = contract.interface.parseLog(orderMintedEvent);
    if (!parsedLog) {
      throw new Error('Failed to parse OrderMinted event');
    }
    
    const tokenId = parsedLog.args.tokenId.toString();
    
    toast.success('NFT minted successfully!');
    
    // Return both the transaction hash and the QR code data
    return {
      txHash: tx.hash,
      qrData: `${BLOCK_EXPLORER_URL}${tx.hash}`, // This will be used to generate the QR code
      tokenId // Get the minted token ID from the OrderMinted event
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to mint NFT');
    throw error;
  }
}; 