import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trophy } from "lucide-react";
import { Application, Test } from "@prisma/client";

interface RecentActivityProps {
  title: string;
  items: Test[] | Application[];
  type: 'tests' | 'applications';
  emptyMessage: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export default function RecentActivity({ title, items, type, emptyMessage, icon: Icon, className }: RecentActivityProps) {
  const headerIconColor = type === 'tests' ? 'text-[#4d8aff]' : 'text-[#a855f7]';
  const headerTileBg = type === 'tests' ? 'bg-[#0c1426] ring-[#4d8aff]' : 'bg-[#0c1426] ring-[#a855f7]';

  if (items.length === 0) {
    return (
      <Card className={className ?? "bg-[#0e182e] border border-[#1c293f] shadow-xl"}>
        <CardHeader className="border-b border-[#1c293f]">
          <CardTitle className="flex items-center gap-2 text-white">
            <span className={`w-7 h-7 rounded-md ring-1 flex items-center justify-center ${headerTileBg}`}>
              <Icon className={`w-4 h-4 ${headerIconColor}`} />
            </span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <Icon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-400">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0e182e] border border-[#1c293f] shadow-xl">
      <CardHeader className="border-b border-[#1c293f]">
        <CardTitle className="flex items-center gap-2 text-white">
          <span className={`w-7 h-7 rounded-md ring-1 flex items-center justify-center ${headerTileBg}`}>
            <Icon className={`w-4 h-4 ${headerIconColor}`} />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 hover:bg-[#132040] transition-colors duration-200 ${
                index !== items.length - 1 ? 'border-b border-[#1c293f]' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {type === 'tests' ? (
                    <>
                      <h4 className="font-medium text-white mb-1">
                        {(item as Test).title}
                      </h4>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {(item as Test).subject?.replace('_', ' ')}
                        </Badge>
                        {item.status === 'completed' && (
                          <Badge className="text-xs bg-green-700 text-white flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {item.score}%
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-white mb-1">
                        {(item as Application).companyName}
                      </h4>
                      <p className="text-sm text-gray-400 mb-2">{(item as Application).role}</p>
                      <Badge
                        variant={
                          (item as Application).status === 'applied' ? 'secondary' :
                          (item as Application).status === 'interview_scheduled' ? 'default' :
                          (item as Application).status === 'offer_received' ? 'default' :
                          'secondary'
                        }
                        className="text-xs bg-[#4d4d4d] text-gray-200"
                      >
                        {(item as Application).status?.replace('_', ' ')}
                      </Badge>
                    </>
                  )}
                </div>
                <div className="text-right flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    {format(new Date(item.createdAt), "MMM d")}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
