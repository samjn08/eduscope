import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Edit, 
  Calendar, 
  Mail, 
  ExternalLink,
  AlertCircle,
  User
} from "lucide-react";
import { Application, ApplicationStatus, Priority } from "@prisma/client";

export default function ApplicationList({ applications, onEdit, onUpdate }: { 
    applications: Application[],
    onEdit: (app: Application) => void,
    onUpdate: (app: Application) => void
}) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'under_review': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'interview_scheduled': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'offer_received': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'accepted': return 'bg-green-200 dark:bg-green-800/30 text-green-900 dark:text-green-200 border-green-500 dark:border-green-600';
      default: return 'bg-gray-100 dark:bg-gray-800/30 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-gray-100 dark:bg-gray-800/20 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 dark:bg-gray-800/20 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700">
          <Building className="h-8 w-8 text-blue-600 dark:text-blue-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No applications yet</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 max-w-sm mx-auto">
          Start tracking your job applications to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="gap-6 flex flex-1 flex-col overflow-y-auto">
      {applications.map((app) => (
        <div key={app.id} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center border border-gray-400 dark:border-gray-600">
                  <Building className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {app.companyName}
                  </h3>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{app.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Applied on {app.applicationDate ? format(new Date(app.applicationDate), "MMM d, yyyy") : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`${getStatusColor(app.status)} border rounded-lg px-3 py-1 text-xs font-medium`}>
                  {app.status?.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`${getPriorityColor(app.priority)} border rounded-lg px-3 py-1 text-xs font-medium`}>
                  {app.priority?.toUpperCase()} PRIORITY
                </span>
                <span className="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg px-3 py-1 text-xs font-medium">
                  {app.applicationType?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {app.recruiterName && (
                <div className="rounded-lg border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700/30 p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    Recruiter Contact
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{app.recruiterName}</p>
                  {app.recruiterEmail && (
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">{app.recruiterEmail}</p>
                  )}
                </div>
              )}

              {app.followUpDate && (
                <div className={`rounded-lg p-4 mb-4 border ${
                  new Date(app.followUpDate) <= new Date() 
                    ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300' 
                    : 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {new Date(app.followUpDate) <= new Date() ? (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-300" />
                    ) : (
                      <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                    )}
                    <span className="font-semibold text-sm">
                      Follow-up {new Date(app.followUpDate) <= new Date() ? 'Overdue' : 'Scheduled'}: {' '}
                      {format(new Date(app.followUpDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              )}

              {app.interviewDate && (
                <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-lg p-4 mb-4 text-purple-800 dark:text-purple-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                    <span className="font-semibold text-sm">
                      Interview: {format(new Date(app.interviewDate), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
              )}

              {app.notes && (
                <div className="bg-gray-200 dark:bg-gray-700/30 border border-gray-400 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-gray-200">
                  <h4 className="font-semibold mb-2 text-sm">Notes</h4>
                  <p className="text-sm">{app.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3 md:w-40">
              <Button
                onClick={() => onEdit(app)}
                className="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100 font-medium rounded-md shadow-sm hover:shadow transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {app.recruiterEmail && (
                <Button
                  onClick={() => window.open(`mailto:${app.recruiterEmail}`, '_blank')}
                  className="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100 font-medium rounded-md shadow-sm hover:shadow transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              )}
              {app.applicationUrl && (
                <Button
                  onClick={() => app.applicationUrl && window.open(app.applicationUrl, "_blank")}
                  disabled={!app.applicationUrl}
                  className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-md shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
