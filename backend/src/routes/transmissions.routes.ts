import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all transmissions
router.get('/', async (req, res) => {
  try {
    const transmissions = await prisma.transmission.findMany()
    res.json(transmissions)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router