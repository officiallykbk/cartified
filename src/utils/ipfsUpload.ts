import { toast } from 'react-hot-toast';
import axios from 'axios';
import { mintNFT } from './mintNFT';
import { ethers } from 'ethers';

const PINATA_API_KEY = "e4e6d2a74d42ffae6254";
const PINATA_SECRET = "75126eccd111cb7e6a3af69f892acae1c14a10936c6371ca7aecc20e9795973d";
const PINATA_ENDPOINT = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export const uploadJSONToIPFS = async (data: object, signer: ethers.Signer) => {
  try {
    const res = await axios.post(
      PINATA_ENDPOINT,
      data,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY!,
          pinata_secret_api_key: PINATA_SECRET!,
        },
      }
    );

    const ipfsHash = res.data.IpfsHash;
    const ipfsURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    // Trigger minting after successful upload
    const { txHash, qrData, tokenId } = await mintNFT(ipfsURI, signer);
    return { ipfsURI, txHash, qrData, tokenId };
  } catch (error) {
    toast.error('Failed to upload to IPFS');
    throw error;
  }
};

