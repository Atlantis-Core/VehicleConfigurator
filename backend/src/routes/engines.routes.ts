import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all engines
router.get('/', async (req, res) => {
  try {
    const engines = await prisma.engine.findMany()
    res.json(engines)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router