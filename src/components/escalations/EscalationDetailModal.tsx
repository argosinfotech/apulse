import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import { Pencil, Trash2, Clock, User, CheckCircle, ArrowRight, ExternalLink, Building2 } from "lucide-react";
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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{escalation.id}</span>
                <Badge variant="outline" className={typeStyles[escalation.type]}>
                  {escalation.type}
                </Badge>
              </div>
              <DialogTitle className="text-base font-semibold leading-tight">{escalation.workItemTitle}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{escalation.client}</p>
            </div>
            <Badge variant="outline" className={`${statusStyles[escalation.status]} shrink-0`}>
              {escalation.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Details & Context */}
            <div className="space-y-3">
              {/* Meta Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Filed by</span>
                  <span className="font-medium text-foreground ml-auto">{escalation.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Created</span>
                  <span className="font-medium text-foreground ml-auto">{escalation.createdAt}</span>
                </div>
                {isPending && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-warning shrink-0" />
                    <span className="text-warning text-xs font-medium">{escalation.daysOpen} days open</span>
                  </div>
                )}
              </div>

              {/* Work Item Link */}
              <div className="flex items-center justify-between p-2 rounded border border-border bg-muted/30">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground">{escalation.workItemId}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              {/* Context */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Context</p>
                <p className="text-xs text-foreground bg-muted/50 p-2 rounded border border-border whitespace-pre-wrap">
                  {escalation.context}
                </p>
              </div>
            </div>

            {/* Right Column - Recommendation & Decision */}
            <div className="space-y-3">
              {/* DCOL Recommendation */}
              <div className="p-2.5 rounded bg-accent/10 border border-accent/30">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">DCOL Recommendation</p>
                    <p className="text-xs font-medium text-accent">{escalation.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Decision (if decided) */}
              {isDecided && escalation.decision && (
                <div className="p-2.5 rounded bg-success/10 border border-success/30">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Decided {escalation.decisionDate}
                      </p>
                      <p className="text-xs font-medium text-foreground">{escalation.decision}</p>
                      {escalation.decisionNotes && (
                        <p className="text-xs text-muted-foreground mt-1">{escalation.decisionNotes}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Draft notice */}
              {isDraft && canEdit && (
                <div className="p-2 rounded bg-muted/50 border border-muted text-center">
                  <p className="text-xs text-muted-foreground">
                    <strong>Draft</strong> - Not visible to Founder yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Options - Full Width */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Options</p>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`flex items-start gap-2 p-2.5 rounded border transition-colors ${
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
                      className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                        isDecidedOption
                          ? "border-success bg-success"
                          : isSelected
                          ? "border-accent bg-accent"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {(isSelected || isDecidedOption) && <CheckCircle className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-foreground">{option.label}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision Form (for Founder on Pending) */}
          {canApprove && isPending && (
            <div className="pt-3 border-t border-border">
              {!showDecisionForm ? (
                <Button
                  className="w-full h-8 text-xs bg-accent hover:bg-accent/90"
                  onClick={() => setShowDecisionForm(true)}
                >
                  Make Decision
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-muted/30 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Select an option above, then add notes below.
                    </p>
                    <Label htmlFor="decision-notes" className="text-xs">Decision Notes</Label>
                    <RichTextEditor
                      placeholder="Add context or instructions..."
                      value={decisionNotes}
                      onChange={setDecisionNotes}
                      minHeight="60px"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      onClick={() => {
                        setShowDecisionForm(false);
                        setSelectedOption(null);
                        setDecisionNotes("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs bg-success hover:bg-success/90"
                      disabled={!selectedOption}
                      onClick={handleMakeDecision}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {canEdit && !isDecided && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(escalation);
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Escalation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure? This action cannot be undone.
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
      </DialogContent>
    </Dialog>
  );
}
