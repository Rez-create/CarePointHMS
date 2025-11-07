"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, TestTubes, Plus, Eye, Trash2 } from "lucide-react"

interface LabRequest {
  id: string
  patientName: string
  testName: string
  requestDate: string
  status: "pending" | "in-progress" | "completed"
  reason: string
  resultAvailable: boolean
}

export default function LabRequests() {
  const [userName, setUserName] = useState("Loading...")
  const [requests] = useState<LabRequest[]>([
    {
      id: "LAB-REQ-001",
      patientName: "John Smith",
      testName: "Complete Blood Count",
      requestDate: "2024-11-20",
      status: "completed",
      reason: "Regular checkup",
      resultAvailable: true,
    },
    {
      id: "LAB-REQ-002",
      patientName: "Emma Wilson",
      testName: "Thyroid Panel",
      requestDate: "2024-11-21",
      status: "in-progress",
      reason: "Fatigue evaluation",
      resultAvailable: false,
    },
    {
      id: "LAB-REQ-003",
      patientName: "Robert Johnson",
      testName: "Lipid Profile",
      requestDate: "2024-11-22",
      status: "pending",
      reason: "Cardiovascular risk assessment",
      resultAvailable: false,
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Doctor")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Schedule", href: "/doctor/dashboard" },
    { icon: <Users className="w-4 h-4" />, label: "My Patients", href: "/doctor/patients" },
    { icon: <TestTubes className="w-4 h-4" />, label: "Lab Requests", href: "/doctor/lab-requests" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-800"
    if (status === "in-progress") return "bg-blue-100 text-blue-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="doctor" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lab Requests</h1>
            <p className="text-muted-foreground">Manage and review lab test requests</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground">{requests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Results Available</p>
                <p className="text-3xl font-bold text-primary">{requests.filter((r) => r.resultAvailable).length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{request.testName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.resultAvailable && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          Result Ready
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Patient: {request.patientName}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {request.resultAvailable && (
                      <Button size="sm" variant="outline" className="border-border bg-transparent">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
