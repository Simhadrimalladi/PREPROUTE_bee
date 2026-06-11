import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';

// This is for Vercel serverless
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    });
  }
}

// This is for local development (npm run dev or npm start)
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const start = async () => {
    try {
      await connectDB();
      app.listen(env.PORT, () => {
        console.log(`🚀 Preproute API running on port ${env.PORT}`);
        console.log(`📡 Environment: ${env.NODE_ENV}`);
        console.log(`✅ CORS enabled for: ${env.CORS_ORIGIN}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  start();
}