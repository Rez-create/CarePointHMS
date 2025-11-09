"use client"

import { useEffect, useState } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

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
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) return

        // Fetch patient name
        const patientResponse = await fetch('http://localhost:8000/api/patients/patients/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (patientResponse.ok) {
          const patient = await patientResponse.json()
          setUserName(`${patient.first_name} ${patient.last_name}`)
        }

        // Fetch billing data
        const billingResponse = await fetch('http://localhost:8000/api/patients/patients/my_billing/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (billingResponse.ok) {
          const data = await billingResponse.json()
          setInvoices(data.results)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-800"
    if (status === "pending") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const totalDue = invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="flex">
      <PatientSidebar userName={userName} />

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
                <p className="text-3xl font-bold text-destructive">KSh {totalDue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-3xl font-bold text-primary">
                  KSh {invoices
                    .filter((inv) => inv.status === "paid")
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading billing data...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No billing records found</p>
          </div>
        ) : (
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
                    <p className="text-2xl font-bold text-foreground mb-4">KSh {invoice.amount.toFixed(2)}</p>
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
        )}
      </main>
    </div>
  )
}
