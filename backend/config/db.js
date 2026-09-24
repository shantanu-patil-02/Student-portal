import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Fail fast when database is not connected
mongoose.set('bufferCommands', false);

let mongoMemoryServer = null;
let connectPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    try {
      let mongoUri = (process.env.MONGO_URI || '').trim();

      // Check if mongoUri has a valid scheme ('mongodb://' or 'mongodb+srv://')
      const isValidScheme =
        mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://');

      // If no valid URI is provided, default localhost, or invalid scheme:
      // fallback gracefully to MongoMemoryServer for zero-config local dev, preview & testing
      if (
        !isValidScheme ||
        mongoUri === 'mongodb://localhost:27017/student-task-manager' ||
        mongoUri === 'mongodb://localhost:27017'
      ) {
        if (isValidScheme) {
          try {
            // Try connecting to specified URI with a short timeout
            const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
            console.log(`[Database] Connected to external MongoDB: ${conn.connection.host}`);
            return;
          } catch (err) {
            console.log('[Database] Local MongoDB daemon not reachable. Falling back to In-Memory MongoDB...');
          }
        } else if (mongoUri) {
          console.warn(`[Database Warning] MONGO_URI was set to "${mongoUri}", which is not a valid mongodb scheme. Falling back to In-Memory MongoDB.`);
        }

        // Initialize MongoMemoryServer
        if (!mongoMemoryServer) {
          mongoMemoryServer = await MongoMemoryServer.create();
        }
        mongoUri = mongoMemoryServer.getUri();
        console.log(`[Database] In-Memory MongoDB started at: ${mongoUri}`);
      }

      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`[Database Error] ${error.message}`);
      // If external connect failed, attempt in-memory fallback instead of exiting
      try {
        console.log('[Database] Retrying with In-Memory MongoDB...');
        if (!mongoMemoryServer) {
          mongoMemoryServer = await MongoMemoryServer.create();
        }
        const memoryUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] In-Memory MongoDB Connected: ${conn.connection.host}`);
      } catch (fallbackError) {
        console.error(`[Database Critical Error] ${fallbackError.message}`);
      }
    }
  })();

  return connectPromise;
};

export default connectDB;
