"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X } from "lucide-react"
import { PatientSidebar } from "@/components/patient-sidebar"

interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
}

export default function PatientProfile() {
  const [userName, setUserName] = useState("Patient")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<PatientProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: ""
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:8000/api/patients/patients/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const patient = await response.json()
          console.log('Patient data:', patient) // Debug log
          setProfile({
            firstName: patient.first_name || "",
            lastName: patient.last_name || "",
            email: patient.contact_email || "",
            phone: patient.contact_phone || "",
            dateOfBirth: patient.date_of_birth || "",
            gender: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
            address: patient.address || "",
            emergencyContact: "",
            emergencyPhone: ""
          })
          setUserName(`${patient.first_name} ${patient.last_name}`)
        } else {
          console.error('Failed to fetch profile:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false)
    setUserName(`${profile.firstName} ${profile.lastName}`)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form if needed
  }

  const handleChange = (field: keyof PatientProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex">
        <PatientSidebar userName={userName} />
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  // Show profile even if empty for debugging
  console.log('Current profile state:', profile)

  return (
    <div className="flex">
      <PatientSidebar userName={userName} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
                    : 'P'
                  }
                </span>
              </div>
              <h3 className="font-semibold text-lg">{profile.firstName} {profile.lastName}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-3">
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  {isEditing ? (
                    <Input
                      value={profile.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{profile.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  {isEditing ? (
                    <Input
                      value={profile.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{profile.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{profile.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  {isEditing ? (
                    <select
                      value={profile.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-secondary/50 rounded">{profile.gender}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-secondary/50 rounded">{profile.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}