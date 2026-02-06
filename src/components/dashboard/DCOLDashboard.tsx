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
    <div className="space-y-4 animate-fade-in">
      {/* Header with Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Control Board</h1>
          <p className="text-sm text-muted-foreground">
            Operational overview — intake, active work, and escalations
          </p>
        </div>
        <Button 
          size="sm"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setIntakeFormOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Request
        </Button>
      </div>

      {/* Stats Row - More Compact */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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
          subtitle="In progress"
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
          subtitle="Awaiting review"
          icon={MessageSquareWarning}
          variant="accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Intake Queue */}
        <Card className="shadow-card">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Inbox className="h-4 w-4 text-muted-foreground" />
                Intake Queue
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => navigate("/intake")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 space-y-2">
            {intakeQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/intake")}
                className="p-2.5 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge className={`${getUrgencyColor(item.urgency)} text-xs px-1.5 py-0`}>{item.urgency}</Badge>
                  <span className="text-xs text-muted-foreground">{item.receivedAt}</span>
                </div>
                <p className="font-medium text-sm text-foreground line-clamp-1">{item.summary}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
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
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Active Work
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => navigate("/work-items")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 space-y-2">
            {activeWorkItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/work-items")}
                className="p-2.5 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="font-medium text-sm text-foreground line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.client} • Due {item.dueDate}</p>
                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Escalations */}
        <Card className="shadow-card">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                Escalations
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => navigate("/escalations")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 space-y-2">
            {escalations.map((esc) => (
              <div
                key={esc.id}
                onClick={() => navigate("/escalations")}
                className="p-2.5 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{esc.id}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1.5 py-0 ${
                      esc.status === "pending_approval" 
                        ? "bg-warning/10 text-warning border-warning/30" 
                        : "bg-muted"
                    }`}
                  >
                    {esc.status === "pending_approval" ? "Pending" : "Draft"}
                  </Badge>
                </div>
                <p className="font-medium text-sm text-foreground">{esc.client}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{esc.issue}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{esc.createdAt}</span>
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-1 h-7 text-xs"
              onClick={() => navigate("/escalations")}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
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
