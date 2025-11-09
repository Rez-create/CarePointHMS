"use client"

import { useEffect, useState } from "react"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar, Phone, FileText, Plus, Video } from "lucide-react"

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
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patient_id: '',
    date: '',
    time: '',
    notes: ''
  })
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [showRecordModal, setShowRecordModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        
        // Fetch consultations
        const consultationsResponse = await fetch('http://localhost:8000/api/appointments/consultations/doctor_consultations/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (consultationsResponse.ok) {
          const data = await consultationsResponse.json()
          setConsultations(data.results)
        }
        
        // Fetch patients for dropdown
        const patientsResponse = await fetch('http://localhost:8000/api/patients/patients/doctor_patients/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json()
          setPatients(patientsData.results)
        }
        
        const email = localStorage.getItem("userEmail")
        setUserName(email || "Doctor")
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/appointments/consultations/create_consultation/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowModal(false)
        setFormData({ patient_id: '', date: '', time: '', notes: '' })
        // Refresh consultations
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create consultation:', error)
    }
  }

  const startConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowConsultationModal(true)
  }

  const viewRecord = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowRecordModal(true)
  }

  const completeConsultation = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/appointments/consultations/complete_consultation/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultation_id: selectedConsultation?.id,
          notes: consultationNotes,
          diagnosis: diagnosis,
          prescription: prescription
        })
      })
      
      if (response.ok) {
        setShowConsultationModal(false)
        setSelectedConsultation(null)
        setConsultationNotes('')
        setDiagnosis('')
        setPrescription('')
        window.location.reload()
      } else {
        console.error('Failed to complete consultation')
      }
    } catch (error) {
      console.error('Failed to complete consultation:', error)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-800"
    if (status === "scheduled") return "bg-blue-100 text-blue-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex">
      <DoctorSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Consultations</h1>
            <p className="text-muted-foreground">Manage your consultations</p>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No consultations found</p>
          </div>
        ) : (
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
                        <p className="text-xs font-medium text-muted-foreground">Diagnosis:</p>
                        <p className="text-sm text-foreground">{consultation.prescription}</p>
                      </div>
                    )}
                  </div>
                  {consultation.status === "scheduled" ? (
                    <Button 
                      onClick={() => startConsultation(consultation)}
                      className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Start
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => viewRecord(consultation)}
                      variant="outline" 
                      className="ml-4 border-border bg-transparent"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Record
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </main>

      {/* Schedule Consultation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Consultation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Patient</label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id.replace('P', '')}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
                rows={3}
                placeholder="Consultation notes..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Schedule
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Consultation Session Modal */}
      <Dialog open={showConsultationModal} onOpenChange={setShowConsultationModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultation Session</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedConsultation.patientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedConsultation.date).toLocaleDateString()} at {selectedConsultation.time}
                </p>
                <p className="text-sm mt-2"><strong>Initial Notes:</strong> {selectedConsultation.notes}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Consultation Notes</label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md mt-1"
                  rows={4}
                  placeholder="Record consultation details..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Diagnosis</label>
                <Input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md mt-1"
                  rows={3}
                  placeholder="Enter prescription details..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={completeConsultation} className="flex-1">
                  Complete Consultation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowConsultationModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Record Modal */}
      <Dialog open={showRecordModal} onOpenChange={setShowRecordModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultation Record</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedConsultation.patientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedConsultation.date).toLocaleDateString()} at {selectedConsultation.time}
                </p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-2 ${getStatusColor(selectedConsultation.status)}`}>
                  {selectedConsultation.status.charAt(0).toUpperCase() + selectedConsultation.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Initial Notes</h4>
                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                  {selectedConsultation.notes || 'No initial notes recorded'}
                </p>
              </div>
              
              {selectedConsultation.prescription && (
                <div>
                  <h4 className="font-medium mb-2">Diagnosis & Treatment</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{selectedConsultation.prescription}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRecordModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
