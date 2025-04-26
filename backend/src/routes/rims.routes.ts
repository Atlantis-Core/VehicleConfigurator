import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all car models
router.get('/', async (req, res) => {
  try {
    const rims = await prisma.rim.findMany()
    res.json(rims)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router