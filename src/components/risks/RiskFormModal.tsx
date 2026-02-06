import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

export type RiskType = "Scope" | "Timeline" | "Tech" | "Client" | "Quality" | "Dependency";
export type Severity = "Low" | "Med" | "High";
export type RiskStatus = "Open" | "Mitigating" | "Resolved";

export interface Risk {
  id: string;
  workItemId: string;
  workItemTitle: string;
  client: string;
  type: RiskType;
  severity: Severity;
  description: string;
  mitigationPlan: string;
  owner: string;
  dueDate: string;
  status: RiskStatus;
  createdAt: string;
  updatedAt: string;
}

const riskSchema = z.object({
  workItemId: z.string().min(1, "Work Item is required"),
  workItemTitle: z.string().min(1, "Work Item Title is required"),
  client: z.string().min(1, "Client is required"),
  type: z.enum(["Scope", "Timeline", "Tech", "Client", "Quality", "Dependency"]),
  severity: z.enum(["Low", "Med", "High"]),
  description: z.string().min(1, "Description is required"),
  mitigationPlan: z.string().optional(),
  owner: z.string().min(1, "Owner is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["Open", "Mitigating", "Resolved"]),
});

type RiskFormValues = z.infer<typeof riskSchema>;

interface RiskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  risk?: Risk | null;
  onSubmit: (data: RiskFormValues) => void;
}

const workItems = [
  { id: "WI-001", title: "E-commerce checkout optimization", client: "Stephengould" },
  { id: "WI-002", title: "Mobile app performance improvements", client: "Virtu-Meet" },
  { id: "WI-003", title: "Dashboard redesign phase 2", client: "TEL" },
  { id: "WI-004", title: "API integration for payments", client: "SOLI" },
];

export function RiskFormModal({ open, onOpenChange, risk, onSubmit }: RiskFormModalProps) {
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      workItemId: "",
      workItemTitle: "",
      client: "",
      type: "Tech",
      severity: "Med",
      description: "",
      mitigationPlan: "",
      owner: "DCOL",
      dueDate: "",
      status: "Open",
    },
  });

  useEffect(() => {
    if (risk) {
      form.reset({
        workItemId: risk.workItemId,
        workItemTitle: risk.workItemTitle,
        client: risk.client,
        type: risk.type,
        severity: risk.severity,
        description: risk.description,
        mitigationPlan: risk.mitigationPlan,
        owner: risk.owner,
        dueDate: risk.dueDate,
        status: risk.status,
      });
    } else {
      form.reset({
        workItemId: "",
        workItemTitle: "",
        client: "",
        type: "Tech",
        severity: "Med",
        description: "",
        mitigationPlan: "",
        owner: "DCOL",
        dueDate: "",
        status: "Open",
      });
    }
  }, [risk, form]);

  const handleWorkItemChange = (workItemId: string) => {
    const workItem = workItems.find((wi) => wi.id === workItemId);
    if (workItem) {
      form.setValue("workItemId", workItem.id);
      form.setValue("workItemTitle", workItem.title);
      form.setValue("client", workItem.client);
    }
  };

  const handleSubmit = (data: RiskFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{risk ? "Edit Risk" : "Log New Risk"}</DialogTitle>
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
                          {wi.id} - {wi.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type and Severity */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scope">Scope</SelectItem>
                        <SelectItem value="Timeline">Timeline</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Quality">Quality</SelectItem>
                        <SelectItem value="Dependency">Dependency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Med">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the risk or blocker..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mitigation Plan */}
            <FormField
              control={form.control}
              name="mitigationPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitigation Plan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What steps are being taken to address this risk?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status and Owner */}
            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Mitigating">Mitigating</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DCOL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                {risk ? "Save Changes" : "Log Risk"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
