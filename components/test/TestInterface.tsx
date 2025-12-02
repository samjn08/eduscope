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

export default function TestInterface({
  test,
  onComplete,
  onExit
}: {
  test: Test;
  onComplete: (testId: string, results: TestResults) => void;
  onExit: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [showResults, setShowResults] = useState<TestResults | null>(null);
  const [questionset, setQuestionset] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    const questionsFromDB = await getQuestionsByTestId(test.id);
    setQuestionset(questionsFromDB);
  };

  useEffect(() => {
    fetchQuestions();
  }, [test.id]);

  const handleSubmit = useCallback(async () => {
    const questions = questionset || [];
    let correct = 0;
    const weakAreas: string[] = [];

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) correct++;
      else weakAreas.push(test.subject);
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
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  if (showResults) {
    return (
      <div className="p-6 md:p-10 min-h-screen flex items-center justify-center 
      bg-gray-100 text-gray-900 
      dark:bg-[#070d1c] dark:text-white"
      >
        <div className="max-w-3xl w-full">
          <div className="rounded-xl p-8 shadow-lg border 
          bg-white dark:bg-[#121a2c] 
          border-gray-200 dark:border-[#273347] 
          space-y-6 text-center"
          >
            <h1 className="text-3xl font-bold">Test Completed 🎉</h1>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-lg p-4 border text-green-700 bg-green-100 
              dark:bg-green-900/20 dark:text-green-400 dark:border-green-600">
                <div className="text-3xl font-semibold">{showResults.score}%</div>
                <p className="text-sm font-medium">Score</p>
              </div>

              <div className="rounded-lg p-4 border text-blue-700 bg-blue-100 
              dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600">
                <div className="text-3xl font-semibold">{showResults.correct_answers}</div>
                <p className="text-sm font-medium">Correct</p>
              </div>

              <div className="rounded-lg p-4 border text-red-700 bg-red-100 
              dark:bg-red-900/20 dark:text-red-400 dark:border-red-600">
                <div className="text-3xl font-semibold">{showResults.wrong_answers}</div>
                <p className="text-sm font-medium">Wrong</p>
              </div>
            </div>

            <Button
              onClick={() => onComplete(test.id, showResults)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto"
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
    <div className="p-6 md:p-10 min-h-screen 
    bg-gray-100 text-gray-900 
    dark:bg-[#070d1c] dark:text-white"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="rounded-lg p-5 shadow border 
        bg-white dark:bg-[#121a2c] 
        border-gray-200 dark:border-[#273347]"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onExit}
              className="border-gray-400 dark:border-[#3a4a63]">
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div>
                <h1 className="text-lg font-bold">{test.title?.toUpperCase()}</h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>

              <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Flag className="w-4 h-4 mr-2" /> Finish
              </Button>
            </div>
          </div>

          <Progress value={(currentQuestion + 1) / questions.length * 100} className="mt-4" />
        </div>

        {/* Question Section */}
        {currentQ && (
          <div className="rounded-lg p-6 space-y-6 border shadow 
          bg-white dark:bg-[#121a2c] 
          border-gray-200 dark:border-[#273347]"
          >
            <h2 className="text-xl font-semibold">{currentQ.questionText}</h2>

            <div className="space-y-4">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-lg border transition 
                  ${
                    answers[currentQuestion] === index
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-[#1a2338] border-gray-300 dark:border-[#2f3c52] hover:bg-gray-200 dark:hover:bg-[#263250]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center font-bold rounded-md
                    ${
                      answers[currentQuestion] === index
                        ? "bg-white text-indigo-700"
                        : "bg-gray-300 dark:bg-[#2d3c55] text-gray-700 dark:text-gray-300"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            className="border-gray-400 dark:border-[#3a4a63]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          <Button
            disabled={currentQuestion === questions.length - 1}
            onClick={() =>
              setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
