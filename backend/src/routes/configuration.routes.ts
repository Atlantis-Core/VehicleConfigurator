import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/save', async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      modelId,
      colorId,
      rimId,
      engineId,
      transmissionId,
      interiorId,
      totalPrice,
      features
    } = req.body;

    const configuration = await prisma.configuration.create({
      data: {
        customer: {
          connect: { id: customerId }
        },
        model: { connect: { id: modelId } },
        color: { connect: { id: colorId } },
        rim: { connect: { id: rimId } },
        engine: { connect: { id: engineId } },
        transmission: { connect: { id: transmissionId } },
        interior: { connect: { id: interiorId } },
        totalPrice
        // TODO: Handle features saving
      }
    });

    res.status(201).json({
      message: 'Configuration saved successfully',
      configId: configuration.id
    });

  } catch (error) {
    console.error('[POST /save]', error);
    res.status(500).json({ error: `Failed to save configuration ${error}` });
  }
});

export default router;