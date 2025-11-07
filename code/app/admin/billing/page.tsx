"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, BarChart3, Calendar, Download } from "lucide-react"

interface BillingRecord {
  id: string
  patientName: string
  invoiceId: string
  amount: number
  date: string
  status: "paid" | "pending" | "overdue"
  paymentMethod: string
}

export default function AdminBilling() {
  const [userName, setUserName] = useState("Loading...")
  const [records] = useState<BillingRecord[]>([
    {
      id: "1",
      patientName: "John Smith",
      invoiceId: "INV-001",
      amount: 250,
      date: "2024-11-20",
      status: "paid",
      paymentMethod: "Card",
    },
    {
      id: "2",
      patientName: "Emma Wilson",
      invoiceId: "INV-002",
      amount: 180,
      date: "2024-11-21",
      status: "pending",
      paymentMethod: "Insurance",
    },
    {
      id: "3",
      patientName: "Robert Johnson",
      invoiceId: "INV-003",
      amount: 320,
      date: "2024-11-22",
      status: "overdue",
      paymentMethod: "Pending",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Admin")
  }, [])

  const navItems = [
    { icon: <Users className="w-4 h-4" />, label: "User Management", href: "/admin/dashboard" },
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/admin/appointments" },
    { icon: <DollarSign className="w-4 h-4" />, label: "Billing", href: "/admin/billing" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Reports", href: "/admin/reports" },
  ]

  const totalRevenue = records.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0)
  const pendingAmount = records.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0)
  const overdueAmount = records.filter((r) => r.status === "overdue").reduce((sum, r) => sum + r.amount, 0)

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-800"
    if (status === "pending") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex">
      <Sidebar userRole="admin" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-8">Billing & Financial Overview</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-3xl font-bold text-destructive">${overdueAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-3xl font-bold text-foreground">{records.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Records */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Financial Records</h2>
              <Button size="sm" variant="outline" className="border-border bg-transparent">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Patient</th>
                    <th className="text-left p-3 font-semibold text-foreground">Invoice</th>
                    <th className="text-left p-3 font-semibold text-foreground">Amount</th>
                    <th className="text-left p-3 font-semibold text-foreground">Date</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-foreground">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="p-3 text-foreground font-medium">{record.patientName}</td>
                      <td className="p-3 text-muted-foreground">{record.invoiceId}</td>
                      <td className="p-3 text-foreground font-semibold">${record.amount.toFixed(2)}</td>
                      <td className="p-3 text-muted-foreground">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{record.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
