import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type EscalationType = "Architecture" | "Pricing" | "Scope" | "Client Risk" | "Legal" | "Resource";
export type DecisionStatus = "Draft" | "Pending" | "Decided";

export interface EscalationOption {
  label: string;
  description: string;
}

export interface Escalation {
  id: string;
  client: string;
  workItemId: string;
  workItemTitle: string;
  type: EscalationType;
  context: string;
  options: EscalationOption[];
  recommendation: string;
  createdBy: string;
  createdAt: string;
  status: DecisionStatus;
  decision?: string;
  decisionNotes?: string;
  decisionDate?: string;
  daysOpen: number;
  updatedAt: string;
}

const optionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

const escalationSchema = z.object({
  workItemId: z.string().min(1, "Work Item is required"),
  workItemTitle: z.string(),
  client: z.string(),
  type: z.enum(["Architecture", "Pricing", "Scope", "Client Risk", "Legal", "Resource"]),
  context: z.string().min(10, "Context must be at least 10 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  recommendation: z.string().min(1, "Recommendation is required"),
  status: z.enum(["Draft", "Pending"]),
});

type EscalationFormValues = z.infer<typeof escalationSchema>;

export type EscalationFormData = {
  workItemId: string;
  workItemTitle: string;
  client: string;
  type: EscalationType;
  context: string;
  options: EscalationOption[];
  recommendation: string;
  status: "Draft" | "Pending";
};

interface EscalationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escalation?: Escalation | null;
  onSubmit: (data: EscalationFormData) => void;
}

const workItems = [
  { id: "WI-001", title: "E-commerce checkout optimization", client: "Stephengould" },
  { id: "WI-002", title: "Mobile app performance improvements", client: "Virtu-Meet" },
  { id: "WI-003", title: "Dashboard redesign phase 2", client: "TEL" },
  { id: "WI-004", title: "API integration for payments", client: "SOLI" },
];

export function EscalationFormModal({ open, onOpenChange, escalation, onSubmit }: EscalationFormModalProps) {
  const form = useForm<EscalationFormValues>({
    resolver: zodResolver(escalationSchema),
    defaultValues: {
      workItemId: "",
      workItemTitle: "",
      client: "",
      type: "Scope",
      context: "",
      options: [
        { label: "Option A", description: "" },
        { label: "Option B", description: "" },
      ],
      recommendation: "",
      status: "Draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (escalation) {
      form.reset({
        workItemId: escalation.workItemId,
        workItemTitle: escalation.workItemTitle,
        client: escalation.client,
        type: escalation.type,
        context: escalation.context,
        options: escalation.options,
        recommendation: escalation.recommendation,
        status: escalation.status === "Decided" ? "Pending" : escalation.status,
      });
    } else {
      form.reset({
        workItemId: "",
        workItemTitle: "",
        client: "",
        type: "Scope",
        context: "",
        options: [
          { label: "Option A", description: "" },
          { label: "Option B", description: "" },
        ],
        recommendation: "",
        status: "Draft",
      });
    }
  }, [escalation, form, open]);

  const handleWorkItemChange = (workItemId: string) => {
    const workItem = workItems.find((wi) => wi.id === workItemId);
    if (workItem) {
      form.setValue("workItemId", workItem.id);
      form.setValue("workItemTitle", workItem.title);
      form.setValue("client", workItem.client);
    }
  };

  const handleSubmit = (data: EscalationFormValues) => {
    onSubmit(data as EscalationFormData);
    onOpenChange(false);
  };

  const addOption = () => {
    const nextLabel = `Option ${String.fromCharCode(65 + fields.length)}`;
    append({ label: nextLabel, description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{escalation ? "Edit Escalation" : "File New Escalation"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Work Item Selection */}
            <FormField
              control={form.control}
              name="workItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Item</FormLabel>
                  <Select onValueChange={handleWorkItemChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workItems.map((wi) => (
                        <SelectItem key={wi.id} value={wi.id}>
                          {wi.id} - {wi.title} ({wi.client})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escalation Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Scope">Scope</SelectItem>
                      <SelectItem value="Pricing">Pricing</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Client Risk">Client Risk</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Context */}
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed context about the situation requiring escalation..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Options for Decision</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={fields.length >= 5}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name={`options.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1 mr-4">
                          <FormControl>
                            <Input placeholder="Option label" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name={`options.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Describe this option, including implications..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {form.formState.errors.options?.root && (
                <p className="text-sm text-destructive">{form.formState.errors.options.root.message}</p>
              )}
            </div>

            {/* Recommendation */}
            <FormField
              control={form.control}
              name="recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DCOL Recommendation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your recommended course of action and rationale..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft (not visible to Founder)</SelectItem>
                      <SelectItem value="Pending">Submit for Decision</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {escalation ? "Save Changes" : "File Escalation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
