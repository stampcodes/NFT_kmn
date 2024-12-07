import { ethers } from "ethers";
import dotenv from "dotenv";
import contractAbi from "../abi/ExcKatametronNFT.json";
import { uploadFileToNewCid } from "../utils/pinata";
import { updateTokenURI } from "../services/tokenURI";
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
  if (!cid) {
    throw new Error(
      "PREVIOUS_CID is undefined or empty. Check your .env file."
    );
  }

  const fileName = `${tokenId}.json`; // Nome file basato sul tokenId
  const url = `https://gateway.pinata.cloud/ipfs/${cid}/${fileName}`;
  console.log(`Fetching metadata from: ${url}`);

  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log("Metadata fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching metadata from ${url}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${JSON.stringify(error)}`);
    }
    throw error;
  }
};

export const startListening = () => {
  contract.on("NFTNameUpdated", async (tokenId: bigint, newName: string) => {
    console.log(`NFT name updated! Token ID: ${tokenId}, New Name: ${newName}`);

    try {
      const existingCid = process.env.PREVIOUS_CID!;
      const metadata = await fetchMetadataFromIPFS(existingCid, tokenId); // Passa il tokenId

      console.log("Existing metadata:", metadata);

      metadata.name = newName;

      console.log("Updated metadata:", metadata);

      const newCid = await uploadFileToNewCid(`${newName}.json`, metadata);

      console.log(`New CID generated: ${newCid}`);

      const newUri = `ipfs://${newCid}`;
      const txHash = await updateTokenURI(tokenId, newUri);

      console.log(`Token URI updated on blockchain: ${newUri}`);
      console.log(`Transaction confirmed. Transaction Hash: ${txHash}`);
    } catch (error) {
      console.error("Error handling NFTNameUpdated event:", error);
    }
  });

  console.log("Listening for events...");
};
