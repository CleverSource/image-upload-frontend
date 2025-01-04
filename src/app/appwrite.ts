import { Account, Client, Storage } from "appwrite";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client();

client.setEndpoint(process.env.NEXT_PUBLIC_API as string).setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string)

export const account = new Account(client)
export const storage = new Storage(client)
export { ID } from "appwrite"