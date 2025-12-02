'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Brain, Zap, AlertCircle } from "lucide-react";
import { Difficulty, Subject } from "@prisma/client";

export interface TestConfig {
  subject: Subject;
  difficulty: Difficulty;
  total_questions: number;
  duration_minutes: number;
}

export default function TestCreator({ 
  onGenerate, 
  onClose, 
  userType 
}: { 
  onGenerate: (config: TestConfig) => Promise<void>, 
  onClose: () => void, 
  userType: 'free' | 'pro' 
}) {
  const [config, setConfig] = useState<TestConfig>({
    subject: "quantitative",
    difficulty: "medium",
    total_questions: 20,
    duration_minutes: 60
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerate(config);
    setIsGenerating(false);
    onClose();
  };

  const subjects: { value: Subject; label: string }[] = [
    { value: "quantitative", label: "Quantitative Aptitude" },
    { value: "logical_reasoning", label: "Logical Reasoning" },
    { value: "verbal", label: "Verbal Ability" },
    { value: "programming", label: "Programming" },
    { value: "general_knowledge", label: "General Knowledge" },
    { value: "technical", label: "Technical" }
  ];

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: "easy", label: "Easy", color: "bg-green-600 text-white" },
    { value: "medium", label: "Medium", color: "bg-yellow-500 text-white" },
    { value: "hard", label: "Hard", color: "bg-red-600 text-white" }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl bg-[#0f1320] border border-gray-800">
        <CardHeader className="pb-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-5 h-5 text-purple-400" />
              Create Mock Test
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Subject */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Subject</Label>
            <Select
              value={config.subject}
              onValueChange={(value) => setConfig({ ...config, subject: value as Subject })}
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((diff) => (
                <Button
                  key={diff.value}
                  onClick={() => setConfig({ ...config, difficulty: diff.value })}
                  variant={config.difficulty === diff.value ? "default" : "outline"}
                  className={`${config.difficulty === diff.value ? diff.color : 'text-gray-300 hover:bg-gray-700'} transition-all duration-200`}
                >
                  {diff.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Questions & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Questions</Label>
              <Input
                type="number"
                value={config.total_questions}
                onChange={(e) => setConfig({ ...config, total_questions: parseInt(e.target.value) })}
                className="text-center bg-gray-800 text-white border-gray-700"
                min={5}
                max={userType === 'pro' ? 100 : 20}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Duration (min)</Label>
              <Input
                type="number"
                value={config.duration_minutes}
                onChange={(e) => setConfig({ ...config, duration_minutes: parseInt(e.target.value) })}
                className="text-center bg-gray-800 text-white border-gray-700"
                min={15}
                max={180}
              />
            </div>
          </div>

          {/* Pro Feature Warning */}
          {userType !== 'pro' && config.total_questions > 20 && (
            <div className="bg-amber-800/20 border border-amber-600 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-200">
                <strong>Pro Feature:</strong> More than 20 questions requires a Pro subscription.
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Generating Test...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate AI Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
