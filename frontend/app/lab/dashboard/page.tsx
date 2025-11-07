"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestTubes, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"

interface LabTest {
  id: string
  patientName: string
  testName: string
  requestedDate: string
  status: "pending" | "in-progress" | "completed"
  doctorRequested: string
}

export default function LabDashboard() {
  const [userName, setUserName] = useState("Loading...")
  const [tests] = useState<LabTest[]>([
    {
      id: "LAB-001",
      patientName: "Sarah Davis",
      testName: "Complete Blood Count",
      requestedDate: "2024-11-22",
      status: "pending",
      doctorRequested: "Dr. Johnson",
    },
    {
      id: "LAB-002",
      patientName: "Michael Brown",
      testName: "Thyroid Panel",
      requestedDate: "2024-11-21",
      status: "in-progress",
      doctorRequested: "Dr. Rodriguez",
    },
    {
      id: "LAB-003",
      patientName: "David Lee",
      testName: "Lipid Profile",
      requestedDate: "2024-11-20",
      status: "completed",
      doctorRequested: "Dr. Chen",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Lab Technician")
  }, [])

  const navItems = [
    { icon: <TestTubes className="w-4 h-4" />, label: "Test Requests", href: "/lab/dashboard" },
    { icon: <FileText className="w-4 h-4" />, label: "Results", href: "/lab/results" },
    { icon: <AlertCircle className="w-4 h-4" />, label: "Alerts", href: "/lab/alerts" },
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
      <Sidebar userRole="lab-tech" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Laboratory Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage and process test requests</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="text-3xl font-bold text-foreground">{tests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {tests.filter((t) => t.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {tests.filter((t) => t.status === "in-progress").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {tests.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Requests */}
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{test.testName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(test.status)}`}
                      >
                        {getStatusIcon(test.status)}
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Patient: {test.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested by: {test.doctorRequested} • Date: {new Date(test.requestedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    {test.status === "pending" ? "Start" : test.status === "in-progress" ? "Update" : "View Results"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
