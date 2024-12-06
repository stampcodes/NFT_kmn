import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET!;
const PINATA_BASE_CID = process.env.PINATA_BASE_CID!;

if (!PINATA_API_KEY || !PINATA_API_SECRET || !PINATA_BASE_CID) {
  throw new Error("Pinata API keys or base CID are missing in the .env file.");
}

export const uploadFileToExistingCid = async (
  fileName: string,
  metadata: Record<string, any>
): Promise<string> => {
  try {
    const filePath = path.join(__dirname, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    const fileStream = fs.createReadStream(filePath);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      fileStream,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
        params: {
          pinataMetadata: JSON.stringify({
            name: fileName,
            keyvalues: {
              parentCID: PINATA_BASE_CID,
            },
          }),
          pinataOptions: JSON.stringify({
            cidVersion: 1,
          }),
        },
      }
    );

    fs.unlinkSync(filePath);

    console.log(
      `File successfully uploaded to existing directory on Pinata: ${response.data.IpfsHash}`
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error while uploading file to Pinata:", error);
    throw error;
  }
};
