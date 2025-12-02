'use client'
import React from "react";
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    } catch {
      console.log("User not logged in");
    }
  };

  const navigationItems = [
    { title: "Dashboard", url: "dashboard", icon: LayoutDashboard, color: "text-[#4d8aff]" },
    { title: "Mock Tests", url: "mock-tests", icon: Brain, color: "text-[#a855f7]" },
    { title: "Resume Manager", url: "resume-manager", icon: FileUser, color: "text-[#22c55e]" },
    { title: "Placement Tracker", url: "placement-tracker", icon: Briefcase, color: "text-[#f97316]" },
  ];

  const isActive = (url: string) => location.startsWith(url);

  return (
    <div className="min-h-screen bg-[#091222] text-white">
      <Toaster richColors />

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0e182e] border-b border-[#1c293f] shadow-sm p-4 relative z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src='/logo.png' alt="Logo" width={40} height={40} className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">EduScope</h1>
              <p className="text-xs text-gray-400">Student Portal</p>
            </div>
          </div>
          <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="ghost" size="sm">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0e182e] border-r border-[#1c293f] transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-[#1c293f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Image src='/logo.png' alt="Logo" width={40} height={40} className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">EduScope</h1>
              <p className="text-sm text-gray-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`block transition-colors duration-200`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.url)
                  ? 'bg-[#132040] text-[#4d8aff] border-l-4 border-[#4d8aff]'
                  : 'text-gray-300 hover:bg-[#132040] hover:text-white'
              }`}>
                <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-[#4d8aff]' : item.color}`} />
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-[#1c293f] p-4 bg-[#0e182e]">
          {user && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#132040] flex items-center justify-center overflow-hidden">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover"
                  />
                ) : (
                  <span className="text-gray-400 font-semibold">
                    {user.user_metadata.full_name ? user.user_metadata.full_name.charAt(0) : 'S'}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Samarth Jain</p>
                <p className="text-xs text-gray-400">{user.email || 'No Email'}</p>
              </div>
              <Button
  onClick={async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  }}
  variant="outline"
  size="sm"
  className="
    w-full 
    !text-gray-200 
    !border-white/10 
    !bg-white/5 
    backdrop-blur 
    hover:!bg-white/10 
    hover:!border-[#4d8aff]/40 
    hover:!text-white 
    transition-all 
    duration-200 
    rounded-md
  "
>
  Sign Out
</Button>

            </div>
          )}
          <p className="text-xs text-gray-500 text-center mt-2">© 2025 EduScope for Students</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
