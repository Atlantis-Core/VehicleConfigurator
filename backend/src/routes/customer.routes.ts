import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../services/sendVerificationEmail";
import { v4 as uuid } from "uuid";
import { sendVerificationCodeEmail } from "../services/sendVerificationCodeEmail";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/find-or-create", async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, address } = req.body;

  if (!email) {
    res.status(400).json({ error: "Missing required field: email" });
    return;
  }

  try {
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      const verificationCode = uuid();

      customer = await prisma.customer.create({
        data: {
          firstName: firstName || "",
          lastName: lastName || "",
          email,
          phone: phone || "",
          address: address || "",
          emailVerified: false,
          verificationCode,
        },
      });

      await sendVerificationEmail(email, verificationCode);
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error finding or creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Find customer by email
router.post("/find-by-email", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        phone: true,
        address: true,
      },
    });

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error finding customer by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send temporary verification code
router.post("/verify", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(404).json({ error: "Email not found" });
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    await sendVerificationCodeEmail(email, verificationCode);
    res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
});

export default router;
