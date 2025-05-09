import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Submit order
router.post("/submit", async (req: Request, res: Response) => {
  const { customerId, configurationId, paymentOption, financing } = req.body;

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
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating new order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all orders for a specific customer
router.get("/customer/:customerId", async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await prisma.order.findMany({
      where: { customerId: parseInt(customerId) },
      skip,
      take: Number(limit),
      orderBy: { orderDate: "desc" },
      include: {
        configuration: {
          include: {
            model: true,
            engine: true,
            color: true,
            transmission: true,
            rim: true,
            interior: true,
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.order.count({
      where: { customerId: parseInt(customerId) },
    });

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error retrieving customer orders:", error);
    res.status(500).json({ error: "Failed to retrieve customer orders" });
  }
});

export default router;
