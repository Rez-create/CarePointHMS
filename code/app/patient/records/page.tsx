"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar, User, Pill } from "lucide-react"

interface MedicalRecord {
  id: string
  date: string
  doctorName: string
  specialty: string
  diagnosis: string
  notes: string
  attachments: number
}

export default function MedicalRecords() {
  const [userName, setUserName] = useState("Loading...")
  const [records] = useState<MedicalRecord[]>([
    {
      id: "1",
      date: "2024-11-20",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      diagnosis: "Hypertension - Controlled",
      notes: "Blood pressure readings stable. Continue current medication regimen.",
      attachments: 2,
    },
    {
      id: "2",
      date: "2024-10-15",
      doctorName: "Dr. Michael Chen",
      specialty: "General Practitioner",
      diagnosis: "Type 2 Diabetes Mellitus",
      notes: "HbA1c levels improved. Lifestyle modifications recommended.",
      attachments: 3,
    },
    {
      id: "3",
      date: "2024-09-10",
      doctorName: "Dr. Emily Rodriguez",
      specialty: "Endocrinology",
      diagnosis: "Thyroid Disorder - Hypothyroidism",
      notes: "TSH levels within normal range. Continue levothyroxine therapy.",
      attachments: 1,
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
    { icon: <User className="w-4 h-4" />, label: "Health Data", href: "/patient/health" },
    { icon: <FileText className="w-4 h-4" />, label: "Billing", href: "/patient/billing" },
  ]

  return (
    <div className="flex">
      <Sidebar userRole="patient" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Medical Records</h1>
        <p className="text-muted-foreground mb-8">View and download your complete medical history</p>

        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{record.doctorName}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{record.specialty}</p>
                    <div className="bg-secondary/50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-foreground mb-1">Diagnosis</p>
                      <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {record.notes}
                    </p>
                    {record.attachments > 0 && (
                      <p className="text-xs text-accent mt-2">
                        {record.attachments} attachment{record.attachments !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-border bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Download className="w-4 h-4 mr-1" />
                      Download
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
