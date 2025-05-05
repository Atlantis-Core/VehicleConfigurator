import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

try {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
}