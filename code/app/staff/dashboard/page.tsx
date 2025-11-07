"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, User, Phone, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react"

interface QueueItem {
  id: string
  patientName: string
  registrationTime: string
  status: "waiting" | "registered" | "called"
  doctorAssigned?: string
}

export default function StaffDashboard() {
  const [userName, setUserName] = useState("Loading...")
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "1",
      patientName: "Alice Brown",
      registrationTime: "09:15 AM",
      status: "waiting",
    },
    {
      id: "2",
      patientName: "David Miller",
      registrationTime: "09:35 AM",
      status: "waiting",
    },
    {
      id: "3",
      patientName: "Sarah Davis",
      registrationTime: "09:50 AM",
      status: "called",
      doctorAssigned: "Dr. Johnson",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Staff")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Patient Queue", href: "/staff/dashboard" },
    { icon: <User className="w-4 h-4" />, label: "Register Patient", href: "/staff/register" },
    { icon: <Phone className="w-4 h-4" />, label: "Appointment Scheduler", href: "/staff/scheduler" },
    { icon: <MapPin className="w-4 h-4" />, label: "Billing", href: "/staff/billing" },
  ]

  return (
    <div className="flex">
      <Sidebar userRole="staff" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Front Desk Operations</h1>
            <p className="text-muted-foreground">Manage patient flow and registrations</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            Register Patient
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Waiting</p>
                <p className="text-3xl font-bold text-foreground">
                  {queue.filter((q) => q.status === "waiting").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Being Served</p>
                <p className="text-3xl font-bold text-foreground">
                  {queue.filter((q) => q.status === "called").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Today's Registrations</p>
                <p className="text-3xl font-bold text-foreground">{queue.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Patient Queue</h2>
            <div className="space-y-2">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.status === "waiting" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{item.patientName}</h3>
                        {item.status === "called" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Registered: {item.registrationTime}
                        </div>
                        {item.doctorAssigned && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {item.doctorAssigned}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {item.status === "waiting" ? "Call" : "Complete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
