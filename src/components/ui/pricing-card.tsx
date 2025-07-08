"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Crown, Zap, Rocket } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  stripePriceId: string;
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface PricingCardProps {
  tier: PricingTier;
  loading: boolean;
  onSubscribe: (priceId: string) => Promise<void>;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started with AI pitch generation",
    price: 19,
    currency: "USD",
    interval: "month",
    stripePriceId: "price_starter_monthly",
    icon: Zap,
    features: [
      "Up to 5 pitch decks per month",
      "Basic AI pitch generation",
      "PDF export",
      "Email support",
      "Standard templates"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Everything you need to create compelling pitches",
    price: 49,
    currency: "USD",
    interval: "month",
    stripePriceId: "price_professional_monthly",
    popular: true,
    icon: Crown,
    features: [
      "Unlimited pitch decks",
      "Advanced AI pitch generation",
      "PDF & PowerPoint export",
      "Priority support",
      "Custom branding",
      "Team collaboration",
      "Analytics dashboard"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Advanced features for growing teams",
    price: 99,
    currency: "USD",
    interval: "month",
    stripePriceId: "price_enterprise_monthly",
    icon: Rocket,
    features: [
      "Everything in Professional",
      "White-label solution",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security",
      "Custom training"
    ]
  }
];

const PricingCard: React.FC<PricingCardProps> = ({ tier, loading, onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const IconComponent = tier.icon;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      await onSubscribe(tier.stripePriceId);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card 
      className={`relative h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        tier.popular 
          ? "border-2 border-primary-purple ring-2 ring-primary-purple ring-opacity-20" 
          : "border border-gray-700 hover:border-primary-purple"
      } bg-card-background/80 backdrop-blur-sm`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary-purple to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${
            tier.popular 
              ? "bg-gradient-to-r from-primary-purple to-pink-500" 
              : "bg-gray-700"
          }`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold text-white">
          {tier.name}
        </CardTitle>
        
        <CardDescription className="text-text-gray mt-2">
          {tier.description}
        </CardDescription>
        
        <div className="mt-4">
          <span className="text-4xl font-bold text-white">
            ${tier.price}
          </span>
          <span className="text-text-gray ml-1">
            /{tier.interval}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-text-gray text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 mt-auto">
        <Button
          onClick={handleSubscribe}
          disabled={loading || isProcessing}
          className={`w-full h-12 font-medium transition-all duration-200 ${
            tier.popular
              ? "bg-gradient-to-r from-primary-purple to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
              : "bg-button-secondary hover:bg-gray-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingCards: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateCheckoutSession = async (priceId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      // You could show a toast notification here
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-text-gray max-w-2xl mx-auto">
          Select the perfect plan for your needs. All plans include our core AI pitch generation features.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {pricingTiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            loading={loading}
            onSubscribe={handleCreateCheckoutSession}
          />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-text-gray text-sm">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </div>
  );
};

export const PricingSection = PricingCards;