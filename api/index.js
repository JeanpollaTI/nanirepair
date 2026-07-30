import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import repairsRouter from './routes/repairs.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection caching logic for Serverless Functions
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  const uri = process.env.MONGODB_URI || "mongodb+srv://thejeanpollo_db_user:oneforallfullclow100@cluster0.av2jhdp.mongodb.net/?appName=Cluster0";
  
  try {
    const db = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Database middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

// Routes
app.use('/api/repairs', repairsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'NaniRepair API is working properly',
    timestamp: new Date()
  });
});

// Run local server if not deployed on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in local mode on http://localhost:${PORT}`);
  });
}

export default app;
