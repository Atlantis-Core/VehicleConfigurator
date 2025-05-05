import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Missing token' });
    return;
  }

  const customer = await prisma.customer.findFirst({
    where: { verificationCode: token },
  });

  if (!customer) {
    res.status(404).json({ error: 'Invalid token' });
    return;
  }

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      emailVerified: true,
      verificationCode: null,
    },
  });

  res.status(200).send('Email verified successfully.');
});

router.get('/check-verification', async (req, res) => {
  const { email } = req.query;
  const customer = await prisma.customer.findUnique({ where: { email: String(email) } });
  res.send({ verified: customer?.emailVerified });
});

export default router