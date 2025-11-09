"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Lock, Mail, ArrowLeft, Users, UserCheck } from "lucide-react"
import Link from "next/link"

type UserRole = "patient" | "doctor" | "admin" | "staff" | "pharmacist" | "lab-tech"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginType, setLoginType] = useState<"staff" | "patient">("staff")
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('registered') === 'true') {
      setShowSuccess(true)
      setLoginType('patient')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = loginType === 'staff' 
        ? 'http://localhost:8000/api/auth/staff/login/'
        : 'http://localhost:8000/api/patients/patients/login/';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens and user data
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_type', data.user_type);
      
      // Redirect based on user type
      if (data.user_type === 'patient') {
        window.location.href = '/patient/dashboard';
      } else {
        const userRole = data.user.role as UserRole;
        localStorage.setItem('userRole', userRole);

        const dashboards: Record<UserRole, string> = {
          patient: "/patient/dashboard",
          doctor: "/doctor/dashboard",
          admin: "/admin/dashboard",
          staff: "/staff/dashboard",
          pharmacist: "/pharmacy/dashboard",
          "lab-tech": "/lab/dashboard",
        };

        window.location.href = dashboards[userRole] || "/staff/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
                <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "staff" | "patient")} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="staff" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Staff Login
                    </TabsTrigger>
                    <TabsTrigger value="patient" className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Patient Login
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleLogin} className="space-y-6">
                  {showSuccess && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <AlertDescription>Registration successful! Please sign in with your credentials.</AlertDescription>
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

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
                        placeholder={loginType === 'staff' ? "staff@hospital.com" : "patient@email.com"}
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
                    {loading ? "Signing in..." : `Sign In as ${loginType === 'staff' ? 'Staff' : 'Patient'}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
