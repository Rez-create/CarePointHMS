"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, UserCheck, FileText, Activity } from "lucide-react"

export default function AdminDashboard() {
  const [userName, setUserName] = useState("Admin")
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    totalPatients: 0,
    revenue: 0,
    totalStaff: 0,
    totalAppointments: 0
  })
  const [loading, setLoading] = useState(true)
  const [gridData, setGridData] = useState({
    appointments: [],
    prescriptions: [],
    medicalRecords: [],
    loading: true
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients count
        const patientsResponse = await fetch('http://localhost:8000/api/patients/patients/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        // Fetch staff count
        const staffResponse = await fetch('http://localhost:8000/api/auth/staff/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        // Fetch appointments
        const appointmentsResponse = await fetch('http://localhost:8000/api/appointments/appointments/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        console.log('Appointments response status:', appointmentsResponse.status)
        console.log('Appointments response:', appointmentsResponse)
        
        // Fetch billing data
        const billingResponse = await fetch('http://localhost:8000/api/billing/bills/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        // Fetch medical records (same as Records page)
        const recordsResponse = await fetch('http://localhost:8000/api/patients/medical-records/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        // Fetch prescriptions
        const prescriptionsResponse = await fetch('http://localhost:8000/api/patients/prescriptions/', {
          headers: { 'Content-Type': 'application/json' }
        })
        
        const [patientsData, staffData, appointmentsData, billingData, recordsData, prescriptionsData] = await Promise.all([
          patientsResponse.ok ? patientsResponse.json() : { results: [] },
          staffResponse.ok ? staffResponse.json() : { results: [] },
          appointmentsResponse.ok ? appointmentsResponse.json() : { results: [] },
          billingResponse.ok ? billingResponse.json() : { results: [] },
          recordsResponse.ok ? recordsResponse.json() : { results: [] },
          prescriptionsResponse.ok ? prescriptionsResponse.json() : { results: [] }
        ])
        
        const patients = patientsData.results || patientsData || []
        const staff = staffData.results || staffData || []
        const appointments = appointmentsData.results || appointmentsData || []
        const bills = billingData.results || billingData || []
        const records = recordsData.results || recordsData || []
        const prescriptions = prescriptionsData.results || prescriptionsData || []
        
        console.log('Raw patients data:', patientsData)
        console.log('Processed patients:', patients)
        console.log('Patients count:', patients.length)
        
        console.log('Raw appointments data:', appointmentsData)
        console.log('Processed appointments:', appointments)
        console.log('Appointments count:', appointments.length)
        if (appointments.length > 0) {
          console.log('First appointment:', appointments[0])
        }
        
        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0]
        const todaysAppointments = appointments.filter((apt: any) => 
          apt.appointment_datetime?.startsWith(today)
        ).length
        
        // Calculate total revenue
        const totalRevenue = bills.reduce((sum: number, bill: any) => 
          sum + (parseFloat(bill.total_amount) || 0), 0
        )
        
        setStats({
          todaysAppointments,
          totalPatients: patients.length,
          revenue: totalRevenue,
          totalStaff: staff.length,
          totalAppointments: appointments.length
        })
        
        setGridData({
          appointments: appointments.slice(0, 5),
          prescriptions: prescriptions.slice(0, 5),
          medicalRecords: records.slice(0, 5),
          loading: false
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setGridData(prev => ({ ...prev, loading: false }))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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
                index === 0 
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

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalAppointments}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalPatients}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : `KSh ${stats.revenue.toLocaleString()}`}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalStaff}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-center text-lg font-medium text-gray-900">
                  Recent Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {gridData.loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center p-2 border-b border-gray-200 mb-3">
                      <span className="text-xs font-semibold text-gray-700">Doctor</span>
                      <span className="text-xs font-semibold text-gray-700">Date</span>
                      <span className="text-xs font-semibold text-gray-700">Status</span>
                    </div>
                    <div className="space-y-3">
                    {gridData.appointments.map((apt: any, index: number) => {
                      const patientName = apt.patient_details ? 
                        `${apt.patient_details.first_name || ''} ${apt.patient_details.last_name || ''}`.trim() :
                        apt.patient_name || `Patient ${apt.patient || apt.id || index + 1}`
                      
                      const doctorName = apt.doctor_details ?
                        `Dr. ${apt.doctor_details.first_name || ''} ${apt.doctor_details.last_name || ''}`.trim() :
                        apt.doctor_name || `Doctor ${apt.doctor || 'Unknown'}`
                      
                      const appointmentDate = apt.appointment_datetime ? 
                        new Date(apt.appointment_datetime).toLocaleDateString() : 
                        'No date'
                      
                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{doctorName}</span>
                          <span className="text-sm text-gray-600">{appointmentDate}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {apt.status || 'pending'}
                          </span>
                        </div>
                      )
                    })}
                    {gridData.appointments.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No appointments found</p>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
            {/* Recent Medical Records */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-center text-lg font-medium text-gray-900">
                  Recent Medical Records
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {gridData.loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : gridData.medicalRecords.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center p-2 border-b border-gray-200 mb-3">
                      <span className="text-xs font-semibold text-gray-700">Patient</span>
                      <span className="text-xs font-semibold text-gray-700">Date</span>
                      <span className="text-xs font-semibold text-gray-700">Doctor</span>
                    </div>
                    <div className="space-y-3">
                      {gridData.medicalRecords.map((record: any, index: number) => {
                        const patientName = record.patient ? 
                          `${record.patient.first_name || ''} ${record.patient.last_name || ''}`.trim() :
                          'Patient'
                        
                        const doctorName = record.recorded_by ?
                          `${record.recorded_by.first_name || ''} ${record.recorded_by.last_name || ''}`.trim() :
                          'Doctor'
                        
                        const recordDate = record.record_date ? 
                          new Date(record.record_date).toLocaleDateString() : 
                          'No date'
                        
                        return (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{patientName}</span>
                            <span className="text-sm text-gray-600">{recordDate}</span>
                            <span className="text-sm text-gray-600">{doctorName}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No medical records</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
            {/* Prescriptions */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-center text-lg font-medium text-gray-900">
                  Recent Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {gridData.loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : gridData.prescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {gridData.prescriptions.map((prescription: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{prescription.medication_name}</p>
                            <p className="text-xs text-gray-600">{prescription.patient_name || 'Patient'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">{prescription.dosage}</p>
                            <p className="text-xs text-gray-500">{new Date(prescription.date_prescribed).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No prescriptions</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-center text-lg font-medium text-gray-900">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Active Patients</span>
                      <span className="text-sm font-bold text-blue-600">{stats.totalPatients}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Staff Members</span>
                      <span className="text-sm font-bold text-green-600">{stats.totalStaff}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="text-sm font-medium">Today's Appointments</span>
                      <span className="text-sm font-bold text-yellow-600">{stats.todaysAppointments}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="text-sm font-bold text-purple-600">KSh {stats.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}