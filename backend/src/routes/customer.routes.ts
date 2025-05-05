import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '../services/sendVerificationEmail';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/find-or-create', async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, address } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Missing required field: email' });
    return;
  }

  try {
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      const verificationCode = uuidv4();

      customer = await prisma.customer.create({
        data: {
          firstName: firstName || '',
          lastName: lastName || '',
          email,
          phone: phone || '',
          address: address || '',
          emailVerified: false,
          verificationCode
        },
      });

      await sendVerificationEmail(email, verificationCode);
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error finding or creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
