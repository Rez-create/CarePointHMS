"use client"

import { useEffect, useState } from "react"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, CheckCircle, AlertCircle, Phone, Eye } from "lucide-react"

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
  const [todayAppointments, setTodayAppointments] = useState<DoctorAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        
        // Fetch doctor appointments
        const response = await fetch('http://localhost:8000/api/patients/patients/doctor_appointments/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setTodayAppointments(data.results)
        }
        
        // Set doctor name from token or default
        const email = localStorage.getItem("userEmail")
        setUserName(email || "Doctor")
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/patients/patients/update_appointment_status/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          status: newStatus
        })
      })
      
      if (response.ok) {
        setTodayAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
          )
        )
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment(prev => prev ? { ...prev, status: newStatus as any } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const openAppointmentModal = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    window.location.href = '/login'
  }



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
      <DoctorSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Appointments</h1>
            <p className="text-muted-foreground">You have {todayAppointments.length} appointments scheduled</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="gap-2 border-border text-foreground hover:bg-secondary"
          >
            Logout
          </Button>
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments scheduled</p>
            </div>
          ) : (
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
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openAppointmentModal(apt)}
                        className="border-border bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Appointment Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{selectedAppointment.patientName}</p>
                <p className="text-sm text-muted-foreground">ID: {selectedAppointment.patientId}</p>
              </div>
              <div>
                <p className="text-sm"><strong>Time:</strong> {selectedAppointment.time}</p>
                <p className="text-sm"><strong>Phone:</strong> {selectedAppointment.phone}</p>
                <p className="text-sm"><strong>Reason:</strong> {selectedAppointment.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Update Status:</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedAppointment.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedAppointment.id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedAppointment.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedAppointment.id, 'in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedAppointment.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
