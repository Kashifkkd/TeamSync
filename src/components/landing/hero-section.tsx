"use client";

import { useState, useEffect } from "react";
import { Zap, Users, Target, TrendingUp } from "lucide-react";
import { TextGenerateEffect } from "./text-generate-effect";
import { BackgroundBeams } from "./background-beams";
import { Spotlight } from "./spotlight";
import { TypewriterEffect } from "./typewriter-effect";
import { AuroraBackground } from "./aurora-background";
import { VortexBackground } from "./vortex-background";
import { Meteors } from "./meteors";
import { WavyBackground } from "./wavy-background";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "@/components/ui/animated-modal";

export function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const words = [
        {
            text: "Transform",
        },
        {
            text: "Your",
        },
        {
            text: "Team's",
        },
        {
            text: "Productivity.",
            className: "text-blue-400",
        },
    ];

    const features = [
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Lightning Fast",
            description: "10x faster project delivery"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Team Collaboration",
            description: "Seamless team coordination"
        },
        {
            icon: <Target className="h-6 w-6" />,
            title: "Goal Tracking",
            description: "Achieve every milestone"
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            title: "Analytics",
            description: "Data-driven insights"
        }
    ];

    const dashboardContent = (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">TS</span>
                    </div>
                    <span className="font-semibold text-white">TeamSync Dashboard</span>
                </div>
                <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">24</div>
                    <div className="text-sm text-gray-400">Active Tasks</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">87%</div>
                    <div className="text-sm text-gray-400">On Track</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">5</div>
                    <div className="text-sm text-gray-400">Milestones</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">12</div>
                    <div className="text-sm text-gray-400">Team Members</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Project Alpha</span>
                    <span className="text-white font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-2000 ease-out" style={{ width: '75%' }}></div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">To Do</div>
                    <div className="bg-white/5 rounded-lg p-3 text-xs border border-white/10">
                        <div className="text-white font-medium">Design mockups</div>
                        <div className="text-gray-400 text-xs mt-1">Due in 2 days</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-xs border border-white/10">
                        <div className="text-white font-medium">User research</div>
                        <div className="text-gray-400 text-xs mt-1">Due in 5 days</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">In Progress</div>
                    <div className="bg-blue-500/10 rounded-lg p-3 text-xs border border-blue-500/20">
                        <div className="text-white font-medium">API development</div>
                        <div className="text-gray-400 text-xs mt-1">Due tomorrow</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 text-xs border border-blue-500/20">
                        <div className="text-white font-medium">Database setup</div>
                        <div className="text-gray-400 text-xs mt-1">Due in 3 days</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Done</div>
                    <div className="bg-green-500/10 rounded-lg p-3 text-xs border border-green-500/20">
                        <div className="text-white font-medium">Project setup</div>
                        <div className="text-gray-400 text-xs mt-1">Completed</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 text-xs border border-green-500/20">
                        <div className="text-white font-medium">Requirements</div>
                        <div className="text-gray-400 text-xs mt-1">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="relative overflow-hidden">
            {/* Animated Background Effects */}
            <AuroraBackground />
            <VortexBackground />
            <WavyBackground />
            <BackgroundBeams />
            <Meteors number={30} />

            {/* Multiple Spotlights */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <Spotlight className="top-40 right-0 md:right-60 md:top-20" fill="blue" />
            <Spotlight className="bottom-40 left-1/2 transform -translate-x-1/2" fill="purple" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-purple-900/30" />

            <div className="relative z-10">
                <ContainerScroll
                    titleComponent={
                        <div className="text-center space-y-8">

                            {/* Main Heading */}
                            <div className="space-y-6">
                                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                    <TypewriterEffect words={words} />
                                </h1>
                                <TextGenerateEffect
                                    words="The most powerful project management platform that transforms how teams collaborate, track progress, and deliver exceptional results."
                                    className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
                                />
                            </div>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap justify-center gap-4 mb-20">
                                {features.map((feature, index) => (
                                    <PointerHighlight key={index} rectangleClassName="border-blue-500/50" pointerClassName="text-blue-500">
                                        <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                                            <div className="text-blue-400">{feature.icon}</div>
                                            <span className="text-sm text-white font-medium">{feature.title}</span>
                                        </div>
                                    </PointerHighlight>
                                ))}
                            </div>

                            {/* CTA Button */}
                            {/* <div className="flex justify-center">
                                <HoverBorderGradient
                                    containerClassName="rounded-full cursor-pointer"
                                    as="div"
                                    className="bg-black text-white border-none"
                                >
                                    <Modal>
                                        <ModalTrigger>
                                            <span className="flex items-center space-x-2 px-6 py-3 text-lg font-semibold">
                                                <span>Start Free Trial</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </ModalTrigger>
                                        <ModalBody>
                                            <ModalContent>
                                                <div className="text-center">
                                                    <h3 className="text-2xl font-bold text-white mb-4">Get Started with TeamSync</h3>
                                                    <p className="text-gray-300 mb-6">Create your account and start managing projects like never before.</p>
                                                    <Link href="/auth/signup">
                                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                                            Create Account
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </ModalContent>
                                        </ModalBody>
                                    </Modal>
                                </HoverBorderGradient>
                            </div> */}

                            {/* Trust Indicators */}
                            {/* <div className="flex flex-wrap justify-center mt-20 items-center gap-8 text-sm text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Free 14-day trial</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Setup in 5 minutes</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>24/7 support</span>
                                </div>
                            </div> */}
                        </div>
                    }
                >
                    {dashboardContent}
                </ContainerScroll>
            </div>
        </section>
    );
}