"use client";

import { useState } from "react";
import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import CategoryTabs from "@/components/sections/category-tabs";
import PitchExamples from "@/components/sections/pitch-examples";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <Navigation />
      <main>
        <HeroSection />
        <section className="relative z-10 -mt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <CategoryTabs />
            <PitchExamples />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}