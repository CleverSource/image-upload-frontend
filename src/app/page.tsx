"use client"

import { Dashboard } from "@/components/dashboard";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto mt-8 px-4">
        {user ? <Dashboard /> : <div>Not logged in</div>}
      </main>
    </div>
  )
}
