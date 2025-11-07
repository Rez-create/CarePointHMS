"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Lock, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

type UserRole = "patient" | "doctor" | "admin" | "staff" | "pharmacist" | "lab-tech"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate login - in production, call backend API
    setTimeout(() => {
      if (email && password) {
        // Store user session
        localStorage.setItem("userRole", role)
        localStorage.setItem("userEmail", email)

        // Redirect to appropriate dashboard
        const dashboards: Record<UserRole, string> = {
          patient: "/patient/dashboard",
          doctor: "/doctor/dashboard",
          admin: "/admin/dashboard",
          staff: "/staff/dashboard",
          pharmacist: "/pharmacy/dashboard",
          "lab-tech": "/lab/dashboard",
        }

        window.location.href = dashboards[role]
      } else {
        setError("Please enter email and password")
      }
      setLoading(false)
    }, 800)
  }

  const roles: Array<{ value: UserRole; label: string; description: string }> = [
    { value: "patient", label: "Patient", description: "Book appointments, view medical records" },
    { value: "doctor", label: "Doctor", description: "Manage appointments, prescribe medications" },
    { value: "admin", label: "Administrator", description: "System oversight and management" },
    { value: "staff", label: "Receptionist", description: "Patient registration and scheduling" },
    { value: "pharmacist", label: "Pharmacist", description: "Manage prescriptions and inventory" },
    { value: "lab-tech", label: "Lab Technician", description: "Process and record lab tests" },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      {/* Back Button */}
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Brand Section */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                <img src="/logo.png" alt="CarePoint Logo" className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CarePoint</h1>
                <p className="text-sm text-muted-foreground">Hospital Management System</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground leading-tight">Advanced Healthcare Solutions</h2>
              <p className="text-muted-foreground">
                Welcome to CarePoint HMS - where cutting-edge technology meets compassionate care. We provide a comprehensive
                suite of tools for seamless healthcare delivery and management.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Smart Appointment Scheduling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Enhanced Patient Care Records
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Unified Medical Services Platform
                </li>
              </ul>
            </div>
          </div>

          {/* Login Form */}
          <div>
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Welcome to CarePoint</CardTitle>
                <CardDescription>Sign in with your credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Select Role</label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {roles.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            role === r.value
                              ? "border-primary bg-secondary text-foreground"
                              : "border-border hover:border-accent text-foreground"
                          }`}
                        >
                          <div className="font-medium text-sm">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  {/* Demo Credentials */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
                    <div className="space-y-1 text-xs font-mono bg-secondary/50 p-2 rounded text-foreground">
                      <p>Email: demo@hospital.com</p>
                      <p>Password: demo123</p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
