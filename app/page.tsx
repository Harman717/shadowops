"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center text-center px-6 overflow-hidden relative">
      
      {/* Animated Background Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* Content Container - Properly Centered */}
      <div className="relative z-10 animate-fadeIn w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Animated Badge */}
        <div className="mb-6 inline-block animate-bounce">
          <span className="bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold">
            🚀 CI Risk Intelligence Platform
          </span>
        </div>

        {/* Main Heading with Animation */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-slideDown">
          ShadowOps
        </h1>

        {/* Subtitle with Fade In */}
        <p className="text-xl text-gray-300 max-w-2xl mb-12 animate-slideUp leading-relaxed">
          Transform GitHub CI telemetry into <span className="text-indigo-300 font-semibold">actionable engineering risk intelligence</span>.
          <br />
          Detect instability, identify failure patterns, and generate <span className="text-purple-300 font-semibold">AI-powered remediation insights</span>.
        </p>

        {/* CTA Button with Glow Effect */}
        <Link href="/dashboard">
          <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/50 transition transform hover:scale-105 animate-slideUp mb-20">
            <span className="relative z-10">Launch Dashboard</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition blur animate-pulse"></span>
          </button>
        </Link>

        {/* Feature Grid - Centered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Feature 
            title="Risk Detection"
            description="Analyze CI failures and detect degradation trends over time."
            icon="📊"
            delay="0"
          />
          <Feature 
            title="Pattern Intelligence"
            description="Automatically identify unstable workflows and failure clusters."
            icon="🔍"
            delay="100"
          />
          <Feature 
            title="AI Incident Report"
            description="Generate contextual remediation guidance instantly."
            icon="🤖"
            delay="200"
          />
        </div>

      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-slideUp:nth-child(2) {
          animation-delay: 0.2s;
        }

        .animate-slideUp:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

    </div>
  );
}

function Feature({ 
  title, 
  description, 
  icon,
  delay 
}: { 
  title: string; 
  description: string;
  icon: string;
  delay: string;
}) {
  return (
    <div 
      className="group bg-slate-900/60 border border-slate-700/50 hover:border-indigo-500/50 p-6 rounded-xl transition transform hover:scale-105 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon with Animation */}
      <div className="text-4xl mb-3 group-hover:scale-110 transition transform">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold mb-3 text-indigo-300 group-hover:text-indigo-200 transition">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition leading-relaxed">
        {description}
      </p>

      {/* Animated Border Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition blur-lg -z-10"></div>
    </div>
  );
}
