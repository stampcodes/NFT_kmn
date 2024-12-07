import { ethers } from "ethers";
import dotenv from "dotenv";
import contractAbi from "../abi/ExcKatametronNFT.json";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const CONTRACT_ADDRESS = process.env.CONTRACT_2_ADDRESS as string;

if (!SEPOLIA_RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing environment variables. Check your .env file.");
}

const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, wallet);

export const updateTokenURI = async (
  tokenId: bigint,
  newUri: string
): Promise<string> => {
  try {
    console.log(`Updating token URI for tokenId ${tokenId}...`);

    const tx = await contract.setTokenURI(tokenId, newUri);
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log(`Transaction confirmed: ${tx.hash}`);

    return tx.hash;
  } catch (error) {
    console.error("Error updating token URI:", error);
    throw error;
  }
};
