import { Clock, MessageSquare, ArrowRight, MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IntakeRequest, IntakeStatus } from "./IntakeFormModal";

const typeColors: Record<IntakeRequest["type"], string> = {
  Bug: "bg-destructive/10 text-destructive",
  Feature: "bg-primary/10 text-primary",
  SEO: "bg-success/10 text-success",
  Content: "bg-accent/10 text-accent",
  Admin: "bg-muted text-muted-foreground",
  Question: "bg-warning/10 text-warning",
};

interface IntakeCardProps {
  request: IntakeRequest;
  onEdit: (request: IntakeRequest) => void;
  onDelete: (request: IntakeRequest) => void;
  onStatusChange: (request: IntakeRequest, status: IntakeStatus) => void;
  onConvert: (request: IntakeRequest) => void;
}

export function IntakeCard({ request, onEdit, onDelete, onStatusChange, onConvert }: IntakeCardProps) {
  return (
    <Card
      className={`shadow-card hover:shadow-soft transition-all ${
        request.daysOld > 2 ? "border-l-2 border-l-warning" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">{request.id}</span>
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[request.type]}`}>
              {request.type}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(request)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {request.status !== "Accepted" && (
                  <DropdownMenuItem onClick={() => onStatusChange(request, "Accepted")}>
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Accept
                  </DropdownMenuItem>
                )}
                {request.status !== "Rejected" && (
                  <DropdownMenuItem onClick={() => onStatusChange(request, "Rejected")}>
                    <XCircle className="h-4 w-4 mr-2 text-destructive" />
                    Reject
                  </DropdownMenuItem>
                )}
                {request.status !== "Need Client Info" && (
                  <DropdownMenuItem onClick={() => onStatusChange(request, "Need Client Info")}>
                    <HelpCircle className="h-4 w-4 mr-2 text-warning" />
                    Need Info
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(request)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            onClick={() => onConvert(request)}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Convert to Work Item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
