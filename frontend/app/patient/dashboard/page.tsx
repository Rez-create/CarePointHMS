"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, FileText, Pill, Heart, LogOut, User } from "lucide-react"
import { PatientSidebar } from "@/components/patient-sidebar"

interface Appointment {
  id: string
  doctorName: string
  type?: string
  date: string
  status?: string
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  doctor: string
  date: string
}

interface HealthRecord {
  date: string
  type: string
  description: string
  doctor: string
}

interface HealthMetric {
  name: string
  value: string
  date: string
}

export default function PatientDashboard() {
  const [userName, setUserName] = useState("Patient")
  const [nextAppointment, setNextAppointment] = useState({
    doctorName: "Dr. Andrew",
    date: "20th October",
  })
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "Dr. Andrew",
      type: "General Checkup",
      date: "20th October",
      status: "Scheduled"
    },
    {
      id: "2",
      doctorName: "Dr. Sarah",
      type: "Follow-up",
      date: "25th October",
      status: "Pending"
    }
  ])

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      medication: "Amoxicillin",
      dosage: "500mg twice daily",
      doctor: "Dr. Andrew",
      date: "15th October"
    },
    {
      id: "2",
      medication: "Ibuprofen",
      dosage: "400mg as needed",
      doctor: "Dr. Sarah",
      date: "18th October"
    }
  ])

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      date: "15th October",
      type: "Blood Test",
      description: "Regular checkup",
      doctor: "Dr. Andrew"
    },
    {
      date: "10th October",
      type: "X-Ray",
      description: "Chest examination",
      doctor: "Dr. Sarah"
    }
  ])

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      name: "Blood Pressure",
      value: "120/80",
      date: "Today"
    },
    {
      name: "Weight",
      value: "75 kg",
      date: "Yesterday"
    }
  ])

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) return

        const response = await fetch('http://localhost:8000/api/patients/patients/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const patient = await response.json()
          setUserName(`${patient.first_name} ${patient.last_name}`)
        }
      } catch (error) {
        console.error('Failed to fetch patient data:', error)
      }
    }

    fetchPatientData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    window.location.href = '/login'
  }



  return (
    <div className="flex">
      <PatientSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome to your dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="gap-2 border-border text-foreground hover:bg-secondary"
          >
            Logout
          </Button>
        </div>

        {/* Next Appointment Alert */}
        <div className="mb-6 flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-foreground">
            Hello {userName}, Your next appointment is due {nextAppointment.date} by {nextAppointment.doctorName}
          </p>
          <Button 
            onClick={() => window.location.href = '/patient/book-appointment'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Book New Appointment
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center text-lg font-semibold">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{apt.doctorName}</p>
                          <p className="text-sm text-muted-foreground">{apt.type}</p>
                          <p className="text-sm text-muted-foreground">{apt.date}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center text-lg font-semibold">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {prescriptions.length > 0 ? (
                <div className="space-y-3">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-3 border border-gray-200 rounded-lg">
                      <p className="font-medium text-foreground">{rx.medication}</p>
                      <p className="text-sm text-muted-foreground">{rx.dosage}</p>
                      <p className="text-xs text-muted-foreground">By {rx.doctor} - {rx.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No active prescriptions
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Health Records */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center text-lg font-semibold">Recent Health Records</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {healthRecords.length > 0 ? (
                <div className="space-y-3">
                  {healthRecords.map((record, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="font-medium text-foreground">{record.type}</p>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
                      <p className="text-xs text-muted-foreground">By {record.doctor} - {record.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No health records available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center text-lg font-semibold">Health Metrics</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {healthMetrics.length > 0 ? (
                <div className="space-y-3">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-foreground">{metric.name}</p>
                        <p className="text-lg font-bold text-primary">{metric.value}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No health metrics available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}