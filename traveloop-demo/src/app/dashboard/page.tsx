"use client";

import { motion } from "framer-motion";
import { Plus, Calendar, MapPin, MoreHorizontal, Users } from "lucide-react";

const MOCK_TRIPS = [
  {
    id: "1",
    title: "European Summer Explorer",
    destinations: ["Paris", "Rome", "Barcelona"],
    startDate: "2024-06-15",
    endDate: "2024-07-02",
    status: "Planning",
    budget: "$4,500",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "2",
    title: "Tokyo Tech Week",
    destinations: ["Tokyo", "Kyoto"],
    startDate: "2024-09-10",
    endDate: "2024-09-24",
    status: "Upcoming",
    budget: "$3,200",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">My Trips</h2>
          <p className="text-neutral-400">Manage and plan your upcoming adventures.</p>
        </div>
        <button className="h-11 px-5 rounded-full bg-brand-600 text-white flex items-center justify-center gap-2 font-medium hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">
          <Plus className="w-5 h-5" />
          New Trip
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_TRIPS.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl overflow-hidden glass-card hover:border-brand-500/50 transition-colors cursor-pointer"
          >
            <div className="h-48 w-full relative">
              <div className="absolute inset-0 bg-neutral-900/60 z-10" />
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/20">
                  {trip.status}
                </span>
              </div>
              <button className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 relative z-20 bg-neutral-900/80 backdrop-blur-xl border-t border-white/5">
              <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-400 gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span>{trip.destinations.join(" • ")}</span>
                </div>
                <div className="flex items-center text-sm text-neutral-400 gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-300">2 Travelers</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 mb-0.5">Estimated Budget</p>
                  <p className="text-sm font-bold text-emerald-400">{trip.budget}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
