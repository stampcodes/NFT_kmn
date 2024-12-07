import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import FormData from "form-data";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET!;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  throw new Error("Pinata API keys are missing in the .env file.");
}

export const uploadFileToNewCid = async (
  fileName: string,
  metadata: Record<string, any>
): Promise<string> => {
  try {
    const filePath = path.join(__dirname, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          ...formData.getHeaders(),
        },
      }
    );

    fs.unlinkSync(filePath);

    console.log(
      `File successfully uploaded to Pinata: ${response.data.IpfsHash}`
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error while uploading file to Pinata:", error);
    throw error;
  }
};
