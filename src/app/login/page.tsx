"use client"

import { LoginForm } from "@/components/login-form";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      router.push("/")
    } catch {
      setError("Failed to login. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
          <div className="w-full max-w-md">
              <LoginForm onLoginSubmit={handleLogin} error={error} />
          </div>
      </div>
    </div>
  )
}