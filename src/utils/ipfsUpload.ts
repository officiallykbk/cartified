import { toast } from 'react-hot-toast';
import axios from 'axios';
import { placeOrder } from './mintNFT';
import { ethers } from 'ethers';

const PINATA_JWT_TOKEN = import.meta.env.VITE_PINATA_JWT_TOKEN || '';
const PINATA_ENDPOINT = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

interface IPFSResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadJSONToIPFS = async (
  data: object,
  signer: ethers.Signer,
  orderPrice: string
): Promise<{ ipfsURI: string; txHash: string; tokenId: string }> => {
  try {
    if (!PINATA_JWT_TOKEN) {
      throw new Error('Pinata JWT token not configured');
    }

    const res = await axios.post<IPFSResponse>(PINATA_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT_TOKEN}`
      },
    });

    const ipfsHash = res.data.IpfsHash;
    const ipfsURI = `ipfs://${ipfsHash}`;

    const { txHash, tokenId } = await placeOrder(ipfsURI, signer, orderPrice);
    return { ipfsURI, txHash, tokenId };
  } catch (err: unknown) {
    console.error('IPFS upload failed:', err);
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        throw new Error('Pinata authentication failed - check your JWT token');
      }
      throw new Error(`IPFS upload failed: ${err.response?.data?.error || err.message}`);
    }
    throw new Error('Failed to upload to IPFS');
  }
};