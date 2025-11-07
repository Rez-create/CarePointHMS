"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Search, Calendar, Phone, Mail, Eye } from "lucide-react"
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
  const [patients] = useState<Patient[]>([
    {
      id: "P001",
      name: "John Smith",
      age: 55,
      gender: "Male",
      phone: "555-0101",
      email: "john@email.com",
      lastVisit: "2024-11-20",
      conditions: ["Hypertension", "Type 2 Diabetes"],
    },
    {
      id: "P002",
      name: "Emma Wilson",
      age: 42,
      gender: "Female",
      phone: "555-0102",
      email: "emma@email.com",
      lastVisit: "2024-11-19",
      conditions: ["Asthma", "Allergies"],
    },
    {
      id: "P003",
      name: "Robert Johnson",
      age: 68,
      gender: "Male",
      phone: "555-0103",
      email: "robert@email.com",
      lastVisit: "2024-11-18",
      conditions: ["Coronary Artery Disease", "Hypertension"],
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Doctor")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Schedule", href: "/doctor/dashboard" },
    { icon: <Users className="w-4 h-4" />, label: "My Patients", href: "/doctor/patients" },
    { icon: <Mail className="w-4 h-4" />, label: "Lab Requests", href: "/doctor/lab-requests" },
  ]

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm),
  )

  return (
    <div className="flex">
      <Sidebar userRole="doctor" userName={userName} navItems={navItems} />

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
                  {Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)}
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
                  <Button className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
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
