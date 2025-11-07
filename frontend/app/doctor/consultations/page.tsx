"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Phone, FileText, Plus, Video } from "lucide-react"

interface Consultation {
  id: string
  patientName: string
  date: string
  time: string
  type: "in-person" | "video"
  status: "scheduled" | "completed" | "cancelled"
  notes: string
  prescription?: string
}

export default function Consultations() {
  const [userName, setUserName] = useState("Loading...")
  const [consultations] = useState<Consultation[]>([
    {
      id: "CONS-001",
      patientName: "John Smith",
      date: "2024-11-25",
      time: "10:00 AM",
      type: "in-person",
      status: "scheduled",
      notes: "Follow-up for hypertension management",
    },
    {
      id: "CONS-002",
      patientName: "Emma Wilson",
      date: "2024-11-26",
      time: "2:30 PM",
      type: "video",
      status: "scheduled",
      notes: "Initial consultation for asthma evaluation",
    },
    {
      id: "CONS-003",
      patientName: "Robert Johnson",
      date: "2024-11-20",
      time: "11:00 AM",
      type: "in-person",
      status: "completed",
      notes: "Cardiac assessment",
      prescription: "Aspirin 81mg daily",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Doctor")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Schedule", href: "/doctor/dashboard" },
    { icon: <Users className="w-4 h-4" />, label: "My Patients", href: "/doctor/patients" },
    { icon: <Phone className="w-4 h-4" />, label: "Consultations", href: "/doctor/consultations" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-800"
    if (status === "scheduled") return "bg-blue-100 text-blue-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="doctor" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Consultations</h1>
            <p className="text-muted-foreground">Manage your consultations</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            Schedule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Consultations</p>
                <p className="text-3xl font-bold text-foreground">{consultations.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">
                  {consultations.filter((c) => c.status === "scheduled").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {consultations.filter((c) => c.status === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{consultation.patientName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(consultation.status)}`}
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                      {consultation.type === "video" && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          <Video className="w-3 h-3" />
                          Video
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(consultation.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {consultation.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Notes:</strong> {consultation.notes}
                    </p>
                    {consultation.prescription && (
                      <div className="bg-secondary/50 p-2 rounded">
                        <p className="text-xs font-medium text-muted-foreground">Prescription:</p>
                        <p className="text-sm text-foreground">{consultation.prescription}</p>
                      </div>
                    )}
                  </div>
                  {consultation.status === "scheduled" ? (
                    <Button className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground">Start</Button>
                  ) : (
                    <Button variant="outline" className="ml-4 border-border bg-transparent">
                      <FileText className="w-4 h-4 mr-1" />
                      View Record
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
