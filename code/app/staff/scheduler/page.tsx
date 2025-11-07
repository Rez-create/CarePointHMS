"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Plus } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
  doctor?: string
}

export default function AppointmentScheduler() {
  const [userName, setUserName] = useState("Loading...")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [patientName, setPatientName] = useState("")
  const [reason, setReason] = useState("")

  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true, doctor: "Dr. Johnson" },
    { time: "09:30", available: false, doctor: "Dr. Johnson" },
    { time: "10:00", available: true, doctor: "Dr. Chen" },
    { time: "10:30", available: true, doctor: "Dr. Johnson" },
    { time: "11:00", available: false, doctor: "Dr. Chen" },
    { time: "02:00", available: true, doctor: "Dr. Rodriguez" },
    { time: "02:30", available: true, doctor: "Dr. Rodriguez" },
    { time: "03:00", available: false, doctor: "Dr. Johnson" },
  ]

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserName(email || "Staff")
  }, [])

  const navItems = [
    { icon: <Calendar className="w-4 h-4" />, label: "Patient Queue", href: "/staff/dashboard" },
    { icon: <User className="w-4 h-4" />, label: "Register Patient", href: "/staff/register" },
    { icon: <Clock className="w-4 h-4" />, label: "Appointment Scheduler", href: "/staff/scheduler" },
  ]

  const handleSchedule = () => {
    if (patientName && selectedDate && selectedTime && reason) {
      alert(`Appointment scheduled for ${patientName} on ${selectedDate} at ${selectedTime}`)
      setPatientName("")
      setSelectedDate("")
      setSelectedTime("")
      setReason("")
    }
  }

  return (
    <div className="flex">
      <Sidebar userRole="staff" userName={userName} navItems={navItems} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-8">Appointment Scheduler</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Schedule New Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Patient Name</label>
                  <Input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name or ID"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Appointment Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Reason for Visit</label>
                  <Input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Regular checkup, Follow-up"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">Available Time Slots</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeSlots
                      .filter((slot) => slot.available)
                      .map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-accent/20 text-foreground"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>

                <Button
                  onClick={handleSchedule}
                  disabled={!patientName || !selectedDate || !selectedTime || !reason}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Calendar & Info */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "09:00", patient: "John Smith", doctor: "Dr. Johnson" },
                    { time: "10:00", patient: "Emma Wilson", doctor: "Dr. Chen" },
                    { time: "02:00", patient: "Robert Johnson", doctor: "Dr. Rodriguez" },
                  ].map((apt, idx) => (
                    <div key={idx} className="p-2 bg-secondary/50 rounded text-sm">
                      <p className="font-medium text-foreground">{apt.time}</p>
                      <p className="text-xs text-muted-foreground">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Available Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Dr. Sarah Johnson - Cardiology",
                    "Dr. Michael Chen - GP",
                    "Dr. Emily Rodriguez - Endocrinology",
                  ].map((doc, idx) => (
                    <div key={idx} className="p-2 bg-secondary/50 rounded">
                      <p className="text-sm text-foreground">{doc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
