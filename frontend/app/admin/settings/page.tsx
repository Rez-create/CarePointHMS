"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Bell, Shield, Database, Globe, Mail, Phone } from "lucide-react"

export default function AdminSettings() {
  const [userName, setUserName] = useState("Admin")
  const [settings, setSettings] = useState({
    hospitalName: "CarePoint Hospital",
    hospitalAddress: "123 Medical Center Drive, Nairobi, Kenya",
    hospitalPhone: "+254 700 123 456",
    hospitalEmail: "info@carepoint.co.ke",
    enableNotifications: true,
    enableSMSAlerts: false,
    enableEmailAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    allowPatientRegistration: true,
    requireAppointmentApproval: true
  })

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

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
                index === 5 
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
              <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              <p className="text-gray-600">Configure hospital management system settings</p>
            </div>
            <Button 
              onClick={handleSave}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hospital Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Hospital Name</label>
                  <Input
                    value={settings.hospitalName}
                    onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <Input
                    value={settings.hospitalAddress}
                    onChange={(e) => setSettings({...settings, hospitalAddress: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    value={settings.hospitalPhone}
                    onChange={(e) => setSettings({...settings, hospitalPhone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    value={settings.hospitalEmail}
                    onChange={(e) => setSettings({...settings, hospitalEmail: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-gray-500">Receive system notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Alerts</p>
                    <p className="text-sm text-gray-500">Send SMS notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableSMSAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, enableSMSAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-gray-500">Send email notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableEmailAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, enableEmailAlerts: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Disable system for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Patient Registration</p>
                    <p className="text-sm text-gray-500">Allow new patient registrations</p>
                  </div>
                  <Switch
                    checked={settings.allowPatientRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, allowPatientRegistration: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Approval</p>
                    <p className="text-sm text-gray-500">Require admin approval for appointments</p>
                  </div>
                  <Switch
                    checked={settings.requireAppointmentApproval}
                    onCheckedChange={(checked) => setSettings({...settings, requireAppointmentApproval: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup Settings */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Backup & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Backup</p>
                    <p className="text-sm text-gray-500">Enable scheduled backups</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Backup Frequency</label>
                  <select 
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Create Manual Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download System Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}