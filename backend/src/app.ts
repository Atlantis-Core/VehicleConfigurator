import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Import routes
import modelsRouter from './routes/models.routes';
import rimsRouter from './routes/rims.routes';
import interiorsRouter from './routes/interiors.routes';
import transmissionsRoutes from './routes/transmissions.routes';
import featuresRoutes from './routes/features.routes';
import enginesRoutes from './routes/engines.routes';
import colorsRoutes from './routes/colors.routes';

const app = express()
app.use(cors());
app.use(express.json());

// Static serving if needed
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

const prisma = new PrismaClient();

app.get('/', (_req, res) => {
  res.send('Vehicle Configurator Backend running 🚗');
})

// Register routes
app.use('/api/models', modelsRouter);
app.use('/api/rims', rimsRouter);
app.use('/api/interiors', interiorsRouter);
app.use('/api/transmissions', transmissionsRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/engines', enginesRoutes);
app.use('/api/colors', colorsRoutes);

export { app, prisma }