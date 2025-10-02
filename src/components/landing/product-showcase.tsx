"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Users, Target, BarChart3, Shield, Brain } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "@/components/ui/animated-modal";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const productFeatures = [
    {
      id: "dashboard",
      title: "Smart Dashboard",
      description: "Get a bird's eye view of all your projects with AI-powered insights and real-time analytics.",
      icon: <BarChart3 className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80",
      features: ["Real-time analytics", "AI-powered insights", "Customizable widgets", "Team performance metrics"]
    },
    {
      id: "kanban",
      title: "Advanced Kanban",
      description: "Visualize your workflow with our intelligent Kanban boards that adapt to your team's needs.",
      icon: <Target className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format&q=80",
      features: ["Drag & drop interface", "Custom status columns", "Automated workflows", "Progress tracking"]
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      description: "Seamless communication and collaboration tools that keep your team aligned and productive.",
      icon: <Users className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format&q=80",
      features: ["Real-time chat", "Video conferencing", "File sharing", "Comment threads"]
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Deep insights into team performance, project health, and productivity trends.",
      icon: <Brain className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80",
      features: ["Performance metrics", "Predictive analytics", "Custom reports", "Data visualization"]
    }
  ];

  const activeFeature = productFeatures.find(f => f.id === activeTab) || productFeatures[0];

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              See TeamSync in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how our powerful features can transform your team's productivity and project management workflow.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {productFeatures.map((feature) => (
              <PointerHighlight 
                key={feature.id} 
                rectangleClassName="border-blue-500/50" 
                pointerClassName="text-blue-500"
              >
                <button
                  onClick={() => setActiveTab(feature.id)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-full transition-all duration-300 ${
                    activeTab === feature.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <div className="text-xl">{feature.icon}</div>
                  <span className="font-semibold">{feature.title}</span>
                </button>
              </PointerHighlight>
            ))}
          </div>

          {/* Product Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{activeFeature.icon}</div>
                <h3 className="text-3xl font-bold text-white">{activeFeature.title}</h3>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {activeFeature.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {activeFeature.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <HoverBorderGradient
                  containerClassName="rounded-full cursor-pointer"
                  as="div"
                  className="bg-black text-white border-none"
                >
                  <Modal>
                    <ModalTrigger>
                      <span className="flex items-center space-x-2 px-6 py-3 font-semibold">
                        <span>Try This Feature</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </ModalTrigger>
                    <ModalBody>
                      <ModalContent>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-white mb-4">Experience {activeFeature.title}</h3>
                          <p className="text-gray-300 mb-6">Get hands-on with this powerful feature in our interactive demo.</p>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            Start Interactive Demo
                          </Button>
                        </div>
                      </ModalContent>
                    </ModalBody>
                  </Modal>
                </HoverBorderGradient>
                
                <Button 
                  variant="outline" 
                  className="px-6 py-3 font-semibold rounded-full border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  className="w-full h-96 object-cover transition-all duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Demo</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-white text-sm font-medium">
                    {activeFeature.title} Preview
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4 shadow-lg">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm opacity-90">Efficiency</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl p-4 shadow-lg">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Product Screenshots */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Mobile App",
                description: "Manage projects on the go",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format&q=80"
              },
              {
                title: "Team Workspace",
                description: "Collaborative team environment",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format&q=80"
              },
              {
                title: "Analytics Dashboard",
                description: "Comprehensive project insights",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format&q=80"
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
