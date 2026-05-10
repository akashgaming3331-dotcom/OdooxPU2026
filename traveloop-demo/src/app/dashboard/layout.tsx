import { Plane, Map, Wallet, Settings, LogOut, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Traveloop</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Overview</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand-500/10 text-brand-300 font-medium">
            <Map className="w-5 h-5" />
            My Trips
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
            <Wallet className="w-5 h-5" />
            Budget Tracker
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
            Explore
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer mb-1">
            <Settings className="w-5 h-5" />
            Settings
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            Log Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-md">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search trips..." 
                className="w-64 h-10 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border-2 border-neutral-900" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
