import dotenv from "dotenv";

dotenv.config();

import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000;
const BACKEND_RUNNING_URL = process.env.BACKEND_RUNNING_URL || "localhost";

try {
  app.listen(PORT, BACKEND_RUNNING_URL, () => {
    console.log(`🚀 Server running on http://${BACKEND_RUNNING_URL}:${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
}