"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Heart, Pill, Clock, MapPin, Plus } from "lucide-react"

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  location: string
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
}

export default function PatientDashboard() {
  const [userName, setUserName] = useState("Loading...")
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-12-15",
      time: "10:00 AM",
      status: "confirmed",
      location: "Room 301",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      specialty: "General Practitioner",
      date: "2024-12-20",
      time: "2:30 PM",
      status: "scheduled",
      location: "Room 102",
    },
  ])

  const [prescriptions] = useState<Prescription[]>([
    {
      id: "1",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
    },
    {
      id: "2",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2024-10-15",
      endDate: "2025-01-15",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Patient")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/patient/dashboard" },
    { icon: <FileText className="w-4 h-4" />, label: "Medical Records", href: "/patient/records" },
    { icon: <Pill className="w-4 h-4" />, label: "Prescriptions", href: "/patient/prescriptions" },
    { icon: <Heart className="w-4 h-4" />, label: "Health Data", href: "/patient/health" },
    { icon: <FileText className="w-4 h-4" />, label: "Billing", href: "/patient/billing" },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="patient" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-foreground">2</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-foreground">{prescriptions.length}</p>
                </div>
                <Pill className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Check-up</p>
                  <p className="text-lg font-bold text-foreground">12 days ago</p>
                </div>
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">My Appointments</h2>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{apt.doctorName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{apt.specialty}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <MapPin className="w-4 h-4" />
                          {apt.location}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="ml-4 border-border text-foreground hover:bg-secondary bg-transparent"
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prescriptions Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Active Prescriptions</h2>
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <Card key={rx.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{rx.medication}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rx.dosage} - {rx.frequency}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Valid until {new Date(rx.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Pill className="w-5 h-5 text-accent" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
