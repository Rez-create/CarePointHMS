"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, ArrowRight, Phone, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="CarePoint Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CarePoint Hospital</h1>
              <p className="text-xs text-muted-foreground">Excellence in Healthcare</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            <Link href="/login">
              <Button variant="outline" className="border-border text-foreground bg-transparent">
                Login
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
              Your Health is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              CarePoint Hospital offers comprehensive healthcare services with state-of-the-art facilities, experienced
              medical professionals, and a commitment to patient-centered care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/patient/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Register as Patient
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/patient/book-appointment">
                <Button variant="outline" className="border-border text-foreground w-full sm:w-auto bg-transparent">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-24 h-24 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Modern Healthcare Facilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">About CarePoint Hospital</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">Our Mission</h4>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                To provide exceptional, compassionate, and affordable healthcare services to our community. We are
                committed to improving patient outcomes through innovation, quality care, and continuous improvement.
              </p>
              <h4 className="text-xl font-semibold text-foreground mb-4">Our Vision</h4>
              <p className="text-muted-foreground leading-relaxed">
                To be a leading healthcare provider recognized for clinical excellence, patient satisfaction, and
                community health initiatives.
              </p>
            </div>
            <div className="space-y-4">
              <Card className="border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Accredited Excellence</h5>
                    <p className="text-sm text-muted-foreground">
                      Fully accredited and certified by international healthcare standards.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Expert Team</h5>
                    <p className="text-sm text-muted-foreground">
                      Highly qualified doctors and healthcare professionals with years of experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Patient Care</h5>
                    <p className="text-sm text-muted-foreground">
                      Personalized treatment plans focused on individual patient needs and recovery.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Emergency Care", description: "24/7 emergency department with advanced trauma care facilities." },
            {
              title: "Outpatient Services",
              description: "Comprehensive outpatient consultation and diagnostic services.",
            },
            { title: "Surgery", description: "State-of-the-art operating theaters with experienced surgical teams." },
            { title: "Pharmacy", description: "Full-service pharmacy with all essential and specialized medications." },
            {
              title: "Laboratory",
              description: "Advanced diagnostic laboratory with rapid test processing.",
            },
            {
              title: "Inpatient Care",
              description: "Comfortable private and shared rooms with complete medical support.",
            },
          ].map((service, idx) => (
            <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h5 className="font-semibold text-foreground mb-2">{service.title}</h5>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Get In Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Phone</h5>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Address</h5>
                  <p className="text-sm text-muted-foreground">123 Healthcare Blvd, Medical City, MC 12345</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Hours</h5>
                  <p className="text-sm text-muted-foreground">24/7 Emergency Services Available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">CarePoint Hospital</p>
                <p className="text-xs text-muted-foreground">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2025 CarePoint Hospital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
