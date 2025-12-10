import { MongoClient } from "mongodb";


const url="mongodb+srv://nileshprajapati1108:Test1234@cluster0.kzdizcf.mongodb.net/?appName=Cluster0";
const dbName="Todo-List";
export const collectionName="todo-tasks";

const  Client=new MongoClient(url);

export const connection=async()=>{

  const connect=await Client.connect();
  return await connect.db(dbName);
}