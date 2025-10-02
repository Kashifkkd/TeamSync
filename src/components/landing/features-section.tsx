"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Brain,
  Sparkles
} from "lucide-react";
import { HoverEffect } from "./hover-effect";
import { CardHoverEffect } from "./card-hover-effect";
import FeaturesSectionDemo1 from "@/components/features-section-demo-1";
import FeaturesSectionDemo2 from "@/components/features-section-demo-2";

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Target,
      title: "Milestone Tracking",
      description: "Visual timelines with progress bars and automated milestone notifications to keep projects on track.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-500/20",
      features: [
        "Visual timeline management",
        "Automated progress tracking",
        "Deadline notifications",
        "Sprint planning tools"
      ]
    },
    {
      icon: Zap,
      title: "Smart Task Management",
      description: "AI-powered prioritization, dependency mapping, and intelligent scheduling that adapts to your team's capacity.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-500/20",
      features: [
        "AI-powered prioritization",
        "Dependency mapping",
        "Intelligent scheduling",
        "Capacity planning"
      ]
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Live editing, instant updates, threaded comments, and @mentions to keep everyone aligned and informed.",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      borderColor: "border-green-500/20",
      features: [
        "Live editing capabilities",
        "Instant updates",
        "Threaded discussions",
        "@mention notifications"
      ]
    },
    {
      icon: BarChart3,
      title: "AI-powered Insights",
      description: "Predictive analytics, productivity forecasting, and intelligent recommendations to optimize team performance.",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-500/20",
      features: [
        "Predictive analytics",
        "Productivity forecasting",
        "Smart recommendations",
        "Performance insights"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC-2 compliant with end-to-end encryption, SSO integration, and GDPR ready. Your data is protected with enterprise-grade security.",
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-500/10 to-cyan-600/10",
      borderColor: "border-cyan-500/20",
      features: [
        "SOC-2 compliance",
        "End-to-end encryption",
        "SSO integration",
        "GDPR ready"
      ]
    },
    {
      icon: Brain,
      title: "Advanced Analytics",
      description: "Comprehensive reporting, team performance metrics, and data-driven insights to optimize your workflow and productivity.",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-500/10 to-pink-600/10",
      borderColor: "border-pink-500/20",
      features: [
        "Comprehensive reporting",
        "Team performance metrics",
        "Data-driven insights",
        "Workflow optimization"
      ]
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Everything Your Team Needs
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From planning to execution, TeamSync provides all the tools your team needs to deliver exceptional results.
          </p>
        </div>

        {/* First Features Section - Grid Pattern */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Core Features
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage projects, track progress, and collaborate with your team.
            </p>
          </div>
          <FeaturesSectionDemo1 />
        </div>

        {/* Second Features Section - Icon-based */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Advanced Capabilities
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Powerful tools and integrations that scale with your team's needs.
            </p>
          </div>
          <FeaturesSectionDemo2 />
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                See TeamSync in Action
              </h3>
              <p className="text-gray-300">
                Experience the power of our platform with this interactive preview.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Project Overview */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Project Overview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 text-center border border-blue-500/20">
                      <div className="text-3xl font-bold text-blue-400">12</div>
                      <div className="text-sm text-blue-300">Active Projects</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 text-center border border-green-500/20">
                      <div className="text-3xl font-bold text-green-400">94%</div>
                      <div className="text-sm text-green-300">On Time</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 text-center border border-purple-500/20">
                      <div className="text-3xl font-bold text-purple-400">156</div>
                      <div className="text-sm text-purple-300">Tasks Done</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-4 text-center border border-orange-500/20">
                      <div className="text-3xl font-bold text-orange-400">8</div>
                      <div className="text-sm text-orange-300">Milestones</div>
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Project Progress</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Q1 Product Launch</span>
                      <span className="text-sm font-bold text-white">87%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000" style={{width: '87%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Mobile App Development</span>
                      <span className="text-sm font-bold text-white">64%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-1000" style={{width: '64%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">API Integration</span>
                      <span className="text-sm font-bold text-white">92%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kanban Board */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Task Board</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">To Do (8)</div>
                    <div className="space-y-2">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">Design system updates</div>
                        <div className="text-xs text-gray-400 mt-1">Due in 2 days</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">User testing sessions</div>
                        <div className="text-xs text-gray-400 mt-1">Due in 5 days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">In Progress (5)</div>
                    <div className="space-y-2">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">API documentation</div>
                        <div className="text-xs text-gray-400 mt-1">Due tomorrow</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">Database optimization</div>
                        <div className="text-xs text-gray-400 mt-1">Due in 3 days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Done (12)</div>
                    <div className="space-y-2">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">Authentication setup</div>
                        <div className="text-xs text-gray-400 mt-1">Completed</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="text-sm font-medium text-white">Initial deployment</div>
                        <div className="text-xs text-gray-400 mt-1">Completed</div>
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
  );
}
