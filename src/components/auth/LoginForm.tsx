"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await signIn("email", { email, redirect: false })
      if (res?.error) {
        setStatus("error")
      } else {
        setStatus("success")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We sent a magic link to {email}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email to receive a magic link</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
              disabled={status === "loading"}
            />
          </div>
          {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
