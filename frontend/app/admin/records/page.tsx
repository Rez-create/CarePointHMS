"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Eye, Plus, Calendar, User } from "lucide-react"

interface MedicalRecord {
  id: string
  patientName: string
  patientId: string
  recordType: string
  description: string
  recordDate: string
  doctorName: string
}

export default function AdminMedicalRecords() {
  const [userName, setUserName] = useState("Admin")
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        console.log('Fetching medical records with token:', accessToken ? 'Token exists' : 'No token')
        
        const response = await fetch('http://localhost:8000/api/patients/medical-records/', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Raw API response:', data)
          
          // Handle both paginated and non-paginated responses
          const recordsArray = data.results || data
          console.log('Records array:', recordsArray)
          
          const formattedRecords = recordsArray.map((record: any) => ({
            id: record.id,
            patientName: `${record.patient?.first_name || ''} ${record.patient?.last_name || ''}`.trim(),
            patientId: `P${record.patient?.id || '000'}`,
            recordType: record.record_type || 'General',
            description: record.description || 'No description',
            recordDate: record.record_date,
            doctorName: record.recorded_by?.first_name ? `${record.recorded_by.first_name} ${record.recorded_by.last_name}` : 'Unknown Doctor'
          }))
          
          console.log('Formatted records:', formattedRecords)
          setRecords(formattedRecords)
        } else {
          console.error('API response not ok:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
        }
      } catch (error) {
        console.error('Failed to fetch medical records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
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

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
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
                index === 1 
                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
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
              <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
              <p className="text-gray-600">Manage all patient medical records</p>
            </div>
            <Button className="gap-2 bg-primary hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Add Record
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by patient name, ID, or record type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Records List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading medical records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No medical records found</p>
              <p className="text-xs text-gray-400 mt-2">Total records loaded: {records.length}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Showing {filteredRecords.length} of {records.length} records</p>
              {filteredRecords.map((record) => (
                <Card key={record.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{record.patientName}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {record.patientId}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {record.recordType}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(record.recordDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.doctorName}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
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