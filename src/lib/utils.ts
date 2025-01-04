import { account } from "@/app/appwrite"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function login(email: string, password: string) {
  return await account.createEmailPasswordSession(email, password)
}