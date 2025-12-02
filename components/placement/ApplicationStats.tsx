import React from "react";
import { Building, Clock, CheckCircle, XCircle, Calendar, Trophy } from "lucide-react";
import { Application } from "@prisma/client";

interface Props {
  applications: Application[];
  darkMode?: boolean;
}

export default function ApplicationStats({ applications, darkMode }: Props) {
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviews: applications.filter(a => a.status === 'interview_scheduled').length,
    offers: applications.filter(a => a.status === 'offer_received').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    pending_followups: applications.filter(a => 
      a.followUpDate && new Date(a.followUpDate) <= new Date()
    ).length
  };

  const statItems = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Building,
      color: darkMode
        ? "bg-gray-800 border-gray-700 text-gray-100"
        : "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: Clock,
      color: darkMode
        ? "bg-yellow-900/30 border-yellow-700 text-yellow-300"
        : "bg-amber-50 border-amber-200 text-amber-700"
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: Calendar,
      color: darkMode
        ? "bg-purple-900/30 border-purple-700 text-purple-300"
        : "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Trophy,
      color: darkMode
        ? "bg-green-900/30 border-green-700 text-green-300"
        : "bg-emerald-50 border-emerald-200 text-emerald-700"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: darkMode
        ? "bg-red-900/30 border-red-700 text-red-300"
        : "bg-rose-50 border-rose-200 text-rose-700"
    },
    {
      title: "Follow-ups Due",
      value: stats.pending_followups,
      icon: CheckCircle,
      color: darkMode
        ? "bg-orange-900/30 border-orange-700 text-orange-300"
        : "bg-orange-50 border-orange-200 text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.color} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <stat.icon className="w-5 h-5" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium tracking-wide">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
