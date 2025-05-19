import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Feature } from '../types/config';

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
      brand,
      features
    } = req.body;

    const configuration = await prisma.configuration.create({
      data: {
        customer: { connect: { id: customerId } },
        model: { connect: { id: modelId } },
        color: { connect: { id: colorId } },
        rim: { connect: { id: rimId } },
        engine: { connect: { id: engineId } },
        transmission: { connect: { id: transmissionId } },
        interior: { connect: { id: interiorId } },
        totalPrice,
        brand
      }
    });

    await Promise.all(features.map(async (feature: Feature) => {
      const configurationFeature = await prisma.configurationFeature.create({
      data: {
        configurationId: configuration.id,
        featureId: feature.id
      }
      });
      return configurationFeature;
    }));


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