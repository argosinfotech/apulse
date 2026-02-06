import { ArrowRight, CheckCircle, Clock, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DecisionStatus = "Pending" | "Decided";
type EscalationType = "Architecture" | "Pricing" | "Scope" | "Client Risk" | "Legal";

interface Escalation {
  id: string;
  client: string;
  workItem: string;
  type: EscalationType;
  context: string;
  options: { label: string; description: string }[];
  recommendation: string;
  createdBy: string;
  createdAt: string;
  status: DecisionStatus;
  decision?: string;
  decisionDate?: string;
  daysOpen: number;
}

const escalations: Escalation[] = [
  {
    id: "ESC-001",
    client: "Stephengould",
    workItem: "E-commerce checkout optimization",
    type: "Scope",
    context: "Client requesting additional payment gateway integration (Apple Pay) not in original scope. This will require additional development time and potential third-party integration costs.",
    options: [
      { label: "Option A", description: "Accept with change order (+$8K, +2 weeks)" },
      { label: "Option B", description: "Defer to Phase 2" },
      { label: "Option C", description: "Include in current scope, absorb cost" },
    ],
    recommendation: "Accept with change order (+$8K, +2 weeks) - maintains project timeline and fair compensation",
    createdBy: "DCOL",
    createdAt: "2024-01-15",
    status: "Pending",
    daysOpen: 3,
  },
  {
    id: "ESC-002",
    client: "Virtu-Meet",
    workItem: "Mobile app performance improvements",
    type: "Architecture",
    context: "Performance issues require significant refactoring. Need to decide between native rebuild vs. optimization of existing React Native codebase.",
    options: [
      { label: "Option A", description: "Full native rebuild (Swift/Kotlin) - 12 weeks, higher cost" },
      { label: "Option B", description: "Targeted RN optimization - 4 weeks, moderate cost" },
      { label: "Option C", description: "Hybrid approach - native for critical paths only" },
    ],
    recommendation: "Proceed with targeted optimization (Option B) - lower risk, faster delivery, can reassess if insufficient",
    createdBy: "DCOL",
    createdAt: "2024-01-14",
    status: "Pending",
    daysOpen: 4,
  },
  {
    id: "ESC-003",
    client: "TEL",
    workItem: "Dashboard redesign phase 1",
    type: "Pricing",
    context: "Client requested 20% discount on Phase 2 citing budget constraints.",
    options: [
      { label: "Option A", description: "Accept 20% discount" },
      { label: "Option B", description: "Counter with 10% discount" },
      { label: "Option C", description: "Offer reduced scope at current price" },
    ],
    recommendation: "Counter with 10% discount - preserves relationship while maintaining fair margins",
    createdBy: "DCOL",
    createdAt: "2024-01-10",
    status: "Decided",
    decision: "Accepted Option B - 10% discount agreed upon. Phase 2 contract signed.",
    decisionDate: "2024-01-12",
    daysOpen: 0,
  },
];

const typeColors: Record<EscalationType, string> = {
  Architecture: "bg-primary/10 text-primary",
  Pricing: "bg-success/10 text-success",
  Scope: "bg-warning/10 text-warning",
  "Client Risk": "bg-destructive/10 text-destructive",
  Legal: "bg-muted text-muted-foreground",
};

export default function Escalations() {
  const pending = escalations.filter((e) => e.status === "Pending");
  const decided = escalations.filter((e) => e.status === "Decided");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escalations & Decisions</h1>
          <p className="text-muted-foreground mt-1">
            Founder decision inbox for strategic escalations
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          File Escalation
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pending.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="decided">Decided</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pending.map((escalation) => (
            <Card key={escalation.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">{escalation.id}</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${typeColors[escalation.type]}`}>
                      {escalation.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-warning">
                    <Clock className="h-4 w-4" />
                    {escalation.daysOpen} days open
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{escalation.client}</p>
                  <h3 className="text-lg font-semibold text-foreground">{escalation.workItem}</h3>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 mb-4">
                  <h4 className="font-medium text-foreground mb-2">Context</h4>
                  <p className="text-sm text-muted-foreground">{escalation.context}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-3">Options</h4>
                  <div className="space-y-2">
                    {escalation.options.map((option, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent/30 transition-colors cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-4">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">DCOL Recommendation</p>
                      <p className="text-sm font-medium text-accent">{escalation.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Filed by {escalation.createdBy} on {escalation.createdAt}
                  </span>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Make Decision
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="decided" className="space-y-4">
          {decided.map((escalation) => (
            <Card key={escalation.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">{escalation.id}</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${typeColors[escalation.type]}`}>
                      {escalation.type}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                      <CheckCircle className="h-3 w-3" />
                      Decided
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{escalation.client}</p>
                  <h3 className="text-lg font-semibold text-foreground">{escalation.workItem}</h3>
                </div>

                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-xs text-muted-foreground mb-1">Decision ({escalation.decisionDate})</p>
                  <p className="text-sm font-medium text-foreground">{escalation.decision}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
