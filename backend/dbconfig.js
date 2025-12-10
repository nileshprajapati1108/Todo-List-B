import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
export const collectionName = process.env.COLLECTION_NAME;

const Client = new MongoClient(url);

export const connection = async () => {
  const connect = await Client.connect();
  return await connect.db(dbName);
};
