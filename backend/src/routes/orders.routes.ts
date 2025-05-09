import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/submit", async (req: Request, res: Response) => {
  const {
    customerId,
    configurationId,
    paymentOption,
    financing,
  } = req.body;

  if (!customerId || !configurationId || !paymentOption) {
    res.status(400).json({ error: "Missing required fields!" });
    return;
  }

  try {
    const order = await prisma.order.create({
      data: {
        customerId: parseInt(customerId),
        configurationId: parseInt(configurationId),
        paymentOption,
        financing,
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating new order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
