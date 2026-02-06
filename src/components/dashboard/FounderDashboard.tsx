import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, CheckCircle, Users, TrendingUp, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./StatCard";

interface PendingDecision {
  id: string;
  type: "escalation" | "invoice" | "client";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dcolRecommendation?: string;
  daysWaiting: number;
}

const pendingDecisions: PendingDecision[] = [
  {
    id: "1",
    type: "escalation",
    title: "Acme Corp - Delayed Deliverable",
    description: "Client unhappy with timeline on Phase 2",
    priority: "high",
    dcolRecommendation: "Offer 10% discount and expedited delivery",
    daysWaiting: 2,
  },
  {
    id: "2",
    type: "invoice",
    title: "TechStart Inc - January Invoice",
    description: "$12,500 for 50 hours of development work",
    priority: "medium",
    daysWaiting: 1,
  },
  {
    id: "3",
    type: "escalation",
    title: "GlobalTech - Scope Creep",
    description: "Client requesting features outside SOW",
    priority: "high",
    dcolRecommendation: "Propose change order with additional budget",
    daysWaiting: 3,
  },
];

interface ClientHealth {
  name: string;
  status: "green" | "yellow" | "red";
  trend: "up" | "down" | "stable";
  lastContact: string;
}

const clientHealth: ClientHealth[] = [
  { name: "Acme Corp", status: "yellow", trend: "down", lastContact: "2 days ago" },
  { name: "TechStart Inc", status: "green", trend: "stable", lastContact: "Today" },
  { name: "GlobalTech", status: "red", trend: "down", lastContact: "5 days ago" },
  { name: "InnovateCo", status: "green", trend: "up", lastContact: "Yesterday" },
];

export function FounderDashboard() {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium": return "bg-warning/10 text-warning border-warning/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green": return "bg-success";
      case "yellow": return "bg-warning";
      case "red": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Strategic Overview</h1>
      </div>

      {/* Stats Row */}
      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Decisions"
          value="3"
          icon={Clock}
          trend={{ value: 2, label: "new today", positive: false }}
          variant="warning"
        />
        <StatCard
          title="At-Risk Clients"
          value="2"
          icon={AlertTriangle}
          trend={{ value: 1, label: "from last week", positive: false }}
          variant="destructive"
        />
        <StatCard
          title="Invoices Pending"
          value="$18.5K"
          icon={FileCheck}
          variant="accent"
        />
        <StatCard
          title="Active Clients"
          value="8"
          icon={Users}
          trend={{ value: 12, label: "growth", positive: true }}
          variant="success"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Pending Decisions */}
        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Pending Decisions
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={() => navigate("/escalations")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0 space-y-1.5">
            {pendingDecisions.map((decision) => (
              <div
                key={decision.id}
                onClick={() => navigate("/escalations")}
                className="p-2 rounded border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] px-1 py-0.5 rounded ${getPriorityColor(decision.priority)}`}>
                    {decision.priority}
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                    {decision.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {decision.daysWaiting}d
                  </span>
                </div>
                <h4 className="font-medium text-xs text-foreground line-clamp-1">{decision.title}</h4>
                {decision.dcolRecommendation && (
                  <div className="mt-1 p-1 rounded bg-accent/50 text-[10px]">
                    <span className="font-medium text-accent-foreground">DCOL:</span>{" "}
                    <span className="text-muted-foreground line-clamp-1">{decision.dcolRecommendation}</span>
                  </div>
                )}
                <div className="flex gap-1.5 mt-1.5">
                  <Button size="sm" variant="default" className="bg-success hover:bg-success/90 h-5 text-[10px] px-1.5">
                    <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-5 text-[10px] px-1.5">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Health Overview */}
        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Client Health
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={() => navigate("/clients")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-2 pt-0">
            <div className="space-y-1.5">
              {clientHealth.map((client) => (
                <div
                  key={client.name}
                  onClick={() => navigate("/clients")}
                  className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`} />
                    <div>
                      <p className="font-medium text-xs text-foreground">{client.name}</p>
                      <p className="text-[10px] text-muted-foreground">Last: {client.lastContact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp 
                      className={`h-3 w-3 ${
                        client.trend === "up" 
                          ? "text-success" 
                          : client.trend === "down" 
                            ? "text-destructive rotate-180" 
                            : "text-muted-foreground rotate-90"
                      }`} 
                    />
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1.5">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
