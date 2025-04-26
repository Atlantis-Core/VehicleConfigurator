import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

import modelsRouter from './routes/models.routes'
app.use('/api/models', modelsRouter)

app.get('/', (_req, res) => {
  res.send('Vehicle Configurator Backend running 🚗')
})

export { app, prisma }