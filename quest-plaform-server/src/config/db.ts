import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '../utils/logger';

let mongod: MongoMemoryServer | undefined;
let session: mongoose.ClientSession | undefined;

export const connect = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create();
    } else {
      mongod = await MongoMemoryServer.create({
        instance: { dbPath: './src/db-data' }
      });
    }
    const uri = mongod.getUri();
    const mongooseOpts: mongoose.ConnectOptions = {};

    await mongoose.connect(uri, mongooseOpts);

    session = await mongoose.startSession();
  } catch (error) {
    logger.error('Error connecting to database:', error);
  }
};

export const closeSession = async (): Promise<void> => {
  if (session) {
    session.endSession();
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (mongod) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
    }
  } catch (error) {
    logger.error('Error closing database:', error);
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    if (mongod) {
      const collections = mongoose.connection.collections;

      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    logger.error('Error clearing database:', error);
  }
};
