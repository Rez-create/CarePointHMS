"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

interface AppointmentData {
  firstName: string
  lastName: string
  email: string
  phone: string
  appointmentDate: string
  appointmentTime: string
  department: string
  doctor: string
  reasonForVisit: string
}

export default function BookAppointment() {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [formData, setFormData] = useState<AppointmentData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    department: "",
    doctor: "",
    reasonForVisit: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [doctors, setDoctors] = useState<{id: number, name: string, specialization: string}[]>([])

  useEffect(() => {
    // Check if user is logged in as patient
    const userType = localStorage.getItem('user_type')
    if (userType !== 'patient') {
      setShowRegistrationDialog(true)
    }

    // Fetch doctors from API
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/patients/patients/doctors/')
      const data = await response.json()
      if (response.ok) {
        setDoctors(data.results)
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
    }
  }

  const departments = [...new Set(doctors.map(doc => doc.specialization))]
  const doctorsByDepartment = doctors.reduce((acc, doctor) => {
    if (!acc[doctor.specialization]) {
      acc[doctor.specialization] = []
    }
    acc[doctor.specialization].push(doctor.name)
    return acc
  }, {} as Record<string, string[]>)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset doctor selection when department changes
    if (name === "department") {
      setFormData((prev) => ({ ...prev, doctor: "" }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/patients/patients/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store tokens and user data
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_type', data.user_type)
      
      // Close dialogs and allow booking
      setShowRegistrationDialog(false)
      setShowLoginForm(false)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.department ||
      !formData.doctor
    ) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/patients/patients/book_appointment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          department: formData.department,
          doctor: formData.doctor,
          reasonForVisit: formData.reasonForVisit
        })
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/patient/appointments"
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to book appointment')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="border-border shadow-lg max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Booked!</h2>
              <p className="text-muted-foreground">
                Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  const availableDoctors =
    formData.department && doctorsByDepartment[formData.department] ? doctorsByDepartment[formData.department] : []

  return (
    <>
      {/* Registration Check Dialog */}
      <Dialog open={showRegistrationDialog && !showLoginForm} onOpenChange={setShowRegistrationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Patient Registration Required
            </DialogTitle>
            <DialogDescription>
              To book an appointment, you need to be registered as a patient. Are you already registered?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={() => setShowLoginForm(true)} className="w-full gap-2">
              Yes
            </Button>
            <Link href="/patient/register" className="w-full">
              <Button variant="outline" className="w-full gap-2">
                No
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Login Dialog */}
      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Patient Sign In
            </DialogTitle>
            <DialogDescription>
              Sign in to your patient account to book an appointment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="loginEmail" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="patient@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="loginPassword" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loginLoading} className="flex-1">
                {loginLoading ? "Signing in..." : "Sign In"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLoginForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <main className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">

      <div className="max-w-2xl mx-auto">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">Book an Appointment</CardTitle>
                <CardDescription>Schedule your visit at CarePoint Hospital</CardDescription>
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

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Your Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="first name"
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
                      placeholder="last name"
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
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
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
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+254 7** *** ***"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 bg-input border-border text-foreground"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Appointment Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="appointmentDate" className="text-sm font-medium text-foreground">
                      Appointment Date *
                    </label>
                    <Input
                      id="appointmentDate"
                      name="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="appointmentTime" className="text-sm font-medium text-foreground">
                      Appointment Time *
                    </label>
                      <Input
                        id="appointmentTime"
                        name="appointmentTime"
                        type="time"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="pl-10 bg-input border-border text-foreground"
                        required
                      />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium text-foreground">
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="doctor" className="text-sm font-medium text-foreground">
                      Doctor *
                    </label>
                    <select
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      required
                      disabled={!formData.department}
                    >
                      <option value="">{formData.department ? "Select Doctor" : "Select department first"}</option>
                      {availableDoctors.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <label htmlFor="reasonForVisit" className="text-sm font-medium text-foreground">
                    Reason for Visit
                  </label>
                  <textarea
                    id="reasonForVisit"
                    name="reasonForVisit"
                    placeholder="Please describe your symptoms or reason for the visit..."
                    value={formData.reasonForVisit}
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
                  {loading ? "Booking..." : "Book Appointment"}
                </Button>
                <Button 
                  type="button"
                  onClick={() => window.history.back()}
                  variant="outline" 
                  className="flex-1 border-border text-foreground bg-transparent"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Already registered?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in to your account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      </main>
    </>
  )
}
