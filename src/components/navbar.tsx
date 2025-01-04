import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-background text-foreground shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          Image Uploader
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <>
              <span>{user.email}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Account</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : <Link href="/login"><Button variant="link">Login</Button></Link>}
        </div>
      </div>
    </nav>
  )
}