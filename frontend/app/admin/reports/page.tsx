"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, BarChart3, Calendar, Download } from "lucide-react"

const departmentData = [
  { dept: "Cardiology", patients: 45, revenue: 12000 },
  { dept: "Orthopedics", patients: 32, revenue: 8500 },
  { dept: "Neurology", patients: 28, revenue: 7200 },
  { dept: "Pediatrics", patients: 38, revenue: 9800 },
  { dept: "General Medicine", patients: 52, revenue: 11000 },
]

const diagnosisData = [
  { name: "Hypertension", value: 25 },
  { name: "Diabetes", value: 20 },
  { name: "Asthma", value: 15 },
  { name: "Heart Disease", value: 18 },
  { name: "Others", value: 22 },
]

const COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-muted)",
]

export default function Reports() {
  const [userName, setUserName] = useState("Loading...")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Admin")
  }, [])

  const navItems = [
    { icon: <Users className="w-4 h-4" />, label: "User Management", href: "/admin/dashboard" },
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/admin/appointments" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Reports", href: "/admin/reports" },
  ]

  return (
    <div className="flex">
      <Sidebar userRole="admin" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">System-wide performance metrics</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Department Performance */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Department Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dept" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
                <Legend />
                <Bar dataKey="patients" fill="var(--color-primary)" name="Patients" />
                <Bar dataKey="revenue" fill="var(--color-accent)" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Most Common Diagnoses */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Most Common Diagnoses</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diagnosisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diagnosisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Patient Admission Trends */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Patient Admissions Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={[
                    { week: "Week 1", admissions: 45 },
                    { week: "Week 2", admissions: 52 },
                    { week: "Week 3", admissions: 48 },
                    { week: "Week 4", admissions: 61 },
                    { week: "Week 5", admissions: 55 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  />
                  <Line type="monotone" dataKey="admissions" stroke="var(--color-primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Average Treatment Duration</p>
              <p className="text-3xl font-bold text-foreground">4.2 days</p>
              <p className="text-xs text-muted-foreground mt-2">↓ 8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Patient Satisfaction</p>
              <p className="text-3xl font-bold text-foreground">4.7/5</p>
              <p className="text-xs text-muted-foreground mt-2">↑ 2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Appointment No-Show Rate</p>
              <p className="text-3xl font-bold text-foreground">5.3%</p>
              <p className="text-xs text-muted-foreground mt-2">↓ 1.2% from last month</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
