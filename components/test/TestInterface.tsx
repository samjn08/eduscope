'use client';
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Flag, ArrowLeft, ArrowRight } from "lucide-react";
import { Question, Test, TestStatus } from "@prisma/client";
import { getQuestionsByTestId } from "@/app/server/db";

export interface TestResults {
  status: TestStatus;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  time_taken_minutes: number;
  weak_areas: string[];
  [key: number]: number;
}

export default function TestInterface({ test, onComplete, onExit }: { test: Test, onComplete: (testId: string, results: TestResults) => void, onExit: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [showResults, setShowResults] = useState<TestResults | null>(null);
  const [questionset, setQuestionset] = useState<Question[]>([]);

  const handleSubmit = useCallback(async () => {
    const questions = questionset || [];
    let correct = 0;
    const weakAreas: string[] = [];

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      } else {
        weakAreas.push(test.subject);
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const results: TestResults = {
      status: "completed",
      score,
      correct_answers: correct,
      wrong_answers: questions.length - correct,
      time_taken_minutes: test.durationMinutes - Math.floor(timeLeft / 60),
      weak_areas: [...new Set(weakAreas)]
    };

    setShowResults(results);
  }, [answers, test, timeLeft, questionset]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const fetchQuestions = async () => {
    const questionsFromDB = await getQuestionsByTestId(test.id);
    setQuestionset(questionsFromDB);
  }

  useEffect(() => {
    fetchQuestions();
  }, [test.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="p-4 md:p-8 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-[#1e2233] border border-gray-700 rounded-lg shadow-lg p-8 text-center text-white space-y-6">
            <h1 className="text-3xl font-semibold">Test Completed</h1>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-800/20 border border-green-600 rounded-md p-4">
                <div className="text-3xl font-semibold text-green-400">{showResults.score}%</div>
                <div className="text-sm font-medium text-green-200">Score</div>
              </div>
              <div className="bg-blue-800/20 border border-blue-600 rounded-md p-4">
                <div className="text-3xl font-semibold text-blue-400">{showResults.correct_answers}</div>
                <div className="text-sm font-medium text-blue-200">Correct</div>
              </div>
              <div className="bg-red-800/20 border border-red-600 rounded-md p-4">
                <div className="text-3xl font-semibold text-red-400">{showResults.wrong_answers}</div>
                <div className="text-sm font-medium text-red-200">Wrong</div>
              </div>
            </div>
            <Button
              onClick={() => onComplete(test.id, showResults)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const questions = questionset || [];
  const currentQ = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#1e2233] border border-gray-700 rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={onExit} variant="outline" className="border-gray-600 text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{test.title?.toUpperCase()}</h1>
                <p className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Flag className="w-4 h-4 mr-2" />
                Finish
              </Button>
            </div>
          </div>
          <Progress 
            value={(currentQuestion + 1) / questions.length * 100} 
            className="mt-4 h-2 bg-gray-700"
          />
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-[#1e2233] border border-gray-700 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-semibold leading-tight">{currentQ.questionText}</h2>
            <div className="space-y-4">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-md border transition-colors ${
                    answers[currentQuestion] === index
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold ${
                      answers[currentQuestion] === index ? 'bg-white text-indigo-700' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-gray-600 text-white disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
