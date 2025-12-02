import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trophy } from "lucide-react";
import { Application, Test } from "@prisma/client";
import Link from "next/link";

interface RecentActivityProps {
  title: string;
  items: Test[] | Application[];
  type: "tests" | "applications";
  emptyMessage: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export default function RecentActivity({
  title,
  items,
  type,
  emptyMessage,
  icon: Icon,
  className
}: RecentActivityProps) {
  
  const accent =
    type === "tests"
      ? "text-blue-400 dark:text-blue-300"
      : "text-purple-400 dark:text-purple-300";

  const headerBg =
    type === "tests"
      ? "bg-blue-500/10 ring-blue-400/40"
      : "bg-purple-500/10 ring-purple-400/40";

  if (items.length === 0) {
    return (
      <Card className={className ?? "bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700/40 shadow-lg"}>
        <CardHeader className="border-b border-gray-300 dark:border-gray-700/40">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <span className={`w-7 h-7 rounded-md ring-1 flex items-center justify-center ${headerBg}`}>
              <Icon className={`w-4 h-4 ${accent}`} />
            </span>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center py-10">
          <Icon className={`w-12 h-12 mx-auto opacity-40 ${accent}`} />
          <p className="text-gray-600 dark:text-gray-400 mt-4">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white gap-0 py-0 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700/40 shadow-lg">
      <CardHeader className="border-b gap-0 !p-6 border-gray-300 dark:border-gray-700/40">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <span className={`w-7 h-7 rounded-md ring-1 flex items-center justify-center ${headerBg}`}>
            <Icon className={`w-4 h-4 ${accent}`} />
          </span>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {items.map((item, index) => {
          // Compute the link URL
          const linkUrl =
            type === "tests"
              ? `/mock-tests/${item.id}` // adjust to your mock test route
              : `/placement-tracker`; // adjust to your application route

          return (
            <Link
              key={item.id}
              href={linkUrl}
              className={`flex justify-between items-start p-4 transition-colors hover:bg-gray-100 dark:hover:bg-[#1a253b] ${
                index !== items.length - 1
                  ? "border-b border-gray-300 dark:border-gray-700/40"
                  : ""
              }`}
            >
              <div className="flex-1">
                {type === "tests" ? (
                  <>
                    <h4 className="font-medium capitalize text-gray-800 dark:text-white mb-1">
                      {(item as Test).title}
                    </h4>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                        {(item as Test).subject?.replace("_", " ")}
                      </Badge>

                      {item.status === "completed" && (
                        <Badge className="text-xs bg-green-600/80 text-white flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {item.score}%
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                      {(item as Application).companyName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {(item as Application).role}
                    </p>

                    <Badge className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {(item as Application).status?.replace("_", " ")}
                    </Badge>
                  </>
                )}
              </div>

              <div className="text-right flex items-center gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(item.createdAt), "MMM d")}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
