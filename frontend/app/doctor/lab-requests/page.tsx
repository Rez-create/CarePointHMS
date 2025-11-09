"use client"

import { useEffect, useState } from "react"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TestTubes, Plus, Eye, Trash2 } from "lucide-react"

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
  const [requests, setRequests] = useState<LabRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patient_id: '',
    test_name: '',
    priority: 'routine'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        
        // Fetch lab requests
        const requestsResponse = await fetch('http://localhost:8000/api/laboratory/requests/doctor_requests/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (requestsResponse.ok) {
          const data = await requestsResponse.json()
          setRequests(data.results)
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
      const response = await fetch('http://localhost:8000/api/laboratory/requests/create_request/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowModal(false)
        setFormData({ patient_id: '', test_name: '', priority: 'routine' })
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to create lab request:', error)
    }
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lab Requests</h1>
            <p className="text-muted-foreground">Manage and review lab test requests</p>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading lab requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No lab requests found</p>
          </div>
        ) : (
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
        )}
      </main>

      {/* New Lab Request Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Lab Request</DialogTitle>
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
              <label className="text-sm font-medium">Test Name</label>
              <Input
                value={formData.test_name}
                onChange={(e) => setFormData(prev => ({ ...prev, test_name: e.target.value }))}
                placeholder="Enter test name..."
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Create Request
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
