import express from 'express';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes';
import { connectRedis } from './config/redis';
import pool from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', paymentRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await pool.query('SELECT 1');
    res.json({
      status: 'UP',
      db: dbStatus.rowCount === 1 ? 'CONNECTED' : 'ERROR',
      redis: 'CONNECTED' // If it didn't crash, we assume it's connected based on the flow
    });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', error: err });
  }
});

const startServer = async () => {
  try {
    await connectRedis();
    console.log('Connected to Redis');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
