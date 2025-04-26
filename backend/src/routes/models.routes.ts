import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all car models
router.get('/', async (req, res) => {
  try {
    const models = await prisma.model.findMany()
    res.json(models)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router