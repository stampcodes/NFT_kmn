import { Router, Request, Response } from "express";
import { mintNFT } from "../services/contract";

const router = Router();

interface MintRequestBody {
  address: string;
}

router.post(
  "/",
  async (
    req: Request<{}, {}, MintRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const txHash = await mintNFT();
      res.status(200).json({ success: true, transactionHash: txHash });
    } catch (error) {
      console.error("Error during mint:", error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error during mint" });
      }
    }
  }
);

export default router;
