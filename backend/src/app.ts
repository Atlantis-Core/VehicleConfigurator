import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(cors())
app.use(express.json())

// Static serving if needed
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

const prisma = new PrismaClient()

import modelsRouter from './routes/models.routes'
app.use('/api/models', modelsRouter)

import rimsRouter from './routes/rims.routes'
app.use('/api/rims', rimsRouter)

app.get('/', (_req, res) => {
  res.send('Vehicle Configurator Backend running 🚗')
})

export { app, prisma }