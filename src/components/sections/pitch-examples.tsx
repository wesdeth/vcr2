"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface PitchExample {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  previewUrl?: string;
}

const pitchExamples: PitchExample[] = [
  {
    id: "fintech-startup",
    title: "FinTech Startup",
    category: "Financial Technology",
    imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/0a138aca-19d6-420e-989e-00798436c0c7-orchids-app/assets/images/novalaunch-1.png?",
  },
  {
    id: "healthcare-ai",
    title: "Healthcare AI",
    category: "AI Platform",
    imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/0a138aca-19d6-420e-989e-00798436c0c7-orchids-app/assets/images/vitalsync-2.png?",
  },
];

export default function PitchExamples() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-purple-300 text-sm font-medium">Example Pitch Sites</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          See What You Can Create
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Real examples of investor-ready pitch sites generated in seconds. Your idea could be next.
        </p>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
        {pitchExamples.map((example) => (
          <div
            key={example.id}
            className="group relative bg-[#1F1F1F] rounded-[12px] overflow-hidden cursor-pointer transition-all duration-200 ease-in-out hover:shadow-[0_8px_32px_rgba(139,92,246,0.3)] hover:scale-[1.02]"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={() => setHoveredCard(example.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Example Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xs font-medium shadow-lg">
                Example
              </div>
            </div>

            <div className="relative w-full h-56 bg-gradient-to-br from-[#374151] to-[#1F1F1F] overflow-hidden">
              <Image
                src={example.imageUrl}
                alt={example.title}
                fill
                className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
            </div>
            
            <div className="p-6">
              <h3 
                className="text-white font-semibold mb-2 transition-colors duration-200 group-hover:text-[#8B5CF6]"
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "1.2",
                }}
              >
                {example.title}
              </h3>
              
              <p 
                className="text-[#9CA3AF] mb-4 transition-colors duration-200 group-hover:text-[#B5B5B5]"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.4",
                }}
              >
                {example.category}
              </p>

              <div className="text-xs text-purple-300 font-medium">
                Generated with AI • Investor Ready
              </div>
            </div>

            {hoveredCard === example.id && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6] to-transparent opacity-10 pointer-events-none transition-opacity duration-200" />
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          Create Your Pitch Site
        </button>
      </div>
    </div>
  );
}