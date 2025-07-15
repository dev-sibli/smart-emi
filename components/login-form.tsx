"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // This is a mock authentication - in a real app, you would call an API
    setTimeout(() => {
      setIsLoading(false)

      // Mock login logic - in a real app, this would be handled by your auth provider
      if (email.includes("admin")) {
        toast({
          title: "Welcome back, Admin!",
          description: "You have successfully logged in to the admin dashboard.",
        })
        router.push("/admin/dashboard")
      } else if (email.includes("merchant") || email.includes("user")) {
        toast({
          title: "Welcome back, Merchant!",
          description: "You have successfully logged in to your merchant dashboard.",
        })
        router.push("/merchant/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <form onSubmit={onSubmit}>
        <CardHeader className="space-y-1 px-0 lg:px-6">
          <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-0 lg:px-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
                className="pl-10"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                required
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Forgot password?
            </button>
          </div>
        </CardContent>
        <CardFooter className="px-0 lg:px-6">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
