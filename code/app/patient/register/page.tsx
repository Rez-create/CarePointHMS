"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, User, Mail, Phone, MapPin, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  zipCode: string
  medicalHistory: string
}

export default function PatientRegister() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    zipCode: "",
    medicalHistory: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Simulate registration
    setTimeout(() => {
      console.log("[v0] Registration submitted:", formData)
      localStorage.setItem("patientData", JSON.stringify(formData))
      setSuccess(true)
      setLoading(false)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="border-border shadow-lg max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
              <p className="text-muted-foreground">Your patient profile has been created. Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <Link href="/" className="inline-block mb-8">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">Patient Registration</CardTitle>
                <CardDescription>Create your patient profile at CarePoint Hospital</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 bg-input border-border text-foreground"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 bg-input border-border text-foreground"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="pl-10 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium text-foreground">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-foreground">
                    Street Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-foreground">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Medical City"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zipCode" className="text-sm font-medium text-foreground">
                      Zip Code
                    </label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="12345"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Medical History
                </h3>
                <div className="space-y-2">
                  <label htmlFor="medicalHistory" className="text-sm font-medium text-foreground">
                    Please mention any previous medical conditions, allergies, or medications
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    placeholder="e.g., Diabetes, Penicillin allergy..."
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-border text-foreground bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
