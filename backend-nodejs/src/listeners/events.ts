import { ethers } from "ethers";
import dotenv from "dotenv";
import contractAbi from "../abi/ExcKatametronNFT.json";
import { uploadFileToExistingCid } from "../utils/pinata";
// import { updateTokenURI } from "../services/tokenURI";
import axios from "axios";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.CONTRACT_2_ADDRESS!;
const contract = new ethers.Contract(
  contractAddress,
  contractAbi.abi,
  provider
);

const fetchMetadataFromIPFS = async (
  cid: string,
  tokenId: bigint
): Promise<Record<string, any>> => {
  const fileName = `${tokenId}.json`;
  const url = `https://gateway.pinata.cloud/ipfs/${cid}/${fileName}`;
  console.log(`Fetching metadata from: ${url}`);

  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching metadata from ${url}:`, error.message);
    } else {
      console.error(`Unknown error fetching metadata from ${url}:`, error);
    }
    throw error;
  }
};

export const startListening = () => {
  contract.on("NFTNameUpdated", async (tokenId: bigint, newName: string) => {
    console.log(`NFT name updated! Token ID: ${tokenId}, New Name: ${newName}`);

    try {
      const existingCid = process.env.PINATA_BASE_CID!;
      const fileName = `${newName}.json`;

      const metadata = await fetchMetadataFromIPFS(existingCid, tokenId);

      console.log("Existing metadata:", metadata);

      metadata.name = newName;

      console.log("Updated metadata:", metadata);

      const updatedFileCid = await uploadFileToExistingCid(fileName, metadata);

      console.log(
        `File updated in existing directory with CID: ${updatedFileCid}`
      );

      const newUri = `ipfs://${existingCid}/${fileName}`;
      // const txHash = await updateTokenURI(tokenId, newUri);

      console.log(`Token URI updated on blockchain: ${newUri}`);
      // console.log(`Transaction confirmed. Transaction Hash: ${txHash}`);
    } catch (error) {
      console.error("Error handling NFTNameUpdated event:", error);
    }
  });

  console.log("Listening for events...");
};
