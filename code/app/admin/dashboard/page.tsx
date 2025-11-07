"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, Calendar, DollarSign, TrendingUp, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [userName, setUserName] = useState("Loading...")

  const revenueData = [
    { month: "Jan", revenue: 24000 },
    { month: "Feb", revenue: 28000 },
    { month: "Mar", revenue: 32000 },
    { month: "Apr", revenue: 29000 },
    { month: "May", revenue: 35000 },
    { month: "Jun", revenue: 38000 },
  ]

  const appointmentTrend = [
    { day: "Mon", completed: 12, cancelled: 2 },
    { day: "Tue", completed: 15, cancelled: 1 },
    { day: "Wed", completed: 14, cancelled: 2 },
    { day: "Thu", completed: 18, cancelled: 1 },
    { day: "Fri", completed: 16, cancelled: 3 },
    { day: "Sat", completed: 10, cancelled: 0 },
  ]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Admin")
  }, [])

  const navItems = [
    { icon: <Users className="w-4 h-4" />, label: "User Management", href: "/admin/dashboard" },
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/admin/appointments" },
    { icon: <DollarSign className="w-4 h-4" />, label: "Billing", href: "/admin/billing" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Reports", href: "/admin/reports" },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="flex">
      <Sidebar userRole="admin" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">System Overview</h1>
          <p className="text-muted-foreground">Monitor hospital operations and analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground">1,247</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Appointments Today</p>
                <p className="text-3xl font-bold text-foreground">45</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Revenue (Month)</p>
                <p className="text-3xl font-bold text-foreground">$38K</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Active Departments</p>
                <p className="text-3xl font-bold text-foreground">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Appointments Trend */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Appointments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="cancelled" stroke="var(--color-destructive)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">User Management</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Doctors</span>
                  <span className="text-2xl font-bold text-primary">48</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Patients</span>
                  <span className="text-2xl font-bold text-primary">1,156</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Staff</span>
                  <span className="text-2xl font-bold text-primary">43</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Database Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Healthy</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Server Load</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Normal</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                  <span className="text-foreground font-medium">Data Backup</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Synced</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
