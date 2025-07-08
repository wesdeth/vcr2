"use client";

import { Mic, Search } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#6366F1] to-[#8B5CF6]"
        style={{
          backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/0a138aca-19d6-420e-989e-00798436c0c7/generated_images/rainbow-gradient-holographic-background--aa99d05c-20250708024001.jpg?')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="w-8 h-8 bg-white rounded-full opacity-90"></div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 hero-headline-italic drop-shadow-lg">
          Create Your VC-Ready Pitch
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md">
          Transform any startup idea into an investor-ready pitch site with AI in seconds.
        </p>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Build me a pitch for a SaaS platform that..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-6 py-4 bg-[#1F1F1F]/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 text-base shadow-xl"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200 shadow-lg">
            Startup Pitches
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200 shadow-lg">
            VC-Ready Decks
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200 shadow-lg">
            Investor Sites
          </button>
        </div>

        {/* Value Proposition */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-3xl mx-auto shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Turn Any Idea Into a VC-Ready Pitch Site
          </h2>
          <p className="text-white/80 text-lg">
            From concept to investor-ready presentation in seconds. No design skills needed.
          </p>
        </div>
      </div>
    </section>
  );
}