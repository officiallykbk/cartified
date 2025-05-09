import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import Cartified1155ABI from '../contracts/delivery.json';

const CONTRACT_ADDRESS: string = import.meta.env.VITE_CONTRACT_ADDRESS || '';
const BLOCK_EXPLORER_URL: string = import.meta.env.VITE_BLOCK_EXPLORER_URL || '';

export const placeOrder = async (
  ipfsURI: string,
  signer: ethers.Signer,
  orderPrice: string
): Promise<{ txHash: string; tokenId: string }> => {
  try {
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      throw new Error('Invalid contract address');
    }

    if (!signer.provider) {
      throw new Error('No provider available');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Cartified1155ABI.abi,
      signer
    );

    // Send order with dynamic price (in wei)
    const tx = await contract.placeOrder(ipfsURI, {
      value: ethers.parseEther(orderPrice),
    });

    const receipt = await tx.wait();

    const orderPlacedEvent = receipt.logs?.find((log: ethers.Log) => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog?.name === 'OrderPlaced';
      } catch {
        return false;
      }
    });

    if (!orderPlacedEvent) {
      throw new Error('OrderPlaced event not found');
    }

    const parsed = contract.interface.parseLog(orderPlacedEvent);
    if (!parsed) {
      throw new Error('Failed to parse OrderPlaced event');
    }

    const tokenId = parsed.args.tokenId.toString();

    toast.success('Order placed successfully!');
    return {
      txHash: tx.hash,
      tokenId,
    };
  } catch (err: unknown) {
    console.error('Order placement failed:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
    toast.error(errorMessage);
    throw err;
  }
};