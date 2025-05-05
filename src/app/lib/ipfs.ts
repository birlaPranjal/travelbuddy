import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

if (!projectId || !projectSecret) {
  throw new Error('Infura project ID and secret are required');
}

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

interface IPFSMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: unknown;
}

export async function uploadToIPFS(metadata: IPFSMetadata): Promise<string> {
  try {
    const result = await ipfs.add(JSON.stringify(metadata));
    return `ipfs://${result.path}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
} 