"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

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
        "Standard security",
        "Mobile app access",
        "Basic analytics"
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
        "Advanced security",
        "Time tracking",
        "Custom fields",
        "API access"
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
        "Dedicated account manager",
        "White-label options",
        "SSO integration",
        "Advanced reporting"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Choose the plan that fits your team&apos;s needs. All plans include our core features with no hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isYearly ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <CardSpotlight key={index} className="h-full">
              <Card className={`relative h-full border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30 shadow-2xl' 
                  : 'bg-white/5 backdrop-blur-xl border border-white/10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-300 mb-6">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                    {isYearly && (
                      <div className="text-sm text-green-400 mt-2">
                        ${Math.round((plan.price.monthly * 12 - plan.price.yearly) / 12)}/month savings
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.cta === "Contact Sales" ? "/contact" : "/auth/signup"}>
                    <Button 
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 group ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  {plan.cta === "Start Free Trial" && (
                    <p className="text-center text-sm text-gray-400">
                      Free 14-day trial • No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            </CardSpotlight>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              All plans include
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>Data encryption at rest</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>Regular security updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>Mobile & desktop apps</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we&apos;ll prorate any billing differences.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">
                What happens to my data if I cancel?
              </h4>
              <p className="text-gray-300">
                Your data is safe with us. You can export all your data before canceling, and we&apos;ll keep it for 30 days in case you want to reactivate.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">
                Do you offer custom pricing?
              </h4>
              <p className="text-gray-300">
                Yes, we offer custom pricing for large enterprises with specific needs. Contact our sales team to discuss your requirements.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">
                Is there a free trial?
              </h4>
              <p className="text-gray-300">
                Yes, all paid plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
