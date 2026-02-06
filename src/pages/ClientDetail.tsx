import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Clock, Briefcase, MessageSquare, Inbox, TrendingUp, TrendingDown, Calendar, User, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, HealthStatus } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { canEdit } from "@/config/permissions";

interface Client {
  id: string;
  name: string;
  accountType: string;
  revenueTier: string;
  health: HealthStatus;
  healthReason?: string;
  lastTouch: string;
  nextMilestone: string;
  updateFrequency: string;
  activeWorkItems: number;
  openEscalations: number;
  primaryContact?: string;
  email?: string;
  startDate?: string;
}

interface WorkItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  progress: number;
  dueDate: string;
}

interface IntakeRequest {
  id: string;
  summary: string;
  type: string;
  status: string;
  daysOld: number;
}

interface Communication {
  id: string;
  type: string;
  summary: string;
  date: string;
  author: string;
}

// Mock data - in real app this would come from API/context
const clientsData: Record<string, Client> = {
  "C-001": {
    id: "C-001",
    name: "Stephengould",
    accountType: "Retainer",
    revenueTier: "High",
    health: "red",
    healthReason: "Blocked work item, unresponsive for 5 days",
    lastTouch: "5 days ago",
    nextMilestone: "Checkout launch - Jan 30",
    updateFrequency: "Weekly",
    activeWorkItems: 3,
    openEscalations: 1,
    primaryContact: "John Smith",
    email: "john@stephengould.com",
    startDate: "Oct 2023",
  },
  "C-002": {
    id: "C-002",
    name: "Virtu-Meet",
    accountType: "Retainer",
    revenueTier: "High",
    health: "yellow",
    healthReason: "Performance issues taking longer than expected",
    lastTouch: "2 days ago",
    nextMilestone: "App Store submission - Feb 15",
    updateFrequency: "Weekly",
    activeWorkItems: 2,
    openEscalations: 0,
    primaryContact: "Sarah Lee",
    email: "sarah@virtumeet.com",
    startDate: "Aug 2023",
  },
  "C-003": {
    id: "C-003",
    name: "TEL",
    accountType: "Project",
    revenueTier: "Med",
    health: "green",
    lastTouch: "Today",
    nextMilestone: "Phase 2 review - Feb 5",
    updateFrequency: "Bi-weekly",
    activeWorkItems: 4,
    openEscalations: 0,
    primaryContact: "Mike Chen",
    email: "mike@tel.com",
    startDate: "Nov 2023",
  },
  "C-004": {
    id: "C-004",
    name: "SOLI",
    accountType: "Project",
    revenueTier: "Med",
    health: "green",
    lastTouch: "1 day ago",
    nextMilestone: "MVP launch - Feb 28",
    updateFrequency: "Weekly",
    activeWorkItems: 2,
    openEscalations: 0,
    primaryContact: "Emma Wilson",
    email: "emma@soli.io",
    startDate: "Dec 2023",
  },
  "C-005": {
    id: "C-005",
    name: "SpiritWorx",
    accountType: "Project",
    revenueTier: "Low",
    health: "green",
    lastTouch: "3 days ago",
    nextMilestone: "Beta release - Mar 10",
    updateFrequency: "Bi-weekly",
    activeWorkItems: 1,
    openEscalations: 0,
    primaryContact: "David Brown",
    email: "david@spiritworx.com",
    startDate: "Jan 2024",
  },
};

const workItemsData: Record<string, WorkItem[]> = {
  "C-001": [
    { id: "WI-101", title: "Checkout flow implementation", status: "Blocked", priority: "P0", progress: 45, dueDate: "Jan 30" },
    { id: "WI-102", title: "Payment gateway integration", status: "In Progress", priority: "P1", progress: 70, dueDate: "Feb 5" },
    { id: "WI-103", title: "Order confirmation emails", status: "In Progress", priority: "P2", progress: 30, dueDate: "Feb 10" },
  ],
  "C-002": [
    { id: "WI-104", title: "Video call performance", status: "In Progress", priority: "P1", progress: 60, dueDate: "Feb 10" },
    { id: "WI-105", title: "Mobile responsive fixes", status: "Ready for Review", priority: "P2", progress: 90, dueDate: "Feb 8" },
  ],
  "C-003": [
    { id: "WI-106", title: "Dashboard analytics", status: "In Progress", priority: "P1", progress: 55, dueDate: "Feb 5" },
    { id: "WI-107", title: "Export functionality", status: "In Progress", priority: "P2", progress: 40, dueDate: "Feb 12" },
    { id: "WI-108", title: "User permissions", status: "Triage", priority: "P2", progress: 0, dueDate: "Feb 20" },
    { id: "WI-109", title: "API documentation", status: "Done", priority: "P3", progress: 100, dueDate: "Jan 28" },
  ],
};

const requestsData: Record<string, IntakeRequest[]> = {
  "C-001": [
    { id: "IR-201", summary: "Add wishlist feature", type: "Feature", status: "New", daysOld: 2 },
  ],
  "C-002": [
    { id: "IR-202", summary: "Screen sharing not working on Safari", type: "Bug", status: "Accepted", daysOld: 5 },
  ],
  "C-003": [
    { id: "IR-203", summary: "Add CSV export option", type: "Enhancement", status: "Need Client Info", daysOld: 3 },
    { id: "IR-204", summary: "Dashboard loading slow", type: "Bug", status: "Accepted", daysOld: 1 },
  ],
};

