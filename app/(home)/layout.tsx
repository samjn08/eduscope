"use client"
import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Brain, 
  FileUser, 
  Briefcase, 
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    loadUser();
  }, []);

  // Trigger loading whenever location changes
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300); // minimal delay for UX
    return () => clearTimeout(timeout);
  }, [location]);

  const loadUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    } catch {
      console.log("User not logged in");
    }
  };

  const navigationItems = [
    { title: "Dashboard", url: "dashboard", icon: LayoutDashboard, color: "text-blue-400" },
    { title: "Mock Tests", url: "mock-tests", icon: Brain, color: "text-purple-400" },
    { title: "Resume Manager", url: "resume-manager", icon: FileUser, color: "text-green-400" },
    { title: "Placement Tracker", url: "placement-tracker", icon: Briefcase, color: "text-orange-400" },
  ];

  const isActive = (url: string) => location.startsWith(url);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#091222] dark:text-white transition-colors relative">
      <Toaster richColors />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 dark:bg-[#0e182e] border-b border-gray-300 dark:border-[#1c293f] backdrop-blur shadow-sm p-4 relative z-50 transition-colors">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src='/logo.png' alt="Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-semibold">EduScope</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Student Portal</p>
            </div>
          </div>
          <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="ghost" size="sm">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0e182e] border-r border-gray-300 dark:border-[#1c293f] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-300 dark:border-[#1c293f] transition-all">
          <div className="flex items-center gap-3">
            <Image src='/logo.png' alt="Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-semibold">EduScope</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.title} href={item.url} onClick={() => setSidebarOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.url)
                    ? "dark:bg-[#132040] bg-blue-100 dark:text-blue-400 text-blue-700 border-l-4 border-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#132040]"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive(item.url) ? "text-blue-400" : item.color}`}
                />
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          ))}

          {/* Place ThemeToggle right below Placement Tracker */}
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-300 dark:border-[#1c293f] p-4 bg-white dark:bg-[#0e182e]">
          {user && (
            <div className="flex flex-col items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-[#132040] overflow-hidden flex items-center justify-center">
                {user.user_metadata.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="User Avatar" width={40} height={40} className="object-cover" />
                ) : (
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {user.user_metadata.full_name ? user.user_metadata.full_name.charAt(0) : "S"}
                  </span>
                )}
              </div>

              {/* Name + Email */}
              <div className="text-center">
                <p className="text-sm font-medium">Samarth Jain</p>
              </div>

              {/* Logout Button */}
              <Button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
                className="w-full dark:text-gray-200 dark:border-white/10 dark:bg-white/5 hover:dark:bg-white/10 hover:dark:border-blue-400/40 transition"
              >
                Sign Out
              </Button>
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            © 2025 EduScope
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-h-screen p-6 transition-colors relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center z-50">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
