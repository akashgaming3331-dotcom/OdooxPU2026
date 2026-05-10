"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Calendar, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Traveloop</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="h-10 px-5 flex items-center justify-center rounded-full bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card mb-8 text-sm text-brand-300 font-medium border-brand-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>The new standard for travel planning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-center max-w-4xl tracking-tight leading-tight mb-6"
        >
          Design your perfect trip with <span className="text-gradient">precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 text-center max-w-2xl mb-10"
        >
          Build multi-city itineraries, manage budgets, and track activities in one collaborative workspace designed for modern travelers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/dashboard"
            className="h-14 px-8 rounded-full bg-brand-600 text-white flex items-center justify-center gap-2 font-medium hover:bg-brand-500 transition-colors text-lg"
          >
            Create Itinerary
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="h-14 px-8 rounded-full glass text-white flex items-center justify-center font-medium hover:bg-white/10 transition-colors text-lg">
            Explore Public Trips
          </button>
        </motion.div>

        {/* Feature Preview Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {[
            {
              icon: MapPin,
              title: "Multi-City Routing",
              desc: "Seamlessly connect flights, trains, and stays across multiple destinations.",
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            },
            {
              icon: Calendar,
              title: "Smart Itineraries",
              desc: "Drag and drop activities into an intuitive timeline that adjusts to your pace.",
              color: "text-brand-400",
              bg: "bg-brand-400/10",
            },
            {
              icon: Globe,
              title: "Live Budgets",
              desc: "Track expenses across different currencies in real-time as you plan.",
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-card p-8 flex flex-col items-start hover:border-neutral-700 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
