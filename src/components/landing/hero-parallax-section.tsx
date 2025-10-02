"use client";

import { HeroParallax } from "@/components/ui/hero-parallax";

export function HeroParallaxSection() {
  const products = [
    {
      title: "Smart Dashboard",
      link: "/dashboard",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Kanban Board",
      link: "/kanban",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Team Collaboration",
      link: "/collaboration",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Analytics Dashboard",
      link: "/analytics",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Mobile App",
      link: "/mobile",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Project Management",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Task Tracking",
      link: "/tasks",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Team Workspace",
      link: "/workspace",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format&q=80",
    },
    {
      title: "Reports & Insights",
      link: "/reports",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80",
    },
  ];

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Explore Our Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features and tools that make TeamSync the perfect solution for your project management needs.
          </p>
        </div>
        
        <HeroParallax products={products}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Interactive Product Tour
            </h3>
            <p className="text-gray-300">
              Click on any product to explore its features and capabilities
            </p>
          </div>
        </HeroParallax>
      </div>
    </section>
  );
}
