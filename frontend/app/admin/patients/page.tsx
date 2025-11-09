"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Eye, Plus, Calendar, Phone, Mail, User } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  registrationDate: string
  lastVisit: string
  status: string
}

export default function AdminPatients() {
  const [userName, setUserName] = useState("Admin")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:8000/api/patients/patients/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          const patientsArray = data.results || data
          const formattedPatients = patientsArray.map((patient: any) => ({
            id: `P${patient.id.toString().padStart(3, '0')}`,
            name: `${patient.first_name} ${patient.last_name}`,
            age: patient.age || 'N/A',
            gender: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
            phone: patient.contact_phone || 'N/A',
            email: patient.contact_email,
            registrationDate: new Date(patient.registration_date).toLocaleDateString(),
            lastVisit: 'N/A', // Will be updated with appointment data
            status: patient.is_active ? 'Active' : 'Inactive'
          }))
          setPatients(formattedPatients)
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    window.location.href = '/login'
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Medical Records", href: "/admin/records" },
    { label: "Patients", href: "/admin/patients" },
    { label: "Inventory & Supplies", href: "/admin/inventory" },
    { label: "Staff Management", href: "/admin/staff" },
    { label: "Settings", href: "/admin/settings" },
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <img src="/logo.png" alt="CarePoint Logo" className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg">CarePoint</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                index === 2 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Hi {userName}</h1>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
              <p className="text-gray-600">Manage all registered patients</p>
            </div>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Patients List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No patients found</p>
              <p className="text-xs text-gray-400 mt-2">Total patients loaded: {patients.length}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Showing {filteredPatients.length} of {patients.length} patients</p>
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {patient.id}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            patient.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {patient.age} years, {patient.gender}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Registered: {patient.registrationDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {patient.email}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Last Visit: {patient.lastVisit}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}