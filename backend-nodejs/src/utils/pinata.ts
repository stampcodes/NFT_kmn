import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET!;
const PINATA_BASE_CID = process.env.PINATA_BASE_CID!; // CID della directory esistente

if (!PINATA_API_KEY || !PINATA_API_SECRET || !PINATA_BASE_CID) {
  throw new Error(
    "Le chiavi API di Pinata o il CID base sono mancanti nel file .env"
  );
}

// Funzione per caricare un file JSON nella directory esistente su Pinata
export const uploadFileToExistingCid = async (
  fileName: string,
  metadata: Record<string, any>
): Promise<string> => {
  try {
    // Salva temporaneamente il file JSON
    const filePath = path.join(__dirname, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    const fileStream = fs.createReadStream(filePath);

    // Carica il file nella directory esistente su Pinata
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

    // Elimina il file temporaneo dopo il caricamento
    fs.unlinkSync(filePath);

    console.log(
      `File caricato con successo nella directory esistente su Pinata: ${response.data.IpfsHash}`
    );
    return response.data.IpfsHash; // Ritorna il CID del file aggiornato
  } catch (error) {
    console.error("Errore durante il caricamento del file su Pinata:", error);
    throw error;
  }
};
