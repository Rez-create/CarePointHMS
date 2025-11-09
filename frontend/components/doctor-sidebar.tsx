"use client"

import { Calendar, Users, AlertCircle, Phone } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface DoctorSidebarProps {
  userName: string
}

export function DoctorSidebar({ userName }: DoctorSidebarProps) {
  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Schedule", href: "/doctor/dashboard" },
    { icon: <Users className="w-4 h-4" />, label: "My Patients", href: "/doctor/patients" },
    { icon: <AlertCircle className="w-4 h-4" />, label: "Lab Requests", href: "/doctor/lab-requests" },
    { icon: <Phone className="w-4 h-4" />, label: "Consultations", href: "/doctor/consultations" },
  ]

  return <Sidebar userRole="doctor" userName={userName} navItems={navItems} />
}