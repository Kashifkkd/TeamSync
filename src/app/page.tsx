import { HeroSection } from "@/components/landing/hero-section";
import { HeroParallaxSection } from "@/components/landing/hero-parallax-section";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import { BackgroundBeams } from "@/components/landing/background-beams";
import { SparklesBackground } from "@/components/landing/sparkles-background";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <SparklesBackground />
      <BackgroundBeams />

      {/* Navigation */}
      <FloatingNavbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <HeroParallaxSection />
        <ProductShowcase />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}