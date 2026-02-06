import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { X, Plus } from "lucide-react";
import { useState } from "react";

// Types
export type WorkItemCategory = "Bug" | "Feature" | "SEO" | "Ops" | "Product";
export type WorkItemPriority = "P0" | "P1" | "P2" | "P3";
export type WorkItemSize = "S" | "M" | "L" | "XL";
export type WorkItemStatus = "Triage" | "In Progress" | "Blocked" | "Ready for Review" | "Client Review" | "Done";
export type WorkItemRisk = "green" | "yellow" | "red";
export type WorkItemBlockedBy = "Client" | "Tech" | "Dependency" | "Waiting";

export interface WorkItem {
  id: string;
  client: string;
  title: string;
  category: WorkItemCategory;
  priority: WorkItemPriority;
  size: WorkItemSize;
  status: WorkItemStatus;
  risk: WorkItemRisk;
  riskReason?: string;
  blockedBy?: WorkItemBlockedBy;
  jiraLinks: string[];
  owner: string;
  startedDate?: string;
  targetDate: string;
  lastUpdated: string;
  clientStatusNote?: string;
  internalNotes?: string;
}

const workItemFormSchema = z.object({
  client: z.string().trim().min(1, "Client is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  category: z.enum(["Bug", "Feature", "SEO", "Ops", "Product"]),
  priority: z.enum(["P0", "P1", "P2", "P3"]),
  size: z.enum(["S", "M", "L", "XL"]),
  status: z.enum(["Triage", "In Progress", "Blocked", "Ready for Review", "Client Review", "Done"]),
  risk: z.enum(["green", "yellow", "red"]),
  riskReason: z.string().max(300).optional(),
  blockedBy: z.enum(["Client", "Tech", "Dependency", "Waiting"]).optional(),
  owner: z.string().trim().min(1, "Owner is required").max(100),
  startedDate: z.string().optional(),
  targetDate: z.string().min(1, "Target date is required"),
  clientStatusNote: z.string().max(200, "Keep client note under 200 characters").optional(),
  internalNotes: z.string().max(500, "Keep internal notes under 500 characters").optional(),
}).refine((data) => {
  if ((data.risk === "yellow" || data.risk === "red") && !data.riskReason?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Risk reason is required when risk is Yellow or Red",
  path: ["riskReason"],
});

export type WorkItemFormData = z.infer<typeof workItemFormSchema>;

interface WorkItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workItem?: WorkItem | null;
  onSubmit: (data: WorkItemFormData, jiraLinks: string[]) => void;
  clients: string[];
}

export function WorkItemFormModal({ open, onOpenChange, workItem, onSubmit, clients }: WorkItemFormModalProps) {
  const isEditing = !!workItem;
  const [jiraLinks, setJiraLinks] = useState<string[]>([]);
  const [newJiraLink, setNewJiraLink] = useState("");

  const form = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemFormSchema),
    defaultValues: {
      client: "",
      title: "",
      category: "Feature",
      priority: "P2",
      size: "M",
      status: "Triage",
      risk: "green",
      riskReason: "",
      blockedBy: undefined,
      owner: "",
      startedDate: "",
      targetDate: "",
      clientStatusNote: "",
      internalNotes: "",
    },
  });

  const watchRisk = form.watch("risk");

  useEffect(() => {
    if (open) {
      if (workItem) {
        form.reset({
          client: workItem.client,
          title: workItem.title,
          category: workItem.category,
          priority: workItem.priority,
          size: workItem.size,
          status: workItem.status,
          risk: workItem.risk,
          riskReason: workItem.riskReason || "",
          blockedBy: workItem.blockedBy,
          owner: workItem.owner,
          startedDate: workItem.startedDate || "",
          targetDate: workItem.targetDate,
          clientStatusNote: workItem.clientStatusNote || "",
          internalNotes: workItem.internalNotes || "",
        });
        setJiraLinks(workItem.jiraLinks || []);
      } else {
        form.reset({
          client: "",
          title: "",
          category: "Feature",
          priority: "P2",
          size: "M",
          status: "Triage",
          risk: "green",
          riskReason: "",
          blockedBy: undefined,
          owner: "",
          startedDate: "",
          targetDate: "",
          clientStatusNote: "",
          internalNotes: "",
        });
        setJiraLinks([]);
      }
    }
  }, [open, workItem, form]);

  const handleAddJiraLink = () => {
    if (newJiraLink.trim() && !jiraLinks.includes(newJiraLink.trim())) {
      setJiraLinks([...jiraLinks, newJiraLink.trim()]);
      setNewJiraLink("");
    }
  };

  const handleRemoveJiraLink = (link: string) => {
    setJiraLinks(jiraLinks.filter((l) => l !== link));
  };

  const handleSubmit = (data: WorkItemFormData) => {
    onSubmit(data, jiraLinks);
    form.reset();
    setJiraLinks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Work Item" : "New Work Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Client & Title */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client} value={client}>{client}</SelectItem>
                        ))}
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
                    <FormLabel>Owner (DCOL) *</FormLabel>
                    <FormControl>
                      <Input placeholder="Assigned owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (client-safe) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Work item title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category, Priority, Size */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bug">Bug</SelectItem>
                        <SelectItem value="Feature">Feature</SelectItem>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="Ops">Ops</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="P0">P0 - Critical</SelectItem>
                        <SelectItem value="P1">P1 - High</SelectItem>
                        <SelectItem value="P2">P2 - Medium</SelectItem>
                        <SelectItem value="P3">P3 - Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="S">S - Small</SelectItem>
                        <SelectItem value="M">M - Medium</SelectItem>
                        <SelectItem value="L">L - Large</SelectItem>
                        <SelectItem value="XL">XL - Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status & Blocked By */}
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
                        <SelectItem value="Triage">Triage</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                        <SelectItem value="Ready for Review">Ready for Review</SelectItem>
                        <SelectItem value="Client Review">Client Review</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blockedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blocked By</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Not blocked" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Dependency">Dependency</SelectItem>
                        <SelectItem value="Waiting">Waiting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Risk */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="green">🟢 Green</SelectItem>
                        <SelectItem value="yellow">🟡 Yellow</SelectItem>
                        <SelectItem value="red">🔴 Red</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(watchRisk === "yellow" || watchRisk === "red") && (
                <FormField
                  control={form.control}
                  name="riskReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Reason *</FormLabel>
                      <FormControl>
                        <Input placeholder="Why is this at risk?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Started Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Jira Links */}
            <div>
              <FormLabel>Jira Links</FormLabel>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="PROJ-123 or full URL"
                  value={newJiraLink}
                  onChange={(e) => setNewJiraLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddJiraLink();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddJiraLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {jiraLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {jiraLinks.map((link) => (
                    <span
                      key={link}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm"
                    >
                      {link}
                      <button
                        type="button"
                        onClick={() => handleRemoveJiraLink(link)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="clientStatusNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client-facing Status Note</FormLabel>
                  <FormControl>
                    <Input placeholder="Status visible to client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Internal team notes..."
                      value={field.value || ""}
                      onChange={field.onChange}
                      minHeight="60px"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isEditing ? "Save Changes" : "Create Work Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
