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

// Skeleton loaders
function SkeletonCard({ height = 20, width = 'full', className = '' }) {
  return (
    <div className={`bg-gray-700 rounded animate-pulse ${className}`} style={{ height, width }} />
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
    <div className="min-h-screen bg-[#091222] p-6 space-y-8 text-gray-200">

      {/* Hero Section */}
      <div className="text-center space-y-3 py-8">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-[#0c1426] rounded-xl flex items-center justify-center ring-1 ring-[#4d8aff]">
            <Trophy className="w-7 h-7 text-[#4d8aff]" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Welcome to EduScope
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Your platform for placement preparation featuring AI-powered mock tests, <br /> resume optimization, and application tracking.
        </p>
      </div>

      {/* User Welcome Card */}
      {user ? (
        <Card className="border border-[#1c293f] shadow-xl bg-[#0e182e] hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Welcome back, <span className="text-[#4d8aff]">Samarth</span> </h2> <p className="text-s mt-3 text-gray-400"> CSE • 2026 • GGSIPU </p>
              </div>
              {user.subscription !== 'pro' && (
                <div className="flex-shrink-0">
                  <Button className="bg-gradient-to-r from-[#4d8aff] to-[#22c55e] hover:from-[#3c6dd6] hover:to-[#16a34a] text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 px-5 py-3 transition-transform duration-200 hover:scale-105">
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard height={120} />
      )}

      {/* Quick Actions */}
      {user ? <QuickActions userType={user.subscription} /> : <SkeletonGrid count={2} />}

      {/* Stats Grid */}
      {stats ? <DashboardStats stats={stats} /> : <SkeletonGrid count={3} />}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {recentTests ? (
          <RecentActivity 
            title="Recent Mock Tests"
            items={recentTests}
            type="tests"
            emptyMessage="No tests taken yet"
            icon={Brain}
            className="bg-[#0e182e] border border-[#1c293f] shadow-xl"
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
            className="bg-[#0e182e] border border-[#1c293f] shadow-xl"
          />
        ) : (
          <SkeletonGrid count={1} />
        )}
      </div>
    </div>
  );
}
