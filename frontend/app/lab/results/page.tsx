"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestTubes, Download, Eye, FileText } from "lucide-react"

interface LabResult {
  id: string
  patientName: string
  testName: string
  testDate: string
  resultDate: string
  status: "normal" | "abnormal" | "critical"
  notes: string
  resultFile: string
}

export default function LabResults() {
  const [userName, setUserName] = useState("Loading...")
  const [results] = useState<LabResult[]>([
    {
      id: "RES-001",
      patientName: "Sarah Davis",
      testName: "Complete Blood Count",
      testDate: "2024-11-22",
      resultDate: "2024-11-23",
      status: "normal",
      notes: "All values within normal range",
      resultFile: "CBC_Result_001.pdf",
    },
    {
      id: "RES-002",
      patientName: "Michael Brown",
      testName: "Thyroid Panel",
      testDate: "2024-11-21",
      resultDate: "2024-11-23",
      status: "abnormal",
      notes: "TSH slightly elevated. Recommend endocrinology consultation.",
      resultFile: "Thyroid_Result_002.pdf",
    },
    {
      id: "RES-003",
      patientName: "David Lee",
      testName: "Lipid Profile",
      testDate: "2024-11-20",
      resultDate: "2024-11-22",
      status: "normal",
      notes: "Cholesterol levels acceptable",
      resultFile: "Lipid_Result_003.pdf",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Lab Technician")
  }, [])

  const navItems = [
    { icon: <TestTubes className="w-4 h-4" />, label: "Test Requests", href: "/lab/dashboard" },
    { icon: <FileText className="w-4 h-4" />, label: "Results", href: "/lab/results" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "normal") return "bg-green-100 text-green-800"
    if (status === "abnormal") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="lab-tech" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Test Results</h1>
        <p className="text-muted-foreground mb-8">View and manage completed test results</p>

        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{result.testName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(result.status)}`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Patient: {result.patientName}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                      <div>
                        <p className="text-xs font-medium">Test Date</p>
                        <p>{new Date(result.testDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Result Date</p>
                        <p>{new Date(result.resultDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Clinical Notes</p>
                      <p className="text-sm text-foreground">{result.notes}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-border bg-transparent">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Download className="w-4 h-4" />
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
