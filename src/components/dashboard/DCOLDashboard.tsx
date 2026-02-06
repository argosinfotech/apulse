import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Briefcase, AlertTriangle, MessageSquareWarning, Clock, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./StatCard";
import { Progress } from "@/components/ui/progress";
import { IntakeFormModal, IntakeFormData } from "@/components/intake/IntakeFormModal";
import { toast } from "@/hooks/use-toast";

interface IntakeItem {
  id: string;
  client: string;
  summary: string;
  type: string;
  urgency: "critical" | "high" | "medium" | "low";
  receivedAt: string;
}

const intakeQueue: IntakeItem[] = [
  {
    id: "1",
    client: "Acme Corp",
    summary: "New API integration request",
    type: "Feature",
    urgency: "high",
    receivedAt: "2h ago",
  },
  {
    id: "2",
    client: "TechStart",
    summary: "Bug in payment processing",
    type: "Bug",
    urgency: "critical",
    receivedAt: "30m ago",
  },
  {
    id: "3",
    client: "GlobalTech",
    summary: "Dashboard customization",
    type: "Enhancement",
    urgency: "medium",
    receivedAt: "4h ago",
  },
];

interface WorkItem {
  id: string;
  title: string;
  client: string;
  status: "in_progress" | "blocked" | "review";
  priority: "P1" | "P2" | "P3";
  dueDate: string;
  progress: number;
}

const activeWorkItems: WorkItem[] = [
  {
    id: "WI-101",
    title: "User authentication flow",
    client: "Acme Corp",
    status: "in_progress",
    priority: "P1",
    dueDate: "Feb 8",
    progress: 65,
  },
  {
    id: "WI-98",
    title: "Report export feature",
    client: "TechStart",
    status: "blocked",
    priority: "P1",
    dueDate: "Feb 7",
    progress: 40,
  },
  {
    id: "WI-95",
    title: "Mobile responsive updates",
    client: "InnovateCo",
    status: "review",
    priority: "P2",
    dueDate: "Feb 10",
    progress: 90,
  },
];

interface Escalation {
  id: string;
  client: string;
  issue: string;
  status: "draft" | "pending_approval";
  createdAt: string;
}

const escalations: Escalation[] = [
  {
    id: "ESC-12",
    client: "GlobalTech",
    issue: "Scope creep - client requesting OOS features",
    status: "pending_approval",
    createdAt: "Yesterday",
  },
  {
    id: "ESC-11",
    client: "Acme Corp",
    issue: "Timeline concerns - Phase 2 delays",
    status: "draft",
    createdAt: "Today",
  },
];

export function DCOLDashboard() {
  const navigate = useNavigate();
  const [intakeFormOpen, setIntakeFormOpen] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "medium": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress": return <Badge className="bg-primary/10 text-primary border-primary/30">In Progress</Badge>;
      case "blocked": return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Blocked</Badge>;
      case "review": return <Badge className="bg-warning/10 text-warning border-warning/30">In Review</Badge>;
      default: return null;
    }
  };

  const handleIntakeSubmit = (data: IntakeFormData) => {
    toast({
      title: "Request Created",
      description: `New intake request for ${data.client} has been logged.`,
    });
    // Navigate to intake page to see the new request
    navigate("/intake");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Control Board</h1>
          <p className="text-muted-foreground mt-1">
            Operational overview — intake, active work, and escalations
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setIntakeFormOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Intake Queue"
          value="3"
          subtitle="Pending triage"
          icon={Inbox}
          trend={{ value: 2, label: "new today", positive: false }}
          variant="warning"
        />
        <StatCard
          title="Active Work Items"
          value="12"
          subtitle="In progress this week"
          icon={Briefcase}
          variant="default"
        />
        <StatCard
          title="Blocked Items"
          value="2"
          subtitle="Needs attention"
          icon={AlertTriangle}
          trend={{ value: 1, label: "from yesterday", positive: false }}
          variant="destructive"
        />
        <StatCard
          title="Pending Escalations"
          value="2"
          subtitle="Awaiting Founder review"
          icon={MessageSquareWarning}
          variant="accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Intake Queue */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Inbox className="h-5 w-5 text-muted-foreground" />
                Intake Queue
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {intakeQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getUrgencyColor(item.urgency)}>{item.urgency}</Badge>
                  <span className="text-xs text-muted-foreground">{item.receivedAt}</span>
                </div>
                <p className="font-medium text-sm text-foreground">{item.summary}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.client}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{item.type}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Work Items */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                Active Work
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeWorkItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="font-medium text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.client} • Due {item.dueDate}</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Escalations */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquareWarning className="h-5 w-5 text-muted-foreground" />
                Escalations
              </CardTitle>
              <Button variant="outline" size="sm">New</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {escalations.map((esc) => (
              <div
                key={esc.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{esc.id}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      esc.status === "pending_approval" 
                        ? "bg-warning/10 text-warning border-warning/30" 
                        : "bg-muted"
                    }
                  >
                    {esc.status === "pending_approval" ? "Pending Approval" : "Draft"}
                  </Badge>
                </div>
                <p className="font-medium text-sm text-foreground">{esc.client}</p>
                <p className="text-xs text-muted-foreground mt-1">{esc.issue}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{esc.createdAt}</span>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Intake Form Modal */}
      <IntakeFormModal
        open={intakeFormOpen}
        onOpenChange={setIntakeFormOpen}
        onSubmit={handleIntakeSubmit}
      />
    </div>
  );
}
