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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Strategic Overview</h1>
        <p className="text-muted-foreground mt-1">
          Pending decisions and client health at a glance
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Decisions"
          value="3"
          subtitle="Awaiting your approval"
          icon={Clock}
          trend={{ value: 2, label: "new today", positive: false }}
          variant="warning"
        />
        <StatCard
          title="At-Risk Clients"
          value="2"
          subtitle="Yellow or Red status"
          icon={AlertTriangle}
          trend={{ value: 1, label: "from last week", positive: false }}
          variant="destructive"
        />
        <StatCard
          title="Invoices Pending"
          value="$18,500"
          subtitle="Ready for approval"
          icon={FileCheck}
          variant="accent"
        />
        <StatCard
          title="Active Clients"
          value="8"
          subtitle="Total active engagements"
          icon={Users}
          trend={{ value: 12, label: "growth", positive: true }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Decisions */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Pending Decisions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingDecisions.map((decision) => (
              <div
                key={decision.id}
                className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getPriorityColor(decision.priority)}>
                        {decision.priority}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {decision.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {decision.daysWaiting}d waiting
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground">{decision.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{decision.description}</p>
                    {decision.dcolRecommendation && (
                      <div className="mt-2 p-2 rounded bg-accent/50 text-sm">
                        <span className="font-medium text-accent-foreground">DCOL recommends:</span>{" "}
                        <span className="text-muted-foreground">{decision.dcolRecommendation}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="default" className="bg-success hover:bg-success/90">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    Review Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Health Overview */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              Client Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientHealth.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`} />
                    <div>
                      <p className="font-medium text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Last contact: {client.lastContact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp 
                      className={`h-4 w-4 ${
                        client.trend === "up" 
                          ? "text-success" 
                          : client.trend === "down" 
                            ? "text-destructive rotate-180" 
                            : "text-muted-foreground rotate-90"
                      }`} 
                    />
                    <Button variant="ghost" size="sm">View</Button>
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
