"use client"

import { Calendar, FileText, Plus, User } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface PatientSidebarProps {
  userName: string
}

export function PatientSidebar({ userName }: PatientSidebarProps) {
  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Dashboard", href: "/patient/dashboard" },
    { icon: <FileText className="w-4 h-4" />, label: "Records", href: "/patient/records" },
    { icon: <Plus className="w-4 h-4" />, label: "Appointments", href: "/patient/appointments" },
    { icon: <User className="w-4 h-4" />, label: "Profile", href: "/patient/profile" },
  ]

  return <Sidebar userRole="patient" userName={userName} navItems={navItems} />
}