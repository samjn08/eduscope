import { format } from 'date-fns';
import { AlertTriangle, ExternalLink, FileUser, Pencil, Share, Star, Trophy } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Resume } from '@prisma/client';
import { toast } from 'sonner';

function ResumeList({ resumes }: { resumes: Resume[] }) {
  const getScoreStyle = (score: number) => {
    if (score >= 80)
      return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 border-emerald-500';
    if (score >= 60)
      return 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border-amber-500';
    return 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-300 border-rose-500';
  };

  const copyShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied!');
  };

  if (resumes.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center shadow-md w-full">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
          <FileUser className="h-8 w-8 text-gray-900 dark:text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
          Upload your first resume to start tracking ATS scores and get improvement feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg w-full transition-colors"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6 w-full">
            <div className="flex-1 w-full">
              {/* Resume Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-700">
                  <FileUser className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{resume.targetRole}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created {format(new Date(resume.createdDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              {/* ATS Score */}
              {resume.atsScore != null && (
                <div className={`${getScoreStyle(resume.atsScore)} border rounded-lg p-4 mb-4 transition-colors`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-current" />
                      <span className="font-semibold text-sm tracking-wide">ATS Score</span>
                    </div>
                    <span className="text-xl font-bold">
                      {resume.atsScore}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200"> /100</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Strengths / Weaknesses / Suggestions */}
              <div className="space-y-3">
                {resume.strengths?.length > 0 && (
                  <div className="rounded-lg border border-emerald-500 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4 transition-colors">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Star className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1 list-disc list-inside">
                      {resume.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resume.weaknesses?.length > 0 && (
                  <div className="rounded-lg border border-rose-500 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20 p-4 transition-colors">
                    <h4 className="font-semibold text-rose-700 dark:text-rose-300 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4" /> Improvements
                    </h4>
                    <ul className="text-sm text-rose-700 dark:text-rose-300 space-y-1 list-disc list-inside">
                      {resume.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resume.suggestions?.length > 0 && (
                  <div className="rounded-lg border border-amber-500 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 transition-colors">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Pencil className="w-4 h-4" /> Suggestions
                    </h4>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                      {resume.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3 md:w-40">
              <Button
  onClick={() => window.open(`${window.location.origin}/resume/${resume.id}`, '_blank')}
  className="
    bg-gray-200 dark:bg-gray-800
    border border-gray-300 dark:border-gray-700
    text-gray-900 dark:text-white
    font-medium rounded-md shadow-sm
    hover:bg-gray-300 dark:hover:bg-gray-700
    hover:border-gray-400 dark:hover:border-gray-600
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 dark:focus:ring-indigo-400
    transition-colors transition-shadow
    flex items-center
  "
>
  <ExternalLink className="w-4 h-4 mr-2" /> View
</Button>

              <Button
                onClick={() => copyShareLink(`${window.location.origin}/resume/${resume.id}`)}
                className="bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-800 text-gray-900 dark:text-white font-medium rounded-md shadow-sm hover:shadow transition-colors"
              >
                <Share className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResumeList;
