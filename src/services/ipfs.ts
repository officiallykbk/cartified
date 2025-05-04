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
    return `https://ipfs.io/ipfs/${result.path}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const generatePurchaseNFTMetadata = async (purchase: any) => {
  const metadata = {
    name: `Purchase #${purchase.id}`,
    description: 'Decentralized Shopping Purchase Verification',
    image: 'https://your-nft-image-url.com', // Replace with your NFT image
    attributes: {
      purchaseId: purchase.id,
      buyer: purchase.buyerAddress,
      timestamp: purchase.timestamp,
      items: purchase.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: purchase.total,
      paymentMethod: purchase.paymentMethod,
    },
  };

  return await uploadToIPFS(metadata);
};