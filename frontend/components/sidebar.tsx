"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, LogOut, Menu } from "lucide-react"
import { useState } from "react"

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface SidebarProps {
  userRole: string
  userName: string
  navItems: NavItem[]
}

export function Sidebar({ userRole, userName, navItems }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const roleLabels: Record<string, string> = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Administrator",
    staff: "Receptionist",
    pharmacist: "Pharmacist",
    "lab-tech": "Lab Technician",
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border w-64 p-6 flex flex-col transform transition-transform md:transform-none ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <img src="/logo.png" alt="CarePoint Logo" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">CarePoint</h1>
            <p className="text-xs text-sidebar-accent-foreground">{roleLabels[userRole]}</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 mb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 md:hidden z-40" />}
    </>
  )
}
