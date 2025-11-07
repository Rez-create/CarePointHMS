"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, AlertCircle, CheckCircle, Package, Plus } from "lucide-react"

interface Prescription {
  id: string
  patientName: string
  medication: string
  quantity: number
  dosage: string
  status: "pending" | "dispensed" | "ready"
  prescribedDate: string
}

interface InventoryItem {
  id: string
  name: string
  quantity: number
  reorderLevel: number
  supplier: string
}

export default function PharmacyDashboard() {
  const [userName, setUserName] = useState("Loading...")
  const [prescriptions] = useState<Prescription[]>([
    {
      id: "RX-001",
      patientName: "John Smith",
      medication: "Lisinopril",
      quantity: 30,
      dosage: "10mg tablets",
      status: "ready",
      prescribedDate: "2024-11-20",
    },
    {
      id: "RX-002",
      patientName: "Emma Wilson",
      medication: "Metformin",
      quantity: 60,
      dosage: "500mg tablets",
      status: "pending",
      prescribedDate: "2024-11-22",
    },
    {
      id: "RX-003",
      patientName: "Robert Johnson",
      medication: "Atorvastatin",
      quantity: 30,
      dosage: "20mg tablets",
      status: "dispensed",
      prescribedDate: "2024-11-19",
    },
  ])

  const [inventory] = useState<InventoryItem[]>([
    {
      id: "I-001",
      name: "Lisinopril 10mg",
      quantity: 45,
      reorderLevel: 100,
      supplier: "PharmaCorp",
    },
    {
      id: "I-002",
      name: "Metformin 500mg",
      quantity: 20,
      reorderLevel: 150,
      supplier: "MediSupply",
    },
    {
      id: "I-003",
      name: "Atorvastatin 20mg",
      quantity: 150,
      reorderLevel: 100,
      supplier: "PharmaCorp",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Pharmacist")
  }, [])

  const navItems = [
    { icon: <Pill className="w-4 h-4" />, label: "Prescriptions", href: "/pharmacy/dashboard" },
    { icon: <Package className="w-4 h-4" />, label: "Inventory", href: "/pharmacy/inventory" },
    { icon: <AlertCircle className="w-4 h-4" />, label: "Low Stock", href: "/pharmacy/low-stock" },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "pending") return <AlertCircle className="w-4 h-4 text-yellow-600" />
    return <CheckCircle className="w-4 h-4 text-gray-600" />
  }

  const getLowStockAlert = (item: InventoryItem) => {
    if (item.quantity < item.reorderLevel * 0.25) return "critical"
    if (item.quantity < item.reorderLevel * 0.5) return "warning"
    return "normal"
  }

  return (
    <div className="flex">
      <Sidebar userRole="pharmacist" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage prescriptions and inventory</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Pending Prescriptions</p>
                <p className="text-3xl font-bold text-foreground">
                  {prescriptions.filter((p) => p.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Ready for Pickup</p>
                <p className="text-3xl font-bold text-foreground">
                  {prescriptions.filter((p) => p.status === "ready").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-3xl font-bold text-destructive">
                  {inventory.filter((item) => getLowStockAlert(item) !== "normal").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Prescriptions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Pending Prescriptions</h2>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {prescriptions
              .filter((p) => p.status === "pending")
              .map((rx) => (
                <Card key={rx.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{rx.medication}</h3>
                          {getStatusIcon(rx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Patient: {rx.patientName} • Qty: {rx.quantity} • {rx.dosage}
                        </p>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Process
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Inventory */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Inventory Status</h2>
          <div className="space-y-2">
            {inventory.map((item) => {
              const alertLevel = getLowStockAlert(item)
              const bgColor =
                alertLevel === "critical" ? "bg-red-50" : alertLevel === "warning" ? "bg-yellow-50" : "bg-secondary/50"

              return (
                <Card key={item.id} className={`bg-card border-border ${bgColor}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Supplier: {item.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{item.quantity}</p>
                        <p className="text-xs text-muted-foreground">Reorder at {item.reorderLevel}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
