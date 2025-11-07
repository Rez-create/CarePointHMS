"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Plus, Phone, Mail, UserIcon } from "lucide-react"

export default function RegisterPatient() {
  const [userName, setUserName] = useState("Loading...")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Staff")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Patient Queue", href: "/staff/dashboard" },
    { icon: <UserIcon className="w-4 h-4" />, label: "Register Patient", href: "/staff/register" },
    { icon: <Phone className="w-4 h-4" />, label: "Appointment Scheduler", href: "/staff/scheduler" },
    { icon: <Mail className="w-4 h-4" />, label: "Billing", href: "/staff/billing" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        emergencyContact: "",
      })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="flex">
      <Sidebar userRole="staff" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-8">Register New Patient</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">First Name</label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Last Name</label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@email.com"
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Phone</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="555-0100"
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Date of Birth</label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="bg-input border-border text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-input border border-border text-foreground rounded-md"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Address</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, City"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Emergency Contact</label>
                    <Input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="555-0101"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Register Patient
                    </Button>
                    <Button type="button" variant="outline" className="border-border bg-transparent">
                      Clear
                    </Button>
                  </div>
                </form>

                {submitted && (
                  <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                    Patient registered successfully! ID: PAT-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Registrations */}
          <div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Sarah Johnson", "Michael Brown", "Jennifer Lee", "David Chen"].map((name, idx) => (
                    <div key={idx} className="p-3 bg-secondary/50 rounded">
                      <p className="font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        Registered today at {String(9 + idx).padStart(2, "0")}:{String(idx * 15).padStart(2, "0")} AM
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
