import React from "react";
import { Brain, Trophy, FileUser, Briefcase, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Stats {
  totalTests: number;
  completedTests: number;
  avgScore: string;
  totalResumes: number;
  totalApplications: number;
  pendingFollowups: number;
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  const statItems = [
    {
      title: "Tests Taken",
      value: stats.totalTests || 0,
      icon: Brain,
      accent: "blue"
    },
    {
      title: "Average Score",
      value: `${stats.avgScore || 0}%`,
      icon: Trophy,
      accent: "amber"
    },
    {
      title: "Resumes",
      value: stats.totalResumes || 0,
      icon: FileUser,
      accent: "green"
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
      icon: Briefcase,
      accent: "purple"
    },
    {
      title: "Completed",
      value: stats.completedTests || 0,
      icon: Target,
      accent: "indigo"
    },
    {
      title: "Follow-ups",
      value: stats.pendingFollowups || 0,
      icon: Clock,
      accent: "red"
    }
  ];

  const accentMap: Record<string, string> = {
    blue: "text-blue-500 dark:text-blue-300 ring-blue-400/40 bg-blue-500/10",
    amber: "text-amber-500 dark:text-amber-300 ring-amber-400/40 bg-amber-500/10",
    green: "text-green-500 dark:text-green-300 ring-green-400/40 bg-green-500/10",
    purple: "text-purple-500 dark:text-purple-300 ring-purple-400/40 bg-purple-500/10",
    indigo: "text-indigo-500 dark:text-indigo-300 ring-indigo-400/40 bg-indigo-500/10",
    red: "text-red-500 dark:text-red-300 ring-red-400/40 bg-red-500/10",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <Card
          key={stat.title}
          className="bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700/40 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              
              {/* Icon Badge */}
              <div
                className={`w-10 h-10 rounded-lg ring-1 flex items-center justify-center ${accentMap[stat.accent]}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>

              {/* Value */}
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
