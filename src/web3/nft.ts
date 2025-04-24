import { ethers } from 'ethers';

// ABI for our TravelNFT contract
const nftAbi = [
  "function mintNFT(address to, string memory tokenURI, string memory taskId) public returns (uint256)",
  "function getTaskId(uint256 tokenId) public view returns (string memory)",
  "event NFTMinted(address to, uint256 tokenId, string taskId, string tokenURI)"
];

type MintResult = {
  tokenId: string;
  tokenUri: string;
  transactionHash: string;
  taskId: string;
};

/**
 * Mints an NFT for a user with the provided image URL as metadata
 * @param userWallet Address of the user's wallet
 * @param imageUrl URL of the image to use as NFT metadata
 * @param taskId ID of the completed task
 * @returns MintResult object with tokenId, tokenUri and transaction hash
 */
export async function mintUserNFT(userWallet: string, imageUrl: string, taskId: string = 'default'): Promise<MintResult> {
  try {
    // Get environment variables
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    
    if (!contractAddress || !privateKey || !rpcUrl) {
      throw new Error('Missing required environment variables');
    }

    // Connect to the blockchain
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Connect to the NFT contract
    const nftContract = new ethers.Contract(contractAddress, nftAbi, wallet);
    
    // Create metadata JSON for the NFT
    const metadata = {
      name: `Travel Achievement: ${taskId}`,
      description: "A travel achievement NFT earned by completing a travel task",
      image: imageUrl,
      attributes: [
        {
          trait_type: "Task Type", 
          value: taskId
        },
        {
          trait_type: "Date Earned",
          value: new Date().toISOString().split('T')[0]
        }
      ]
    };

    // In a production environment, you would upload this metadata to IPFS
    // For simplicity in this example, we're using the JSON string directly
    const tokenUri = JSON.stringify(metadata);

    console.log(`Minting NFT for ${userWallet} with image ${imageUrl} for task ${taskId}`);
    
    // Call the mintNFT function with the wallet address, token URI, and task ID
    const tx = await nftContract.mintNFT(userWallet, tokenUri, taskId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Get the token ID from the NFTMinted event
    const mintedEvent = receipt.logs
      .map((log: any) => {
        try {
          return nftContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data
          });
        } catch (e) {
          return null;
        }
      })
      .find((event: any) => event && event.name === 'NFTMinted');
    
    const tokenId = mintedEvent ? mintedEvent.args[1].toString() : '0';
    
    return {
      tokenId,
      tokenUri: imageUrl,
      transactionHash: receipt.hash,
      taskId
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error(`Failed to mint NFT: ${error instanceof Error ? error.message : String(error)}`);
  }
} 