const communicationsData: Record<string, Communication[]> = {
  "C-001": [
    { id: "COM-301", type: "Email", summary: "Follow-up on API credentials needed for checkout", date: "5 days ago", author: "DCOL" },
    { id: "COM-302", type: "Meeting", summary: "Weekly sync - discussed Phase 2 timeline", date: "1 week ago", author: "Founder" },
  ],
  "C-002": [
    { id: "COM-303", type: "Call", summary: "Discussed performance optimization approach", date: "2 days ago", author: "DCOL" },
    { id: "COM-304", type: "Email", summary: "Shared updated timeline for App Store submission", date: "4 days ago", author: "DCOL" },
  ],
  "C-003": [
    { id: "COM-305", type: "Meeting", summary: "Phase 2 kickoff meeting", date: "Today", author: "DCOL" },
  ],
};

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEditClients = user ? canEdit(user.role, "clients") : false;

  const client = clientId ? clientsData[clientId] : null;
  const workItems = clientId ? workItemsData[clientId] || [] : [];
  const requests = clientId ? requestsData[clientId] || [] : [];
  const communications = clientId ? communicationsData[clientId] || [] : [];

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Client not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/clients")}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Blocked": return "bg-destructive/10 text-destructive border-destructive/30";
      case "In Progress": return "bg-primary/10 text-primary border-primary/30";
      case "Ready for Review": return "bg-warning/10 text-warning border-warning/30";
      case "Done": return "bg-success/10 text-success border-success/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-destructive text-destructive-foreground";
      case "P1": return "bg-warning text-warning-foreground";
      case "P2": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-primary/10 text-primary border-primary/30";
      case "Accepted": return "bg-success/10 text-success border-success/30";
      case "Need Client Info": return "bg-warning/10 text-warning border-warning/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/clients")} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
              <StatusBadge status={client.health} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Last touch: {client.lastTouch}
            </p>
          </div>
        </div>
        {canEditClients && (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {/* Health Reason Alert */}
      {client.healthReason && (
        <div className={`p-3 rounded border ${
          client.health === "red" 
            ? "bg-destructive/10 border-destructive/30" 
            : "bg-warning/10 border-warning/30"
        }`}>
          <p className={`text-sm font-medium ${
            client.health === "red" ? "text-destructive" : "text-warning"
          }`}>
            {client.healthReason}
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="overview" className="text-xs px-3">Overview</TabsTrigger>
          <TabsTrigger value="work-items" className="text-xs px-3">
            Active Work Items ({workItems.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs px-3">
            Requests ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="communications" className="text-xs px-3">
            Communications ({communications.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="shadow-card p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">{client.activeWorkItems}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Active Work Items</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-card p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-accent/10">
                  <Inbox className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">{requests.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Open Requests</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-card p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-warning/10">
                  <MessageSquare className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">{client.openEscalations}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Open Escalations</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-card p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-success/10">
                  <Calendar className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight truncate">{client.nextMilestone.split(" - ")[0]}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Next Milestone</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Client Details */}
            <Card className="shadow-card">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-semibold">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">{client.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Tier</span>
                  <Badge variant="outline">{client.revenueTier}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Update Frequency</span>
                  <span className="font-medium">{client.updateFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{client.startDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card className="shadow-card">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-semibold">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{client.primaryContact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{client.email}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Log Communication
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Work Items Tab */}
        <TabsContent value="work-items" className="space-y-2">
          {workItems.length === 0 ? (
            <Card className="shadow-card p-6 text-center">
              <p className="text-muted-foreground">No active work items</p>
            </Card>
          ) : (
            workItems.map((item) => (
              <Card 
                key={item.id} 
                className="shadow-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate("/work-items")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                    <Badge className={`${getPriorityColor(item.priority)} text-xs`}>{item.priority}</Badge>
                    <span className="font-medium text-sm text-foreground truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className={`${getStatusColor(item.status)} text-xs`}>
                      {item.status}
                    </Badge>
                    <div className="w-20">
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">Due {item.dueDate}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-2">
          {requests.length === 0 ? (
            <Card className="shadow-card p-6 text-center">
              <p className="text-muted-foreground">No open requests</p>
            </Card>
          ) : (
            requests.map((req) => (
              <Card 
                key={req.id} 
                className="shadow-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate("/intake")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                    <Badge variant="outline" className="text-xs">{req.type}</Badge>
                    <span className="font-medium text-sm text-foreground truncate">{req.summary}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className={`${getRequestStatusColor(req.status)} text-xs`}>
                      {req.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{req.daysOld}d old</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-2">
          <div className="flex justify-end mb-2">
            <Button size="sm" className="h-7 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Log Communication
            </Button>
          </div>
          {communications.length === 0 ? (
            <Card className="shadow-card p-6 text-center">
              <p className="text-muted-foreground">No communications logged</p>
            </Card>
          ) : (
            communications.map((comm) => (
              <Card key={comm.id} className="shadow-card p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                      <span className="text-xs text-muted-foreground">{comm.author}</span>
                    </div>
                    <p className="text-sm text-foreground">{comm.summary}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{comm.date}</span>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
