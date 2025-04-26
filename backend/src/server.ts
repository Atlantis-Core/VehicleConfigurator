import dotenv from 'dotenv'
import { app } from './app'

dotenv.config()

const PORT = process.env.PORT || 5001;

try {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  });
} catch (error) {
  console.error('Error starting server:', error)
}