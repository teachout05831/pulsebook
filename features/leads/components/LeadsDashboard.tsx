"use client";

import {
  Sparkles,
  CheckCircle2,
  Target,
  Clock,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLeads } from "../hooks/useLeads";
import { PipelineCard } from "./PipelineCard";

const pipelineStages = [
  { label: "New", status: "new", color: "bg-blue-500" },
  { label: "Contacted", status: "contacted", color: "bg-purple-500" },
  { label: "Qualified", status: "qualified", color: "bg-amber-500" },
  { label: "Proposal", status: "proposal", color: "bg-emerald-500" },
  { label: "Won", status: "won", color: "bg-green-500" },
];

const recentActivity: Array<{
  icon: typeof Sparkles;
  iconBg: string;
  title: string;
  time: string;
}> = [];

export function LeadsDashboard() {
  const { total: newLeadsCount } = useLeads({ leadStatus: "new" });
  const { total: contactedCount } = useLeads({ leadStatus: "contacted" });
  const { total: qualifiedCount } = useLeads({ leadStatus: "qualified" });
  const { total: proposalCount } = useLeads({ leadStatus: "proposal" });

  const totalLeads = newLeadsCount + contactedCount + qualifiedCount + proposalCount;

  const pipelineData = [
    { ...pipelineStages[0], count: newLeadsCount, percent: totalLeads ? (newLeadsCount / totalLeads) * 100 : 0 },
    { ...pipelineStages[1], count: contactedCount, percent: totalLeads ? (contactedCount / totalLeads) * 100 : 0 },
    { ...pipelineStages[2], count: qualifiedCount, percent: totalLeads ? (qualifiedCount / totalLeads) * 100 : 0 },
    { ...pipelineStages[3], count: proposalCount, percent: totalLeads ? (proposalCount / totalLeads) * 100 : 0 },
  ];

  const stats = [
    { icon: Sparkles, iconBg: "bg-blue-100", iconColor: "text-blue-600", value: newLeadsCount, label: "New Leads", badge: "12%" },
    { icon: CheckCircle2, iconBg: "bg-green-100", iconColor: "text-green-600", value: proposalCount, label: "Proposals Sent", badge: "8%" },
    { icon: Target, iconBg: "bg-amber-100", iconColor: "text-amber-600", value: `${totalLeads ? Math.round((proposalCount / totalLeads) * 100) : 0}%`, label: "Conversion Rate" },
    { icon: () => <span className="text-purple-600 font-bold">$</span>, iconBg: "bg-purple-100", iconColor: "", value: totalLeads, label: "Total Pipeline" },
    { icon: Clock, iconBg: "bg-red-100", iconColor: "text-red-600", value: 0, label: "Overdue Follow-ups" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.iconBg)}>
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
                {stat.badge && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <ArrowUp className="h-3 w-3 mr-1" /> {stat.badge}
                  </Badge>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <PipelineCard pipelineData={pipelineData} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="link" className="text-sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.title} className="flex items-start gap-3">
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", activity.iconBg)}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
