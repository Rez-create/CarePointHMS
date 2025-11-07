"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react"

interface DoctorAppointment {
  id: string
  patientName: string
  patientId: string
  time: string
  status: "pending" | "in-progress" | "completed"
  reason: string
  phone: string
}

export default function DoctorDashboard() {
  const [userName, setUserName] = useState("Loading...")
  const [todayAppointments, setTodayAppointments] = useState<DoctorAppointment[]>([
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      time: "09:00 AM",
      status: "completed",
      reason: "Regular checkup",
      phone: "555-0101",
    },
    {
      id: "2",
      patientName: "Emma Wilson",
      patientId: "P002",
      time: "10:30 AM",
      status: "in-progress",
      reason: "Follow-up consultation",
      phone: "555-0102",
    },
    {
      id: "3",
      patientName: "Robert Johnson",
      patientId: "P003",
      time: "02:00 PM",
      status: "pending",
      reason: "Chest pain evaluation",
      phone: "555-0103",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Doctor")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Schedule", href: "/doctor/dashboard" },
    { icon: <Users className="w-4 h-4" />, label: "My Patients", href: "/doctor/patients" },
    { icon: <AlertCircle className="w-4 h-4" />, label: "Lab Requests", href: "/doctor/lab-requests" },
    { icon: <Phone className="w-4 h-4" />, label: "Consultations", href: "/doctor/consultations" },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "in-progress") return <Clock className="w-4 h-4 text-blue-600" />
    return <AlertCircle className="w-4 h-4 text-yellow-600" />
  }

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-800"
    if (status === "in-progress") return "bg-blue-100 text-blue-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="doctor" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Today's Schedule</h1>
          <p className="text-muted-foreground">You have {todayAppointments.length} appointments today</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {todayAppointments.filter((a) => a.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {todayAppointments.filter((a) => a.status === "pending").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Appointments</h2>
          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <Card key={apt.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(apt.status)}`}
                        >
                          {getStatusIcon(apt.status)}
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {apt.phone}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {apt.status === "pending" ? "Start" : "View"}
                    </Button>
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
