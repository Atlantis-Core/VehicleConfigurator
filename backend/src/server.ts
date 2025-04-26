import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Serve static images from /public
app.use('/public', express.static('public'))

app.get('/api/health', (_req, res) => {
  res.send({ status: 'OK 🚗 Vehicle Configurator backend running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))