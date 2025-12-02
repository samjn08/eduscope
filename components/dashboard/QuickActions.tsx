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
      iconColor: "text-blue-400 dark:text-blue-300",
    },
    {
      title: "Manage Resume",
      description: "Upload and get ATS compatibility scores",
      icon: FileUser,
      url: "/resume-manager",
      iconColor: "text-green-400 dark:text-green-300",
    },
    {
      title: "Track Applications",
      description: "Monitor your job application progress",
      icon: Briefcase,
      url: "/placement-tracker",
      iconColor: "text-purple-400 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Quick Actions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Jump into your preparation journey
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link key={action.title} href={action.url} className="group">
            <Card className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 shadow-md hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center shadow-inner">
                    <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {action.description}
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
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
      {userType !== "pro" && (
        <div className="flex justify-center">
          <Card className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-2xl transition-all duration-300 w-full">
            <CardContent className="p-6 text-center space-y-6 flex flex-col items-center">

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full flex items-center justify-center shadow-lg ring-1 ring-blue-400/40 dark:ring-blue-300/30">
                <Target className="w-7 h-7 text-gray-900 dark:text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">
                Unlock Pro Features
              </h3>

              {/* Features List */}
              <div className="grid md:grid-cols-3 gap-10 text-sm text-gray-700 dark:text-gray-300 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-blue-400" /> Unlimited AI Tests
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-green-400" /> Advanced Analytics
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-purple-400" /> Premium Content
                </div>
              </div>

              {/* Button */}
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 px-8 py-3 transition-transform duration-200 hover:scale-105">
                <Zap className="w-5 h-5" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
