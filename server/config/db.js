const mongoose = require('mongoose');
const { seedInitialData } = require('../utils/seedHelper');

// Prevent Mongoose from hanging indefinitely on buffering
mongoose.set('bufferTimeoutMS', 5000);

// Setup connection lifecycle event handlers
mongoose.connection.on('connected', () => {
  console.log(`[MongoDB] ✅ Connected to local MongoDB instance: ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] ❌ Runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn(`[MongoDB] ⚠️ Connection to database was disconnected.`);
});

// Handle application termination signals gracefully
const gracefulExit = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Database connection closed through app termination.');
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

const connectDB = async () => {
  // Prevent duplicate connections if already connected
  if (mongoose.connection.readyState === 1) {
    console.log(`[MongoDB] ✅ Already connected to database: ${mongoose.connection.name}`);
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedforward';

  try {
    console.log(`[MongoDB] Connecting to local MongoDB at: ${mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] ✅ Database connected: ${conn.connection.name} on ${conn.connection.host}:${conn.connection.port}`);

    // Populate initial seed accounts/data if database is newly initialized
    await seedInitialData();

    return conn;
  } catch (error) {
    console.error(`[MongoDB] ❌ Connection error: ${error.message}`);
    console.error(`Please ensure local MongoDB Community Server is running on port 27017.`);
    throw error;
  }
};

module.exports = connectDB;
