"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  reorderLevel: number
  unitPrice: number
  supplier: string
  expiry: string
  status: "ok" | "low" | "critical"
}

export default function Inventory() {
  const [userName, setUserName] = useState("Loading...")
  const [inventory] = useState<InventoryItem[]>([
    {
      id: "I-001",
      name: "Lisinopril 10mg",
      quantity: 45,
      reorderLevel: 100,
      unitPrice: 2.5,
      supplier: "PharmaCorp",
      expiry: "2025-06-30",
      status: "low",
    },
    {
      id: "I-002",
      name: "Metformin 500mg",
      quantity: 20,
      reorderLevel: 150,
      unitPrice: 1.75,
      supplier: "MediSupply",
      expiry: "2025-08-15",
      status: "critical",
    },
    {
      id: "I-003",
      name: "Atorvastatin 20mg",
      quantity: 150,
      reorderLevel: 100,
      unitPrice: 3.0,
      supplier: "PharmaCorp",
      expiry: "2025-12-31",
      status: "ok",
    },
    {
      id: "I-004",
      name: "Aspirin 81mg",
      quantity: 85,
      reorderLevel: 80,
      unitPrice: 0.5,
      supplier: "MediSupply",
      expiry: "2025-07-20",
      status: "low",
    },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Pharmacist")
  }, [])

  const navItems = [
    { icon: <Pill className="w-4 h-4" />, label: "Prescriptions", href: "/pharmacy/dashboard" },
    { icon: <Package className="w-4 h-4" />, label: "Inventory", href: "/pharmacy/inventory" },
    { icon: <AlertTriangle className="w-4 h-4" />, label: "Low Stock", href: "/pharmacy/low-stock" },
  ]

  const getLowStockColor = (status: string) => {
    if (status === "critical") return "bg-red-50 border-red-200"
    if (status === "low") return "bg-yellow-50 border-yellow-200"
    return "bg-green-50 border-green-200"
  }

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const lowStockItems = inventory.filter((item) => item.status !== "ok").length

  return (
    <div className="flex">
      <Sidebar userRole="pharmacist" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage pharmaceutical stock</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-3xl font-bold text-foreground">{inventory.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-3xl font-bold text-foreground">${totalInventoryValue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border-2 ${getLowStockColor(item.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        {item.status === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs font-medium">Quantity</p>
                          <p className="font-semibold text-foreground">{item.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Reorder Level</p>
                          <p className="font-semibold text-foreground">{item.reorderLevel}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Unit Price</p>
                          <p className="font-semibold text-foreground">${item.unitPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium">Expiry</p>
                          <p className="font-semibold text-foreground">{item.expiry}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Supplier: {item.supplier}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="border-border bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
