"use client"

import { useEffect, useState } from "react"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Phone, Mail, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  lastVisit: string
  conditions: string[]
}

export default function MyPatients() {
  const [userName, setUserName] = useState("Loading...")
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        
        // Fetch doctor's patients
        const response = await fetch('http://localhost:8000/api/patients/patients/doctor_patients/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setPatients(data.results)
        }
        
        // Set doctor name
        const email = localStorage.getItem("userEmail")
        setUserName(email || "Doctor")
      } catch (error) {
        console.error('Failed to fetch patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const openPatientModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }



  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm),
  )

  return (
    <div className="flex">
      <DoctorSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Patients</h1>
        <p className="text-muted-foreground mb-6">View and manage your patient list</p>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Age</p>
                <p className="text-2xl font-bold text-foreground">
                  {patients.length > 0 ? Math.round(patients.reduce((sum, p) => sum + (typeof p.age === 'number' ? p.age : 0), 0) / patients.length) : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visits This Month</p>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No patients found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
            <Card key={patient.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{patient.name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                      <div>ID: {patient.id}</div>
                      <div>
                        {patient.age} years • {patient.gender}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition) => (
                          <span key={condition} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => openPatientModal(patient)}
                    className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </main>

      {/* Patient Profile Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-semibold">{selectedPatient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-semibold">{selectedPatient.gender}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedPatient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="font-semibold">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.conditions.map((condition) => (
                    <span key={condition} className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
