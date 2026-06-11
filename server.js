import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { env } from './src/config/env.js';
import mongoose from 'mongoose';

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Preproute API running on port ${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
      console.log(`✅ CORS enabled for: ${env.CORS_ORIGIN}`);
    });
    
    // Graceful shutdown - ONLY for local development, not needed for Vercel
    if (env.NODE_ENV !== 'production') {
      process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(async () => {
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
          }
          console.log('HTTP server closed');
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only run if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  start();
}

export default app;