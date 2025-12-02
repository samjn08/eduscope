'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Briefcase, Trophy, Crown } from "lucide-react";

import DashboardStats, { Stats } from "@/components/dashboard/stats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { getApplications, getDashboardStats, getTests, getUser } from "@/app/server/db";
import { Application, Test, User } from "@prisma/client";

// Skeletons — now theme-aware
function SkeletonCard({ height = 20, width = 'full', className = '' }) {
  return (
    <div
      className={`rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}
      style={{ height, width }}
    />
  );
}

function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} height={150} className="p-6" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTests, setRecentTests] = useState<Test[] | null>(null);
  const [recentApps, setRecentApps] = useState<Application[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await getUser();
      if (!userData) return;
      setUser(userData);

      const dashboardData = await getDashboardStats();
      const tests = await getTests(5);
      const applications = await getApplications(5);

      setStats({
        totalTests: dashboardData?.totalTests ?? 0,
        completedTests: dashboardData?.completedTests ?? 0,
        avgScore: dashboardData?.avgScore?.toFixed(1) ?? "0.0",
        totalResumes: dashboardData?.totalResumes ?? 0,
        totalApplications: dashboardData?.totalApplications ?? 0,
        pendingFollowups: dashboardData?.pendingFollowups ?? 0,
      });

      setRecentTests(tests);
      setRecentApps(applications);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8 text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-[#091222] transition-colors">

      {/* Hero */}
      <div className="text-center space-y-2 py-6 md:py-8">
  {/* Icon */}
  <div className="flex justify-center mb-4">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ring-2 ring-[#4d8aff] bg-gray-100 dark:bg-[#0c1426]">
      <Trophy className="w-6 h-6 md:w-7 md:h-7 text-[#4d8aff]" />
    </div>
  </div>

  {/* Heading */}
  <h1 className="text-2xl md:text-3xl font-bold md:font-semibold tracking-tight text-gray-900 dark:text-white">
    Welcome to EduScope
  </h1>

  {/* Subtext */}
  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
    Your platform for placement preparation featuring AI-powered mock tests, resume optimization, and application tracking.
  </p>
</div>


      {/* User Card */}
{user ? (
  <Card className="shadow-xl border border-gray-200 dark:border-[#1c293f] bg-white dark:bg-[#0e182e] rounded-2xl transition-colors">
    <CardContent className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* User Info */}
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
            Welcome back, <span className="text-[#4d8aff]">Samarth!</span>
          </h2>
          <p className="inline-block text-sm md:text-base text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#132040] px-4 py-2 rounded-xl font-medium tracking-wide shadow-sm">
            CSE • 2026 • GGSIPU
          </p>
        </div>

        {/* Upgrade Button */}
        {user.subscription !== "pro" && (
          <Button className="bg-gradient-to-r from-[#4d8aff] to-[#22c55e] hover:from-[#3c6dd6] hover:to-[#16a34a] text-white font-semibold rounded-xl shadow-lg flex items-center gap-3 px-6 py-3 transition-transform hover:scale-105 hover:shadow-2xl">
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </Button>
        )}

      </div>
    </CardContent>
  </Card>
) : (
  <SkeletonCard height={140} />
)}


      {/* Quick Actions */}
      {user ? <QuickActions userType={user.subscription} /> : <SkeletonGrid count={2} />}

      {/* Stats */}
      {stats ? <DashboardStats stats={stats} /> : <SkeletonGrid count={3} />}

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {recentTests ? (
          <RecentActivity
            title="Recent Mock Tests"
            items={recentTests}
            type="tests"
            emptyMessage="No tests taken yet"
            icon={Brain}
            className="shadow-lg bg-white dark:bg-[#0e182e] border-gray-300 dark:border-[#1c293f]"
          />
        ) : (
          <SkeletonGrid count={1} />
        )}

        {recentApps ? (
          <RecentActivity
            title="Recent Applications"
            items={recentApps}
            type="applications"
            emptyMessage="No applications yet"
            icon={Briefcase}
            className="shadow-lg bg-white dark:bg-[#0e182e] border-gray-300 dark:border-[#1c293f]"
          />
        ) : (
          <SkeletonGrid count={1} />
        )}
      </div>
    </div>
  );
}
