import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connection = async () => {
  const mongodb = await MongoMemoryServer.create();
  const uri = mongodb.getUri();

  const db = await mongoose.connect(uri);

  console.log("Database connected");
  return db;
};

export default connection;
