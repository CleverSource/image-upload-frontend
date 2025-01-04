import { Account, Client, Storage } from "appwrite";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client();

client.setEndpoint(process.env.API as string).setProject(process.env.PROJECT_ID as string)

export const account = new Account(client)
export const storage = new Storage(client)
export { ID } from "appwrite"