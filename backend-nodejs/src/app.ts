import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mintRoutes from "./routes/mint";
import { startListening } from "./listeners/events";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/mint", mintRoutes);

startListening();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
