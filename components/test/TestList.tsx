import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Eye, Trophy, Clock, Target } from "lucide-react";
import { Difficulty, Subject, Test } from "@prisma/client";

export default function TestList({
  tests,
  onStartTest,
  onViewResults,
}: {
  tests: Test[];
  onViewResults: (test: Test) => void;
  onStartTest: (test: Test) => void;
}) {
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);

  const handleViewResults = async (test: Test) => {
    setLoadingTestId(test.id);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // optional: minimal delay for UX
    onViewResults(test);
    setLoadingTestId(null);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getSubjectColor = (subject: Subject) => {
    const colors: Record<Subject, string> = {
      quantitative: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      logical_reasoning:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      verbal: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      programming:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      general_knowledge:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      technical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    };
    return colors[subject] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  if (tests.length === 0) {
    return (
      <div className="rounded-lg border shadow-md p-8 text-center 
      bg-gray-100 text-gray-900 border-gray-200
      dark:bg-[#121a2c] dark:text-white dark:border-[#273347]"
      >
        <div className="text-5xl font-semibold text-gray-400 dark:text-gray-500 mb-4">
          ¯\_(ツ)_/¯
        </div>
        <h3 className="text-xl font-semibold mb-2">No tests yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first AI-generated mock test.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tests.map((test) => (
        <div
          key={test.id}
          className="rounded-lg border shadow-md p-6 
          bg-white text-gray-900 border-gray-200
          dark:bg-[#121a2c] dark:text-white dark:border-[#273347]"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`${getSubjectColor(
                    test.subject
                  )} rounded-md p-3 flex items-center justify-center`}
                >
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {test.title?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {test.subject?.replace("_", " ").toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  className={`${getDifficultyColor(test.difficulty)} font-medium`}
                >
                  {test.difficulty?.toUpperCase()}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {test.durationMinutes}MIN
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 font-medium flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {test.totalQuestions}Q
                </Badge>
                {test.status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {test.score}%
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created on {format(new Date(test.createdAt), "MMM d, yyyy")}
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {test.status === "completed" ? (
                <Button
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center`}
                  onClick={() => handleViewResults(test)}
                  disabled={loadingTestId === test.id}
                >
                  {loadingTestId === test.id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {loadingTestId === test.id ? "Loading..." : "View results"}
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center" onClick={() => onStartTest(test)}>
                  <Play className="w-4 h-4 mr-2" /> Start test
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
