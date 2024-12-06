import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";
dotenv.config();

const baseUri = process.env.BASE_URI_CONTRACT_2;
if (!baseUri) {
  throw new Error("BASE_URI is not defined in the environment variables.");
}

const parentNFT = process.env.PARENT_NFT;
if (!parentNFT) {
  throw new Error("PARENT_NFT is not defined in the environment variables.");
}

const ExcKatametronNFTModule = buildModule("ExcKatametronNFTModule", (m) => {
  const ExcKatametronNFT = m.contract("ExcKatametronNFT", [baseUri, parentNFT]);
  return { ExcKatametronNFT };
});

export default ExcKatametronNFTModule;
