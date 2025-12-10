import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL;
const dbName = "Todo-List";
export const collectionName = "todo-tasks";

const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  return connect.db(dbName);
};
