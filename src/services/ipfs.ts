import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_API_SECRET;
const auth = 'Basic ' + btoa(projectId + ':' + projectSecret);

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (data: any) => {
  try {
    const result = await client.add(JSON.stringify(data));
    return `ipfs://${result.path}`; // Changed to use ipfs:// protocol
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const generatePurchaseNFTMetadata = async (purchase: any) => {
  const metadata = {
    name: `Order #${purchase.id}`,
    description: 'Cartified Order Verification',
    image: '../../src/images/logo-no-bg.png', // Replace with your NFT image
    attributes: {
      orderId: purchase.id,
      buyer: purchase.buyerAddress,
      timestamp: purchase.timestamp,
      amount: purchase.amount,
      delivered: purchase.delivered,
      burned: purchase.burned
    },
  };

  return await uploadToIPFS(metadata);
};