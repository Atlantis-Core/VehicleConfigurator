import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET all colors
router.get('/', async (req, res) => {
  try {
    const colors = await prisma.color.findMany()
    res.json(colors)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

export default router