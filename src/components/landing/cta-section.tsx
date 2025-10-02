"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Globe, MapPin } from "lucide-react";
import { BackgroundBeams } from "./background-beams";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import WorldMap from "@/components/ui/world-map";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "@/components/ui/animated-modal";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function CTASection() {
    const mapDots = [
        {
            start: { lat: 40.7128, lng: -74.0060, label: "New York" },
            end: { lat: 51.5074, lng: -0.1278, label: "London" }
        },
        {
            start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
            end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }
        },
        {
            start: { lat: 52.5200, lng: 13.4050, label: "Berlin" },
            end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }
        },
        {
            start: { lat: 48.8566, lng: 2.3522, label: "Paris" },
            end: { lat: 22.3193, lng: 114.1694, label: "Hong Kong" }
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <BackgroundBeams />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Main CTA */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Ready to Transform Your
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Project Management?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of teams already using TeamSync to deliver projects faster,
                            collaborate better, and achieve remarkable results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Modal>
                                <ModalTrigger>
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="bg-black text-white border-none"
                                    >
                                        <span className="flex items-center space-x-2 px-8 py-4 text-lg font-semibold">
                                            <span>Start Free Trial</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </span>
                                    </HoverBorderGradient>
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

                            <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-600 hover:border-gray-400 transition-all duration-200 bg-white/10 text-white hover:bg-white/20">
                                Schedule Demo
                            </Button>
                        </div>
                    </div>

                    {/* Global Reach Section */}
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                                <Globe className="h-6 w-6 text-blue-400" />
                                Trusted by Teams Worldwide
                            </h3>
                            <p className="text-gray-300">Join teams from around the globe who are already transforming their project management</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <WorldMap dots={mapDots} lineColor="#3b82f6" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {mapDots.flatMap(dot => [dot.start, dot.end]).map((location, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                                        <MapPin className="h-4 w-4 text-blue-400" />
                                        <span>{location.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}