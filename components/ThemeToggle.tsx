"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
   <Button
  className={`
    mx-auto flex items-center justify-center gap-2 mt-4
    px-4 py-2 rounded-xl transition-all group active:scale-[0.98]
    bg-transparent border

    ${theme === "dark"
      ? "text-white border-slate-600 hover:bg-slate-700"
      : "text-zinc-900 border-zinc-300 hover:bg-zinc-200"}
  `}
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  {theme === "dark" ? (
    <Sun className="w-5 h-5 text-yellow-400 transition-all duration-300 group-hover:rotate-90" />
  ) : (
    <Moon className="w-5 h-5 text-slate-700 transition-all duration-300 group-hover:rotate-0" />
  )}

  <span className="text-sm font-medium transition-opacity duration-300 group-hover:opacity-90">
    {theme === "dark" ? "Light Mode" : "Dark Mode"}
  </span>
</Button>



  );
}
