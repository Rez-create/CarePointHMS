"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Plus, AlertTriangle, Calendar, Building, Edit, Trash2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InventoryItem {
  id: number
  item_name: string
  category: string
  description: string
  quantity_in_stock: number
  unit_price: number
  reorder_level: number
  supplier_details?: {
    supplier_name: string
  }
  expiry_date?: string
  batch_number?: string
  storage_location?: string
  last_updated: string
}

export default function AdminInventory() {
  const [userName, setUserName] = useState("Admin")
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showLowStock, setShowLowStock] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    item_name: '',
    category: 'medicine',
    description: '',
    quantity_in_stock: '',
    unit_price: '',
    reorder_level: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchInventory = async () => {
    try {
      let url = 'http://localhost:8000/api/pharmacy/inventory/'
      
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }
      if (showLowStock) {
        params.append('low_stock', 'true')
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const inventoryArray = data.results || data
        setInventory(inventoryArray)
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = {
        item_name: formData.item_name,
        category: formData.category,
        description: formData.description || '',
        quantity_in_stock: parseInt(formData.quantity_in_stock) || 0,
        unit_price: parseFloat(formData.unit_price) || 0,
        reorder_level: parseInt(formData.reorder_level) || 0
      }
      
      const response = await fetch('http://localhost:8000/api/pharmacy/inventory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        setShowAddModal(false)
        setFormData({
          item_name: '',
          category: 'medicine',
          description: '',
          quantity_in_stock: '',
          unit_price: '',
          reorder_level: ''
        })
        // Refresh inventory data instead of reloading page
        await fetchInventory()
      } else {
        const error = await response.text()
        alert('Error: ' + error)
      }
    } catch (error) {
      alert('Failed to add item: ' + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [categoryFilter, showLowStock])

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medicine': return 'bg-blue-100 text-primary'
      case 'equipment': return 'bg-green-100 text-green-800'
      case 'medical_supply': return 'bg-purple-100 text-purple-800'
      case 'lab_supply': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isLowStock = (item: InventoryItem) => {
    return item.quantity_in_stock <= item.reorder_level
  }

  const filteredInventory = inventory.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier_details?.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batch_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                index === 3 
                  ? 'bg-blue-50 text-primary border border-blue-200' 
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
              <h2 className="text-2xl font-bold text-gray-900">Inventory & Supplies</h2>
              <p className="text-gray-600">Manage medical supplies, equipment, and medications</p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="gap-2 bg-primary hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search items, categories, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="medical_supply">Medical Supply</SelectItem>
                <SelectItem value="lab_supply">Lab Supply</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={() => setShowLowStock(!showLowStock)}
              className="gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Low Stock Only
            </Button>
          </div>

          {/* Inventory List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No inventory items found</p>
              <p className="text-xs text-gray-400 mt-2">Total items loaded: {inventory.length}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">Showing {filteredInventory.length} of {inventory.length} items</p>
              {filteredInventory.map((item) => (
                <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.item_name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category.replace('_', ' ').toUpperCase()}
                          </span>
                          {isLowStock(item) && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{item.description || 'No description available'}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Stock:</span>
                            <span className={`ml-1 font-medium ${isLowStock(item) ? 'text-red-600' : 'text-green-600'}`}>
                              {item.quantity_in_stock} units
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-1 font-medium">KSh {item.unit_price}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Reorder Level:</span>
                            <span className="ml-1 font-medium">{item.reorder_level}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Batch:</span>
                            <span className="ml-1 font-medium">{item.batch_number || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {item.supplier_details && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {item.supplier_details.supplier_name}
                            </div>
                          )}
                          {item.expiry_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Expires: {new Date(item.expiry_date).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Updated: {new Date(item.last_updated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Item Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Item Name *</label>
                    <Input
                      placeholder="e.g., Paracetamol 500mg"
                      value={formData.item_name}
                      onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="medical_supply">Medical Supply</SelectItem>
                        <SelectItem value="lab_supply">Lab Supply</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="Brief description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Stock *</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.quantity_in_stock}
                        onChange={(e) => setFormData({...formData, quantity_in_stock: e.target.value})}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Price (KSh) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.unit_price}
                        onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Reorder Level *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.reorder_level}
                      onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Item'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}