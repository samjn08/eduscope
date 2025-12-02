import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Eye, Trophy, Clock, Target } from "lucide-react";
import { Difficulty, Subject, Test } from "@prisma/client";

export default function TestList({ tests, onStartTest, onViewResults }: {tests: Test[], onViewResults: (test: Test) => void, onStartTest: (test: Test) => void}) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-700/20 text-green-300';
      case 'medium': return 'bg-yellow-700/20 text-yellow-300';
      case 'hard': return 'bg-red-700/20 text-red-300';
      default: return 'bg-gray-700/20 text-gray-300';
    }
  };

  const getSubjectColor = (subject: Subject) => {
    const colors = {
      quantitative: 'bg-blue-700/20 text-blue-300',
      logical_reasoning: 'bg-purple-700/20 text-purple-300', 
      verbal: 'bg-pink-700/20 text-pink-300',
      programming: 'bg-green-700/20 text-green-300',
      general_knowledge: 'bg-orange-700/20 text-orange-300',
      technical: 'bg-red-700/20 text-red-300'
    } as Record<Subject, string>;
    return colors[subject] || 'bg-gray-700/20 text-gray-300';
  };

  if (tests.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-8 text-center text-white">
        <div className="text-5xl font-semibold text-gray-500 mb-4">¯\_(ツ)_/¯</div>
        <h3 className="text-xl font-semibold mb-2">No tests yet</h3>
        <p className="text-gray-400">Create your first AI-generated mock test.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tests.map((test) => (
        <div
          key={test.id}
          className="bg-[#1e2233] border border-gray-700 rounded-lg shadow-md p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className={`${getSubjectColor(test.subject)} rounded-md p-3`}>
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {test.title?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {test.subject?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getDifficultyColor(test.difficulty)} font-medium`}>
                  {test.difficulty?.toUpperCase()}
                </Badge>
                <Badge className="bg-gray-700/20 text-gray-300 font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {test.durationMinutes}MIN
                </Badge>
                <Badge className="bg-gray-700/20 text-gray-300 font-medium">
                  <Target className="w-3 h-3 mr-1" />
                  {test.totalQuestions}Q
                </Badge>
                {test.status === 'completed' && (
                  <Badge className="bg-green-700/20 text-green-300 font-medium">
                    <Trophy className="w-3 h-3 mr-1" />
                    {test.score}%
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-400">
                Created on {format(new Date(test.createdAt), "MMM d, yyyy")}
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {test.status === 'completed' ? (
                <Button
                  onClick={() => onViewResults(test)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View results
                </Button>
              ) : (
                <Button
                  onClick={() => onStartTest(test)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start test
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
