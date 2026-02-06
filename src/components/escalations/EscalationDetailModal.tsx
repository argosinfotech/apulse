import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Clock, User, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Escalation, EscalationType, DecisionStatus } from "./EscalationFormModal";

interface EscalationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escalation: Escalation | null;
  onEdit: (escalation: Escalation) => void;
  onDelete: (escalationId: string) => void;
  onDecision: (escalationId: string, selectedOption: string, notes: string) => void;
  canEdit: boolean;
  canApprove: boolean;
}

const typeStyles: Record<EscalationType, string> = {
  Architecture: "bg-primary/10 text-primary",
  Pricing: "bg-success/10 text-success",
  Scope: "bg-warning/10 text-warning",
  "Client Risk": "bg-destructive/10 text-destructive",
  Legal: "bg-muted text-muted-foreground",
  Resource: "bg-secondary text-secondary-foreground",
};

const statusStyles: Record<DecisionStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Decided: "bg-success/10 text-success border-success/20",
};

export function EscalationDetailModal({
  open,
  onOpenChange,
  escalation,
  onEdit,
  onDelete,
  onDecision,
  canEdit,
  canApprove,
}: EscalationDetailModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [showDecisionForm, setShowDecisionForm] = useState(false);

  if (!escalation) return null;

  const handleMakeDecision = () => {
    if (selectedOption) {
      onDecision(escalation.id, selectedOption, decisionNotes);
      setSelectedOption(null);
      setDecisionNotes("");
      setShowDecisionForm(false);
      onOpenChange(false);
    }
  };

  const isPending = escalation.status === "Pending";
  const isDecided = escalation.status === "Decided";
  const isDraft = escalation.status === "Draft";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground">{escalation.id}</span>
                <Badge variant="outline" className={typeStyles[escalation.type]}>
                  {escalation.type}
                </Badge>
                <Badge variant="outline" className={statusStyles[escalation.status]}>
                  {escalation.status}
                </Badge>
              </div>
              <DialogTitle className="text-xl">{escalation.workItemTitle}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{escalation.client}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status bar with actions */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Filed by {escalation.createdBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {escalation.createdAt}
              </span>
              {isPending && (
                <span className="text-warning font-medium">
                  {escalation.daysOpen} days open
                </span>
              )}
            </div>
            {canEdit && !isDecided && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(escalation);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Escalation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this escalation? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          onDelete(escalation.id);
                          onOpenChange(false);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Work Item Link */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{escalation.workItemId}</span>
              <span className="text-sm text-foreground">{escalation.workItemTitle}</span>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Context */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium text-foreground mb-2">Context</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{escalation.context}</p>
          </div>

          {/* Options */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Options</h4>
            <div className="space-y-2">
              {escalation.options.map((option, idx) => {
                const isSelected = selectedOption === option.label;
                const isDecidedOption = isDecided && escalation.decision?.includes(option.label);
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (canApprove && isPending && showDecisionForm) {
                        setSelectedOption(option.label);
                      }
                    }}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      isDecidedOption
                        ? "border-success bg-success/5"
                        : isSelected
                        ? "border-accent bg-accent/5"
                        : showDecisionForm && canApprove && isPending
                        ? "border-border hover:border-accent/50 cursor-pointer"
                        : "border-border"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                        isDecidedOption
                          ? "border-success bg-success"
                          : isSelected
                          ? "border-accent bg-accent"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {(isSelected || isDecidedOption) && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DCOL Recommendation */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">DCOL Recommendation</p>
                <p className="text-sm font-medium text-accent">{escalation.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Decision (if decided) */}
          {isDecided && escalation.decision && (
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Decision made on {escalation.decisionDate}
                  </p>
                  <p className="text-sm font-medium text-foreground">{escalation.decision}</p>
                  {escalation.decisionNotes && (
                    <p className="text-sm text-muted-foreground mt-2">{escalation.decisionNotes}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Decision Form (for Founder on Pending) */}
          {canApprove && isPending && (
            <div className="pt-4 border-t">
              {!showDecisionForm ? (
                <Button
                  className="w-full bg-accent hover:bg-accent/90"
                  onClick={() => setShowDecisionForm(true)}
                >
                  Make Decision
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                      Select an option above, then add any notes below.
                    </p>
                    <Label htmlFor="decision-notes">Decision Notes (optional)</Label>
                    <Textarea
                      id="decision-notes"
                      placeholder="Add any additional context or instructions..."
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDecisionForm(false);
                        setSelectedOption(null);
                        setDecisionNotes("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-success hover:bg-success/90"
                      disabled={!selectedOption}
                      onClick={handleMakeDecision}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Decision
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Draft notice for DCOL */}
          {isDraft && canEdit && (
            <div className="p-4 rounded-lg bg-muted/50 border border-muted text-center">
              <p className="text-sm text-muted-foreground">
                This escalation is in <strong>Draft</strong> status and not yet visible to the Founder.
                <br />
                Edit to change status to "Submit for Decision" when ready.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
