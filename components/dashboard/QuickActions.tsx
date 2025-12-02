import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileUser, Briefcase, Zap, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Subscription } from "@prisma/client";

export default function QuickActions({ userType }: { userType: Subscription }) {
  const actions = [
    {
      title: "Take Mock Test",
      description: "AI-generated questions tailored to your level",
      icon: Brain,
      url: "/mock-tests",
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#4d8aff]",
      iconColor: "text-[#4d8aff]"
    },
    {
      title: "Manage Resume",
      description: "Upload and get ATS compatibility scores",
      icon: FileUser,
      url: "/resume-manager",
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#22c55e]",
      iconColor: "text-[#22c55e]"
    },
    {
      title: "Track Applications",
      description: "Monitor your job application progress",
      icon: Briefcase,
      url: "/placement-tracker",
      bgColor: "bg-[#0c1426]",
      ringColor: "ring-[#a855f7]",
      iconColor: "text-[#a855f7]"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Quick Actions</h2>
        <p className="text-gray-400">Jump into your preparation journey</p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link key={action.title} href={action.url} className="group">
            <Card className="bg-[#0e182e] border border-[#1c293f] shadow-xl hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-14 h-14 rounded-xl ring-1 flex items-center justify-center ${action.bgColor} ${action.ringColor}`}>
                    <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pro Upgrade Card */}
{userType !== 'pro' && (
  <div className="flex justify-center">
    <Card className="bg-[#0e182e] border border-[#1c293f] shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full">
      <CardContent className="p-6 text-center space-y-6 flex flex-col items-center">
        {/* Header Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#4d8aff]/40 to-[#22c55e]/40 rounded-full flex items-center justify-center shadow-lg ring-1 ring-[#4d8aff]">
            <Target className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white tracking-wide text-center">
          Unlock Pro Features
        </h3>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-10 text-sm text-gray-300 text-center">
          <div className="flex flex-col items-center gap-1 md:flex-row">
            <Zap className="w-4 h-4 text-[#4d8aff]" />
            Unlimited AI Tests
          </div>
          <div className="flex flex-col items-center gap-1 md:flex-row">
            <Zap className="w-4 h-4 text-[#22c55e]" />
            Advanced Analytics
          </div>
          <div className="flex flex-col items-center gap-1 md:flex-row">
            <Zap className="w-4 h-4 text-[#a855f7]" />
            Premium Content
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="flex justify-center w-full">
          <Button className="bg-gradient-to-r from-[#4d8aff] to-[#22c55e] hover:from-[#3c6dd6] hover:to-[#16a34a] text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 px-6 py-3 transition-transform duration-200 hover:scale-105">
            <Zap className="w-5 h-5" />
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}


    </div>
  );
}
