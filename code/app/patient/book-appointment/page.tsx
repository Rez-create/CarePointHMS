"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Calendar, Clock, User, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AppointmentData {
  patientName: string
  email: string
  phone: string
  appointmentDate: string
  appointmentTime: string
  department: string
  doctor: string
  reasonForVisit: string
}

export default function BookAppointment() {
  const [formData, setFormData] = useState<AppointmentData>({
    patientName: "",
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

  const departments = ["General Medicine", "Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Dermatology"]

  const doctorsByDepartment: Record<string, string[]> = {
    "General Medicine": ["Dr. Smith", "Dr. Johnson"],
    Cardiology: ["Dr. Williams", "Dr. Brown"],
    Orthopedics: ["Dr. Davis", "Dr. Miller"],
    Pediatrics: ["Dr. Wilson", "Dr. Moore"],
    Neurology: ["Dr. Taylor", "Dr. Anderson"],
    Dermatology: ["Dr. Thomas", "Dr. Jackson"],
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset doctor selection when department changes
    if (name === "department") {
      setFormData((prev) => ({ ...prev, doctor: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate required fields
    if (
      !formData.patientName ||
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

    // Simulate booking
    setTimeout(() => {
      console.log("[v0] Appointment booked:", formData)
      localStorage.setItem("appointmentData", JSON.stringify(formData))
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
              <Calendar className="w-8 h-8 text-primary" />
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
                <Calendar className="w-5 h-5 text-primary-foreground" />
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
                  <User className="w-4 h-4" />
                  Your Information
                </h3>

                <div className="space-y-2">
                  <label htmlFor="patientName" className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="John Doe"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                    required
                  />
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
              </div>

              {/* Appointment Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
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
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                  <Heart className="w-4 h-4" />
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
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-border text-foreground bg-transparent">
                    Cancel
                  </Button>
                </Link>
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
  )
}
