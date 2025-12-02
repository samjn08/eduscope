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
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#4d8aff]",
      iconColor: "text-[#4d8aff]",
    },
    {
      title: "Average Score",
      value: `${stats.avgScore || 0}%`,
      icon: Trophy,
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#facc15]",
      iconColor: "text-[#facc15]",
    },
    {
      title: "Resumes",
      value: stats.totalResumes || 0,
      icon: FileUser,
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#22c55e]",
      iconColor: "text-[#22c55e]",
    },
    {
      title: "Applications",
      value: stats.totalApplications || 0,
      icon: Briefcase,
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#a855f7]",
      iconColor: "text-[#a855f7]",
    },
    {
      title: "Completed",
      value: stats.completedTests || 0,
      icon: Target,
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#6366f1]",
      iconColor: "text-[#6366f1]",
    },
    {
      title: "Follow-ups",
      value: stats.pendingFollowups || 0,
      icon: Clock,
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#ef4444]",
      iconColor: "text-[#ef4444]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <Card
          key={stat.title}
          className="bg-[#0e182e] border border-[#1c293f] shadow-xl hover:shadow-lg transition-shadow duration-200"
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-lg ring-1 flex items-center justify-center ${stat.bgColor} ${stat.ringColor}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <div className="text-xs font-medium text-gray-400">{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
