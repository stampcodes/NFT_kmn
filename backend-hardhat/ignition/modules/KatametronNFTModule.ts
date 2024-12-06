import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";
dotenv.config();

const baseUri = process.env.BASE_URI_CONTRACT_1;
if (!baseUri) {
  throw new Error("BASE_URI is not defined in the environment variables.");
}

const KatametronNFTModule = buildModule("KatametronNFTModule", (m) => {
  const KatametronNFT = m.contract("KatametronNFT", [baseUri]);
  return { KatametronNFT };
});

export default KatametronNFTModule;
