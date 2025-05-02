import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all features
router.get('/', async (req, res) => {
  try {
    const features = await prisma.feature.findMany()
    res.json(features)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router