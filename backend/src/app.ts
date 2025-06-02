import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Import routes
import modelsRouter from "./routes/models.routes";
import rimsRouter from "./routes/rims.routes";
import interiorsRouter from "./routes/interiors.routes";
import transmissionsRoutes from "./routes/transmissions.routes";
import featuresRoutes from "./routes/features.routes";
import enginesRoutes from "./routes/engines.routes";
import colorsRoutes from "./routes/colors.routes";
import r2BucketRoutes from "./routes/r2bucket.routes";
import configRoutes from "./routes/configuration.routes";
import customerRoutes from "./routes/customer.routes";
import verifyEmailRoutes from "./routes/verifyEmail.routes";
import ordersRoutes from "./routes/orders.routes";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (_req, res) => {
  res.send("Vehicle Configurator Backend running 🚗");
});

// Register routes
app.use("/api/models", modelsRouter);
app.use("/api/rims", rimsRouter);
app.use("/api/interiors", interiorsRouter);
app.use("/api/transmissions", transmissionsRoutes);
app.use("/api/features", featuresRoutes);
app.use("/api/engines", enginesRoutes);
app.use("/api/colors", colorsRoutes);
app.use("/api/storage", r2BucketRoutes);

app.use("/api/order", ordersRoutes);
app.use("/api/configurations", configRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", verifyEmailRoutes);

export { app, prisma };
