"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { InfiniteMovingCards } from "./infinite-moving-cards";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Globe } from "@/components/ui/globe";

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechCorp",
      content: "TeamSync transformed our project delivery. We've seen 40% faster completion rates and 95% on-time delivery since implementation. The AI insights are game-changing.",
      avatar: "SC",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Michael Rodriguez",
      role: "Project Manager",
      company: "InnovateLabs",
      content: "The AI insights are game-changing. We can now predict bottlenecks before they happen and adjust resources accordingly. Our team productivity increased by 60%.",
      avatar: "MR",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      company: "DataFlow Inc",
      content: "Real-time collaboration features have eliminated communication gaps. Our team is more aligned than ever before. The milestone tracking is incredibly intuitive.",
      avatar: "EW",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "David Kim",
      role: "CTO",
      company: "CloudScale",
      content: "The security features give us peace of mind. SOC-2 compliance and enterprise-grade encryption make it perfect for our sensitive projects. Highly recommended.",
      avatar: "DK",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      company: "NextGen",
      content: "The analytics dashboard provides incredible insights into our team's performance. We've optimized our workflows and reduced project delays by 70%.",
      avatar: "LT",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "James Wilson",
      role: "Engineering Director",
      company: "FutureSoft",
      content: "The integration capabilities are outstanding. We've connected all our tools seamlessly. The time saved on manual coordination is remarkable.",
      avatar: "JW",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  // Animated testimonials data with professional images
  const animatedTestimonials = [
    {
      quote: "TeamSync transformed our project delivery. We've seen 40% faster completion rates and 95% on-time delivery since implementation. The AI insights are game-changing.",
      name: "Sarah Chen",
      designation: "VP of Engineering, TechCorp",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    },
    {
      quote: "The AI insights are game-changing. We can now predict bottlenecks before they happen and adjust resources accordingly. Our team productivity increased by 60%.",
      name: "Michael Rodriguez",
      designation: "Project Manager, InnovateLabs",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    },
    {
      quote: "Real-time collaboration features have eliminated communication gaps. Our team is more aligned than ever before. The milestone tracking is incredibly intuitive.",
      name: "Emily Watson",
      designation: "Team Lead, DataFlow Inc",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    },
    {
      quote: "The security features give us peace of mind. SOC-2 compliance and enterprise-grade encryption make it perfect for our sensitive projects. Highly recommended.",
      name: "David Kim",
      designation: "CTO, CloudScale",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    },
    {
      quote: "The analytics dashboard provides incredible insights into our team's performance. We've optimized our workflows and reduced project delays by 70%.",
      name: "Lisa Thompson",
      designation: "Product Manager, NextGen",
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    },
    {
      quote: "The integration capabilities are outstanding. We've connected all our tools seamlessly. The time saved on manual coordination is remarkable.",
      name: "James Wilson",
      designation: "Engineering Director, FutureSoft",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&crop=face&auto=format&q=80"
    }
  ];

  const companyLogos = [
    "TechCorp", "InnovateLabs", "DataFlow", "CloudScale", "NextGen", "FutureSoft", "AlphaTech", "BetaCorp"
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what project managers and team leads are saying about TeamSync.
          </p>
        </div>

        {/* Animated Testimonials */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <AnimatedTestimonials 
              testimonials={animatedTestimonials} 
              autoplay={true}
            />
          </div>
        </div>

        {/* Infinite Moving Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            More Success Stories
          </h3>
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companyLogos.map((company, index) => (
              <div 
                key={index} 
                className="text-2xl font-bold text-gray-400 hover:text-white transition-colors duration-200"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
