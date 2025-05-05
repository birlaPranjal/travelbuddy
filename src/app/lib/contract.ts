import { ethers } from 'ethers';

// Contract address for Polygon Amoy testnet
export const CONTRACT_ADDRESS = '0xeC5e77aafbbe4EeE83aff84c3260f35716D83053';

// Network configuration for Polygon Amoy testnet
export const NETWORK_CONFIG = {
  chainId: '0x13882', // Polygon Amoy
  chainName: 'Polygon Amoy',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com'],
};

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NFT {
  tokenId: string;
  tokenURI: string;
  taskId: string;
  metadata?: NFTMetadata;
}

// ERC-721 Contract ABI
const CONTRACT_ABI = [
  // ERC-721 Standard Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  
  // Custom Functions
  "function mintNFT(address to, string memory tokenURI, string memory taskId) public returns (uint256)",
  "function getTaskId(uint256 tokenId) public view returns (string memory)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event NFTMinted(address indexed to, uint256 indexed tokenId, string taskId, string tokenURI)"
];

export const getContract = async (provider?: ethers.BrowserProvider) => {
  console.log('🔍 Attempting to get contract instance...');
  
  try {
    console.log('📡 Connecting to provider...');
    const ethersProvider = provider || new ethers.JsonRpcProvider(
      NETWORK_CONFIG.rpcUrls[0],
      {
        chainId: parseInt(NETWORK_CONFIG.chainId, 16),
        name: NETWORK_CONFIG.chainName,
      }
    );
    
    // Only try to get signer if provider is a BrowserProvider
    let signer;
    if (provider) {
      try {
        signer = await provider.getSigner();
        console.log('✅ Connected to provider and got signer');
      } catch (error) {
        console.log('⚠️ Could not get signer, using provider directly');
        signer = ethersProvider;
      }
    } else {
      signer = ethersProvider;
    }
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    console.log('✅ Contract instance created successfully');
    return contract;
  } catch (error: unknown) {
    console.error('❌ Error connecting to contract:', error);
    throw new Error('Failed to connect to contract');
  }
};

export const mintNFT = async (
  provider: ethers.BrowserProvider,
  to: string,
  tokenURI: string,
  taskId: string
): Promise<{ success: boolean; tokenId?: string; transactionHash?: string; error?: string }> => {
  console.log('🎨 Starting NFT minting process...');
  console.log('📝 Minting details:', { to, tokenURI, taskId });
  
  try {
    const contract = await getContract(provider);
    console.log('📜 Contract obtained, initiating mint transaction...');
    
    const tx = await contract.mintNFT(to, tokenURI, taskId);
    console.log('⏳ Transaction sent, waiting for confirmation...');
    console.log('📄 Transaction hash:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('📊 Transaction details:', {
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status
    });

    // Get the tokenId from the event
    const nftMintedEvent = contract.interface?.getEvent('NFTMinted');
    const event = nftMintedEvent ? receipt.logs.find((log: ethers.Log) => 
      log.topics[0] === nftMintedEvent.topicHash
    ) : null;
    
    if (event && contract.interface) {
      const decodedEvent = contract.interface.decodeEventLog('NFTMinted', event.data, event.topics);
      const tokenId = decodedEvent.tokenId.toString();
      console.log('🎫 NFT minted with tokenId:', tokenId);

      return { 
        success: true, 
        tokenId,
        transactionHash: tx.hash 
      };
    } else {
      throw new Error('NFTMinted event not found in transaction receipt');
    }
  } catch (error: unknown) {
    console.error('❌ Error minting NFT:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to mint NFT';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const getNFTs = async (address: string): Promise<{ success: boolean; nfts?: NFT[]; error?: string }> => {
  console.log('🔍 Starting NFT fetch process...');
  console.log('👤 Fetching NFTs for address:', address);
  
  try {
    const contract = await getContract();
    console.log('📜 Contract obtained, checking balance...');
    
    // Verify the contract is deployed
    const code = await contract.runner?.provider?.getCode(CONTRACT_ADDRESS);
    if (!code || code === '0x') {
      console.error('❌ Contract not deployed at address:', CONTRACT_ADDRESS);
      return {
        success: false,
        error: 'Contract not deployed at the specified address'
      };
    }

    // Check if the address is valid
    if (!ethers.isAddress(address)) {
      console.error('❌ Invalid address:', address);
      return {
        success: false,
        error: 'Invalid wallet address'
      };
    }

    try {
      const balance = await contract.balanceOf(address);
      console.log('💰 NFT balance:', balance.toString());
      
      // Convert balance to number for comparison
      const balanceNum = Number(ethers.formatUnits(balance, 0));
      if (balanceNum === 0) {
        console.log('ℹ️ No NFTs found for this address');
        return { success: true, nfts: [] };
      }

      const nfts: NFT[] = [];
      
      for (let i = 0; i < balanceNum; i++) {
        console.log(`🔄 Processing NFT ${i + 1}/${balanceNum}...`);
        
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          console.log('🎫 Token ID:', tokenId.toString());
          
          const [tokenURI, taskId] = await Promise.all([
            contract.tokenURI(tokenId),
            contract.getTaskId(tokenId)
          ]);
          console.log('🔗 Token URI:', tokenURI);
          console.log('📋 Task ID:', taskId);
          
          try {
            console.log('📥 Fetching metadata from IPFS...');
            const metadataResponse = await fetch(tokenURI);
            if (!metadataResponse.ok) {
              throw new Error(`HTTP error! status: ${metadataResponse.status}`);
            }
            const metadata = await metadataResponse.json();
            console.log('📦 Metadata fetched:', metadata);
            
            nfts.push({
              tokenId: tokenId.toString(),
              tokenURI,
              taskId,
              metadata: {
                name: metadata.name || 'Unnamed NFT',
                description: metadata.description || 'No description available',
                image: metadata.image,
                attributes: metadata.attributes
              }
            });
            console.log('✅ NFT processed successfully');
          } catch (metadataError) {
            console.error('❌ Error fetching metadata:', metadataError);
            nfts.push({
              tokenId: tokenId.toString(),
              tokenURI,
              taskId,
              metadata: {
                name: 'Unnamed NFT',
                description: 'Metadata unavailable',
                image: '/placeholder-nft.png'
              }
            });
          }
        } catch (tokenError) {
          console.error('❌ Error processing token:', tokenError);
          continue; // Skip this token and continue with others
        }
      }
      
      console.log('✨ NFT fetch completed successfully');
      console.log('📊 Total NFTs found:', nfts.length);
      
      return { success: true, nfts };
    } catch (balanceError) {
      console.error('❌ Error checking balance:', balanceError);
      return {
        success: false,
        error: 'Failed to check NFT balance'
      };
    }
  } catch (error: unknown) {
    console.error('❌ Error in NFT fetch process:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFTs';
    return {
      success: false,
      error: errorMessage,
    };
  }
}; 