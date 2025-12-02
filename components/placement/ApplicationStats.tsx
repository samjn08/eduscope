import React from "react";
import { Building, Clock, CheckCircle, XCircle, Calendar, Trophy } from "lucide-react";
import { Application } from "@prisma/client";

interface Props {
  applications: Application[];
}

export default function ApplicationStats({ applications }: Props) {
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
      bg: "bg-blue-50 dark:bg-gray-800",
      border: "border-blue-200 dark:border-gray-700",
      text: "text-blue-700 dark:text-gray-100",
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: Clock,
      bg: "bg-amber-50 dark:bg-yellow-900/30",
      border: "border-amber-200 dark:border-yellow-700",
      text: "text-amber-700 dark:text-yellow-300",
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: Calendar,
      bg: "bg-purple-50 dark:bg-purple-900/30",
      border: "border-purple-200 dark:border-purple-700",
      text: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Trophy,
      bg: "bg-emerald-50 dark:bg-green-900/30",
      border: "border-emerald-200 dark:border-green-700",
      text: "text-emerald-700 dark:text-green-300",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      bg: "bg-rose-50 dark:bg-red-900/30",
      border: "border-rose-200 dark:border-red-700",
      text: "text-rose-700 dark:text-red-300",
    },
    {
      title: "Follow-ups Due",
      value: stats.pending_followups,
      icon: CheckCircle,
      bg: "bg-orange-50 dark:bg-orange-900/30",
      border: "border-orange-200 dark:border-orange-700",
      text: "text-orange-700 dark:text-orange-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bg} ${stat.border} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <stat.icon className={`w-5 h-5 ${stat.text}`} />
            <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
            <div className={`text-xs font-medium tracking-wide ${stat.text}`}>{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
