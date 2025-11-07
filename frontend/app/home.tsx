"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { 
  FaAmbulance, 
  FaUserMd, 
  FaHospitalAlt, 
  FaPills, 
  FaFlask, 
  FaBed 
} from "react-icons/fa"

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
            <h1 className="text-xl font-bold text-foreground">CarePoint</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="/patient/book-appointment" className="text-foreground hover:text-primary transition-colors">
              Appointments
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </a>
          </nav>
          <div className="hidden md:block">
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Welcome to Carepoint - Your Health, Our Priority
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Book appointments, view records, and manage care effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/patient/book-appointment">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Book Appointment
                </Button>
              </Link>
              <Link href="#contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-primary mb-3 underline decoration-primary">About Us</h3>
            <div className="text-muted-foreground">Learn more about our mission and values.</div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-12 md:col-span-5">
              <h4 className="text-xl font-semibold text-foreground mb-4">
                Compassionate Care, Redefined
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Founded in 2025, we're a community-driven hospital committed to innovative,
                patient-centered healthcare. At Carepoint, every decision is guided by
                empathy, expertise, and excellence, ensuring your well-being is always our top
                priority.
              </p>
              {/* Services Button */}
              <Button className="bg-white hover:bg-primary text-primary border border-gray-300 hover:text-white" asChild>
                <Link href="#services">What we offer</Link>
              </Button>
            </div>

            {/* Right Column */}
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              {/* Mission */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Our Mission
                </h4>
                <div className="text-muted-foreground leading-relaxed">
                  <p>To provide accessible, high-quality healthcare with compassion and excellence.</p>
                </div>
              </div>

              {/* Vision */}
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Our Vision
                </h4>
                <div className="text-muted-foreground leading-relaxed">
                  <p>To be the trusted leader in healthcare, known for excellence in patient care and innovative medical services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-primary mb-3 underline decoration-primary">Our Services</h3>
            <p className="text-muted-foreground">Comprehensive healthcare solutions tailored to your needs</p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Emergency Care",
                description: "24/7 emergency department with advanced trauma care facilities.",
                icon: <FaAmbulance className="w-10 h-10 text-primary mb-4" />,
              },
              {
                title: "Outpatient Services",
                description: "Comprehensive outpatient consultation and diagnostic services.",
                icon: <FaUserMd className="w-10 h-10 text-primary mb-4" />,
              },
              {
                title: "Surgery",
                description: "State-of-the-art operating theaters with experienced surgical teams.",
                icon: <FaHospitalAlt className="w-10 h-10 text-primary mb-4" />,
              },
              {
                title: "Pharmacy",
                description: "Full-service pharmacy with all essential and specialized medications.",
                icon: <FaPills className="w-10 h-10 text-primary mb-4" />,
              },
              {
                title: "Laboratory",
                description: "Advanced diagnostic laboratory with rapid test processing.",
                icon: <FaFlask className="w-10 h-10 text-primary mb-4" />,
              },
              {
                title: "Inpatient Care",
                description: "Comfortable private and shared rooms with complete medical support.",
                icon: <FaBed className="w-10 h-10 text-primary mb-4" />,
              },
            ].map((service, idx) => (
              <Link href="#" key={idx}>
                <Card className="border-border bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h5 className="font-semibold text-foreground mb-2">{service.title}</h5>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-3 underline decoration-white">Contact Us</h3>
            <p className="text-muted-foreground">Get in touch with us for more information.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Contact Information */}
            <div>
              <Card className="border-border">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Message"
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-border bg-background resize-none"
                      ></textarea>
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Form */}
            <div className="flex flex-col justify-center">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-foreground mb-3">Contact Information</h4>
                  <p className="text-muted-foreground mb-10">For inquiries, please reach out to us:</p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Phone</h5>
                      <p className="text-muted-foreground">+254 769 634 770</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Email</h5>
                      <p className="text-muted-foreground">info@carepoint.com</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Address</h5>
                      <p className="text-muted-foreground">Nairob, Kenya</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Hours</h5>
                      <p className="text-muted-foreground">24/7 Emergency Services Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="CarePoint Logo" className="w-10 h-10" />
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
