"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  BarChart3, 
  MessageSquare,
  Target,
  Clock,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [isYearly, setIsYearly] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechCorp",
      content: "TeamSync transformed our project delivery. We've seen 40% faster completion rates and 95% on-time delivery since implementation.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Project Manager",
      company: "InnovateLabs",
      content: "The AI insights are game-changing. We can now predict bottlenecks before they happen and adjust resources accordingly.",
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      company: "DataFlow Inc",
      content: "Real-time collaboration features have eliminated communication gaps. Our team is more aligned than ever before.",
      avatar: "EW"
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: { monthly: 29, yearly: 290 },
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 team members",
        "5 active projects",
        "Basic task management",
        "Email support",
        "Standard security"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Business",
      price: { monthly: 79, yearly: 790 },
      description: "Advanced features for growing teams",
      features: [
        "Up to 50 team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "AI-powered insights",
        "Advanced security"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 199, yearly: 1990 },
      description: "Complete solution for large organizations",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced analytics",
        "24/7 dedicated support",
        "Custom integrations",
        "AI-powered insights",
        "Enterprise security (SOC-2)",
        "Custom deployment",
        "Dedicated account manager"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  const companyLogos = [
    "TechCorp", "InnovateLabs", "DataFlow", "CloudScale", "NextGen", "FutureSoft"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">TeamSync</span>
          </div>
          <nav className="hidden lg:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</Link>
        </nav>
        <div className="flex space-x-4">
          <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
                Get Started
              </Button>
          </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    Manage Projects.{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                      Track Milestones.
                    </span>{" "}
                    Accelerate Growth.
          </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    A powerful enterprise platform to streamline project workflows, align teams, and deliver on time — every time.
          </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                      Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                    <Play className="mr-2 h-5 w-5" />
                    Book Demo
            </Button>
                </div>

                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              {/* Abstract Dashboard Preview */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="space-y-4">
                    {/* Mock Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                        <span className="font-semibold text-gray-900">Project Dashboard</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>

                    {/* Mock Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">24</div>
                        <div className="text-sm text-gray-500">Active Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">87%</div>
                        <div className="text-sm text-gray-500">On Track</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-sm text-gray-500">Milestones</div>
                      </div>
                    </div>

                    {/* Mock Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Project Alpha</span>
                        <span className="text-gray-900 font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>

                    {/* Mock Kanban */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">To Do</div>
                        <div className="bg-gray-50 rounded-lg p-2 text-xs">Design mockups</div>
                        <div className="bg-gray-50 rounded-lg p-2 text-xs">User research</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">In Progress</div>
                        <div className="bg-blue-50 rounded-lg p-2 text-xs border-l-2 border-blue-500">API development</div>
                        <div className="bg-blue-50 rounded-lg p-2 text-xs border-l-2 border-blue-500">Database setup</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Done</div>
                        <div className="bg-green-50 rounded-lg p-2 text-xs border-l-2 border-green-500">Project setup</div>
                        <div className="bg-green-50 rounded-lg p-2 text-xs border-l-2 border-green-500">Requirements</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything Your Team Needs
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From planning to execution, TeamSync provides all the tools your team needs to deliver exceptional results.
          </p>
        </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
              </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Milestone Tracking</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Visual timelines with progress bars and automated milestone notifications to keep projects on track.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
              </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Smart Task Management</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  AI-powered prioritization, dependency mapping, and intelligent scheduling that adapts to your team's capacity.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
              </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Real-time Collaboration</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Live editing, instant updates, threaded comments, and @mentions to keep everyone aligned and informed.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
              </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">AI-powered Insights</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Predictive analytics, productivity forecasting, and intelligent recommendations to optimize team performance.
              </CardDescription>
            </CardHeader>
          </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              See TeamSync in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of our platform with this interactive preview of our project dashboard.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">TeamSync Dashboard Preview</div>
                  <div className="w-16"></div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Project Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-blue-800">Active Projects</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-green-600">94%</div>
                          <div className="text-sm text-green-800">On Time</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-purple-600">156</div>
                          <div className="text-sm text-purple-800">Tasks Done</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-orange-600">8</div>
                          <div className="text-sm text-orange-800">Milestones</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Q1 Product Launch</span>
                          <span className="text-sm font-bold text-gray-900">87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Mobile App Development</span>
                          <span className="text-sm font-bold text-gray-900">64%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full" style={{width: '64%'}}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">API Integration</span>
                          <span className="text-sm font-bold text-gray-900">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '92%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban Board */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Board</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">To Do (8)</div>
                        <div className="space-y-2">
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="text-sm font-medium text-gray-900">Design system updates</div>
                            <div className="text-xs text-gray-500 mt-1">Due in 2 days</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="text-sm font-medium text-gray-900">User testing sessions</div>
                            <div className="text-xs text-gray-500 mt-1">Due in 5 days</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">In Progress (5)</div>
                        <div className="space-y-2">
                          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900">API documentation</div>
                            <div className="text-xs text-gray-500 mt-1">Due tomorrow</div>
                          </div>
                          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900">Database optimization</div>
                            <div className="text-xs text-gray-500 mt-1">Due in 3 days</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Done (12)</div>
                        <div className="space-y-2">
                          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900">Authentication setup</div>
                            <div className="text-xs text-gray-500 mt-1">Completed</div>
                          </div>
                          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900">Initial deployment</div>
                            <div className="text-xs text-gray-500 mt-1">Completed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose TeamSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for enterprise teams with security, scalability, and performance at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                SOC-2 compliant with end-to-end encryption, SSO integration, and GDPR ready. Your data is protected with enterprise-grade security.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scalable Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                From small teams to large enterprises. Our platform scales seamlessly with your organization's growth and changing needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Leaders</h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of teams at top companies who rely on TeamSync to deliver exceptional results and drive growth.
              </p>
            </div>
          </div>

          {/* Company Logos */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companyLogos.map((company, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what project managers and team leads are saying about TeamSync.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </span>
                  </div>
                  <blockquote className="text-xl md:text-2xl text-gray-900 font-medium mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="text-gray-600">
                    <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm">{testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={() => setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => prev === testimonials.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your team's needs. All plans include our core features with no hidden fees.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-lg font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Yearly</span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">{plan.description}</CardDescription>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full py-3 text-lg font-semibold rounded-xl ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
            </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TS</span>
                </div>
                <span className="text-2xl font-bold">TeamSync</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The next-generation project management platform for modern teams. Streamline workflows, track milestones, and accelerate growth.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 TeamSync. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky CTA Bar */}
        <div className="sticky bottom-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-lg font-semibold">Ready to accelerate your projects?</p>
              <p className="text-blue-100 text-sm">Join thousands of teams already using TeamSync</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-2 rounded-lg">
                Book Demo
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}