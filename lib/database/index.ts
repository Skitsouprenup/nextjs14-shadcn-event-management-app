'use server'

import mongoose from 'mongoose';

const MONGO_DB_URI = process.env.MONGO_DB_URI;

if (!MONGO_DB_URI) {
  throw new Error("Please define the MONGO_DB_URI environment variable inside .env.local");
}

let cached:{ conn: unknown, promise: unknown } = (global as any).mongoose = { conn: null, promise: null };

async function connectDB() {

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    //Cache connection because we don't want our app to create new connection
    //every time we access a database in serverless environment. Remember that
    //serverless environment executes its functions everytime it's requested
    //unlike in serverful server where the server and its functions run
    //continuously on the background.
    cached.promise = mongoose.connect(MONGO_DB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;