"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, DollarSign, Calendar, Pill } from "lucide-react"

interface Invoice {
  id: string
  date: string
  amount: number
  items: string[]
  status: "paid" | "pending" | "overdue"
  dueDate: string
}

export default function Billing() {
  const [userName, setUserName] = useState("Loading...")
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: "2024-11-20",
      amount: 250,
      items: ["Consultation - Dr. Sarah Johnson", "Lab Tests"],
      status: "paid",
      dueDate: "2024-11-27",
    },
    {
      id: "INV-002",
      date: "2024-10-15",
      amount: 180,
      items: ["Consultation - Dr. Michael Chen"],
      status: "paid",
      dueDate: "2024-10-22",
    },
    {
      id: "INV-003",
      date: "2024-11-25",
      amount: 150,
      items: ["Lab Tests - Thyroid Panel", "Consultation Follow-up"],
      status: "pending",
      dueDate: "2024-12-02",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Patient")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Appointments", href: "/patient/dashboard" },
    { icon: <FileText className="w-4 h-4" />, label: "Medical Records", href: "/patient/records" },
    { icon: <Pill className="w-4 h-4" />, label: "Prescriptions", href: "/patient/prescriptions" },
    { icon: <DollarSign className="w-4 h-4" />, label: "Billing", href: "/patient/billing" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-800"
    if (status === "pending") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const totalDue = invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="flex">
      <Sidebar userRole="patient" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-8">Billing & Invoices</h1>

        {/* Summary Card */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-3xl font-bold text-foreground">{invoices.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-3xl font-bold text-destructive">${totalDue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-3xl font-bold text-primary">
                  $
                  {invoices
                    .filter((inv) => inv.status === "paid")
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Issued: {new Date(invoice.date).toLocaleDateString()}
                    </p>
                    <div className="bg-secondary/50 p-3 rounded mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Items</p>
                      {invoice.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-foreground">
                          • {item}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-foreground mb-4">${invoice.amount.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border bg-transparent">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
