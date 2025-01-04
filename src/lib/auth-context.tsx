"use client"

import { account } from "@/app/appwrite"
import { Models } from "appwrite"
import { useRouter } from "next/navigation"
import React, { createContext, useContext, useEffect, useState } from "react"

type User = Models.User<Models.Preferences>

type AuthContextType = {
  user: User | null,
  login: (email: string, password: string) => Promise<void>,
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    account.get().then((storedUser) => {
      setUser(storedUser);
    }, () => {
      setUser(null);
    })
  }, [])

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password)
    account.get().then((storedUser) => {
      setUser(storedUser);
    }, () => {
      setUser(null);
    })
  }

  const logout = async () => {
    await account.deleteSession("current")
    setUser(null)
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
      throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}