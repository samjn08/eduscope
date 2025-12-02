import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Edit, 
  Mail, 
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building
} from "lucide-react";
import { Application, ApplicationStatus, ApplicationType, Priority } from "@prisma/client";

export default function ApplicationTable({ applications, onEdit, onUpdate }: 
    {
    applications: Application[],
    onEdit: (app: Application) => void,
    onUpdate: (app: Application) => void
    }
) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return '!bg-blue-900 !text-blue-300 !border-blue-700';
      case 'under_review': return '!bg-amber-900 !text-amber-300 !border-amber-700';
      case 'interview_scheduled': return '!bg-purple-900 !text-purple-300 !border-purple-700';
      case 'rejected': return '!bg-rose-900 !text-rose-300 !border-rose-700';
      case 'offer_received': return '!bg-emerald-900 !text-emerald-300 !border-emerald-700';
      case 'accepted': return '!bg-emerald-800 !text-emerald-100 !border-emerald-700';
      default: return '!bg-gray-800 !text-gray-100 !border-gray-700';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return '!bg-rose-900 !text-rose-300 !border-rose-700';
      case 'medium': return '!bg-amber-900 !text-amber-300 !border-amber-700';
      case 'low': return '!bg-gray-800 !text-gray-300 !border-gray-700';
      default: return '!bg-gray-800 !text-gray-300 !border-gray-700';
    }
  };

  const formatApplicationType = (type: ApplicationType) => {
    return type?.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (applications.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900">
          <Building className="h-8 w-8 text-blue-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">No applications yet</h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Start tracking your job applications to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="!bg-gray-800 border-b border-gray-700">
              <TableHead className="font-semibold text-gray-100">Company</TableHead>
              <TableHead className="font-semibold text-gray-100">Role</TableHead>
              <TableHead className="font-semibold text-gray-100">Status</TableHead>
              <TableHead className="font-semibold text-gray-100">Type</TableHead>
              <TableHead className="font-semibold text-gray-100">Priority</TableHead>
              <TableHead className="font-semibold text-gray-100">Applied Date</TableHead>
              <TableHead className="font-semibold text-gray-100">Follow-up</TableHead>
              <TableHead className="font-semibold text-gray-100">Recruiter</TableHead>
              <TableHead className="font-semibold text-gray-100 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="hover:!bg-gray-800 transition-colors border-b border-gray-700">
                <TableCell className="font-medium text-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 !bg-gray-800 rounded-lg flex items-center justify-center border !border-gray-700">
                      <Building className="w-4 h-4 text-blue-300" />
                    </div>
                    {app.companyName}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-100">{app.role}</div>
                    <div className="text-xs text-gray-400">{formatApplicationType(app.applicationType)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`border rounded-lg px-2 py-1 text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status?.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="!bg-gray-800 !text-gray-100 !border-gray-700 border rounded-lg px-2 py-1 text-xs font-medium">
                    {formatApplicationType(app.applicationType)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`border rounded-lg px-2 py-1 text-xs font-medium ${getPriorityColor(app.priority)}`}>
                    {app.priority}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {app.applicationDate ? format(new Date(app.applicationDate), "MMM d, yyyy") : 'N/A'}
                </TableCell>
                <TableCell>
                  {app.followUpDate ? (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{format(new Date(app.followUpDate), "MMM d")}</span>
                      {new Date(app.followUpDate) <= new Date() && (
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {app.recruiterName ? (
                    <div className="text-xs text-gray-100">
                      <div className="font-medium">{app.recruiterName}</div>
                      {app.recruiterEmail && (
                        <div className="text-xs text-gray-400">{app.recruiterEmail}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      onClick={() => onEdit(app)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:!text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {app.recruiterEmail && (
                      <Button
                        onClick={() => window.open(`mailto:${app.recruiterEmail}`, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:!text-white"
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                    )}
                    {app.applicationUrl && (
                      <Button
                        onClick={() => {app.applicationUrl && window.open(app.applicationUrl, '_blank')}}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:!bg-purple-700 hover:!text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
