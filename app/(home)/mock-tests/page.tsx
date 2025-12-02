'use client';
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Target, Zap } from "lucide-react";

import TestCreator, { TestConfig } from "@/components/test/TestCreator";
import TestList from "@/components/test/TestList";
import TestInterface, { TestResults } from "@/components/test/TestInterface";
import { generateMocktest } from "@/app/server/ai";
import { Test } from "@prisma/client";
import { getCurrentUser, getMockTests, updateTest } from "@/app/server/db";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center justify-between bg-[#0c1426] border border-[#1c293f] rounded-lg shadow-sm p-4 mb-3">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="w-12 h-4 bg-gray-700 rounded ml-4"></div>
    </div>
  );
}


export default function MockTests() {
  const [tests, setTests] = useState<Test[] | null>(null);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const UpdateMockTest = async (testId: string, results: TestResults) => {
    try {
      await updateTest(
        testId,
        results.status,
        results.score,
        results.correct_answers,
        results.wrong_answers,
        results.weak_areas,
        results.time_taken_minutes
      );
      setActiveTest(null);
      loadData();
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  const loadData = async () => {
    const userData = await getCurrentUser();
    setUser(userData);

    if (!userData) return;

    const userTests = await getMockTests(userData.id);
    setTests(userTests);
  };

  const generateAITest = async (config: TestConfig) => {
    try {
      const newTest = await generateMocktest(
        config.subject,
        config.difficulty,
        config.total_questions,
        config.duration_minutes
      );

      if (!newTest.ok) throw new Error("Failed to generate test");

      setActiveTest(newTest.test);
      loadData();
    } catch (error) {
      console.error("Error generating test:", error);
    }
  };

  const startTest = (test: Test) => {
    setActiveTest({ ...test, status: "in_progress" });
  };

  if (activeTest?.status === "in_progress") {
    return (
      <TestInterface
        test={activeTest}
        onComplete={async (testId: string, results: TestResults) =>
          await UpdateMockTest(testId, results)
        }
        onExit={() => setActiveTest(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-8 bg-[#091222] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Mock Tests
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            AI-powered practice tests with adaptive difficulty and detailed analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Test
          </Button>
        </div>
      </div>

      {/* Test Creator */}
      {showCreator && (
        <TestCreator
          onGenerate={generateAITest}
          onClose={() => setShowCreator(false)}
          userType={user?.user_metadata.subscription_status || 'free'}
        />
      )}

      {/* Tests List */}
<div ref={listRef}>
  {tests === null ? (
    <div className="space-y-3">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  ) : (
    <TestList
      tests={tests}
      onStartTest={startTest}
      onViewResults={(test: Test) => redirect(`/mock-tests/${test.id}`)}
    />
  )}
</div>


      {/* Pro Upsell */}
      {user?.user_metadata.subscription_status !== "pro" && (
        <div className="flex justify-center">
          <Card className="bg-[#1b0f3b52] border border-[#3e1a6b] shadow-lg hover:shadow-xl transition-all duration-200 w-full">
            <CardContent className="p-6 text-center">
              <div className="space-y-4 flex flex-col items-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-[#3e1a6b] rounded-xl flex items-center justify-center ring-1 ring-purple-400">
                    <Zap className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center">
                  Unlock Unlimited Tests
                </h3>
                <p className="text-gray-300 text-center">
                  Get unlimited AI-generated mock tests with detailed analytics and performance tracking.
                </p>
                <Button
                  variant="secondary"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
