import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all car interiors
router.get('/', async (req, res) => {
  try {
    const interior = await prisma.interior.findMany()
    res.json(interior)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router