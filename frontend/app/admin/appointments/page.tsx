"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, Users, Edit, Trash2 } from "lucide-react"

interface AdminAppointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  type: string
}

export default function AdminAppointments() {
  const [userName, setUserName] = useState("Loading...")
  const [appointments] = useState<AdminAppointment[]>([
    {
      id: "APT-001",
      patientName: "John Smith",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-11-25",
      time: "10:00 AM",
      status: "scheduled",
      type: "Cardiology Checkup",
    },
    {
      id: "APT-002",
      patientName: "Emma Wilson",
      doctorName: "Dr. Michael Chen",
      date: "2024-11-26",
      time: "2:30 PM",
      status: "scheduled",
      type: "General Consultation",
    },
    {
      id: "APT-003",
      patientName: "Robert Johnson",
      doctorName: "Dr. Emily Rodriguez",
      date: "2024-11-20",
      time: "11:00 AM",
      status: "completed",
      type: "Endocrinology Follow-up",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Admin")
  }, [])

  const navItems = [
    { icon: <Users className="w-4 h-4" />, label: "User Management", href: "/admin/dashboard" },
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/admin/appointments" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Reports", href: "/admin/reports" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "scheduled") return "bg-blue-100 text-blue-800"
    if (status === "completed") return "bg-green-100 text-green-800"
    if (status === "cancelled") return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="admin" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointment Management</h1>
        <p className="text-muted-foreground mb-8">Monitor and manage all hospital appointments</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-foreground">{appointments.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-3xl font-bold text-blue-600">
                {appointments.filter((a) => a.status === "scheduled").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "completed").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">
                {appointments.filter((a) => a.status === "cancelled").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Patient</th>
                    <th className="text-left p-3 font-semibold text-foreground">Doctor</th>
                    <th className="text-left p-3 font-semibold text-foreground">Type</th>
                    <th className="text-left p-3 font-semibold text-foreground">Date & Time</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="p-3 text-foreground">{apt.patientName}</td>
                      <td className="p-3 text-muted-foreground">{apt.doctorName}</td>
                      <td className="p-3 text-muted-foreground">{apt.type}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(apt.date).toLocaleDateString()} {apt.time}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border bg-transparent">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
