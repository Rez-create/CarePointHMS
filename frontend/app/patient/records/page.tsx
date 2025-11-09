"use client"

import { useEffect, useState } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar, User, Plus } from "lucide-react"

interface MedicalRecord {
  id: string
  date: string
  doctorName: string
  specialty: string
  diagnosis: string
  notes: string
  attachments: number
  type: string
}

export default function MedicalRecords() {
  const [userName, setUserName] = useState("Loading...")
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) return

        // Fetch patient name
        const patientResponse = await fetch('http://localhost:8000/api/patients/patients/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (patientResponse.ok) {
          const patient = await patientResponse.json()
          setUserName(`${patient.first_name} ${patient.last_name}`)
        }

        // Fetch records
        const recordsResponse = await fetch('http://localhost:8000/api/patients/patients/my_records/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (recordsResponse.ok) {
          const data = await recordsResponse.json()
          setRecords(data.results)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])



  return (
    <div className="flex">
      <PatientSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Medical Records</h1>
        <p className="text-muted-foreground mb-8">View and download your complete medical history</p>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{new Date(record.date).toLocaleDateString()}</span>
                        {record.type === 'appointment' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Appointment</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{record.doctorName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{record.specialty}</p>
                      <div className="bg-secondary/50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-foreground mb-1">{record.type === 'appointment' ? 'Status' : 'Diagnosis'}</p>
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
        )}
      </main>
    </div>
  )
}
