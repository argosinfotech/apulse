import { useState } from "react";
import { Plus, Search, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type IntakeStatus = "New" | "Need Client Info" | "Accepted" | "Rejected" | "Converted";

interface IntakeRequest {
  id: string;
  client: string;
  summary: string;
  type: "Bug" | "Feature" | "SEO" | "Content" | "Admin" | "Question";
  source: "Email" | "Call" | "Meeting" | "WhatsApp";
  urgency: "Low" | "Medium" | "High";
  status: IntakeStatus;
  intakeDate: string;
  daysOld: number;
  clarifyingQuestions?: string;
}

const intakeRequests: IntakeRequest[] = [
  {
    id: "IR-001",
    client: "Stephengould",
    summary: "Need to add Apple Pay support to checkout",
    type: "Feature",
    source: "Email",
    urgency: "High",
    status: "New",
    intakeDate: "2024-01-15",
    daysOld: 0,
  },
  {
    id: "IR-002",
    client: "TEL",
    summary: "Dashboard charts not loading on Safari",
    type: "Bug",
    source: "WhatsApp",
    urgency: "Medium",
    status: "New",
    intakeDate: "2024-01-14",
    daysOld: 1,
  },
  {
    id: "IR-003",
    client: "Virtu-Meet",
    summary: "Request for user analytics export feature",
    type: "Feature",
    source: "Meeting",
    urgency: "Low",
    status: "Need Client Info",
    intakeDate: "2024-01-12",
    daysOld: 3,
    clarifyingQuestions: "What date range and format do they need?",
  },
  {
    id: "IR-004",
    client: "SOLI",
    summary: "SEO optimization for landing pages",
    type: "SEO",
    source: "Email",
    urgency: "Medium",
    status: "Accepted",
    intakeDate: "2024-01-10",
    daysOld: 5,
  },
];

const statusColumns: IntakeStatus[] = ["New", "Need Client Info", "Accepted", "Rejected", "Converted"];

const typeColors: Record<IntakeRequest["type"], string> = {
  Bug: "bg-destructive/10 text-destructive",
  Feature: "bg-primary/10 text-primary",
  SEO: "bg-success/10 text-success",
  Content: "bg-accent/10 text-accent",
  Admin: "bg-muted text-muted-foreground",
  Question: "bg-warning/10 text-warning",
};

export default function IntakeRequests() {
  const [searchQuery, setSearchQuery] = useState("");

  const getRequestsByStatus = (status: IntakeStatus) => {
    return intakeRequests.filter((r) => r.status === status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intake Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming client requests and route to work items
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {statusColumns.map((status) => (
          <div key={status} className="min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{status}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {getRequestsByStatus(status).length}
              </span>
            </div>
            <div className="space-y-3">
              {getRequestsByStatus(status).map((request) => (
                <Card
                  key={request.id}
                  className={`shadow-card hover:shadow-soft transition-all cursor-pointer ${
                    request.daysOld > 2 ? "border-l-2 border-l-warning" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{request.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[request.type]}`}>
                        {request.type}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                      {request.summary}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">{request.client}</p>
                    
                    {request.clarifyingQuestions && (
                      <div className="flex items-start gap-1.5 p-2 rounded bg-warning/10 mb-3">
                        <MessageSquare className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                        <p className="text-xs text-warning">{request.clarifyingQuestions}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-muted">{request.source}</span>
                      <span className={`flex items-center gap-1 ${request.daysOld > 2 ? "text-warning" : ""}`}>
                        <Clock className="h-3 w-3" />
                        {request.daysOld}d old
                      </span>
                    </div>

                    {request.status === "Accepted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Convert to Work Item
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {getRequestsByStatus(status).length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                  No requests
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
