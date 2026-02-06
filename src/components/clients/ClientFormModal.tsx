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
import { Textarea } from "@/components/ui/textarea";
import { HealthStatus } from "@/components/ui/status-badge";

const clientFormSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(100, "Name must be less than 100 characters"),
  accountType: z.enum(["Retainer", "Project", "Internal Product"]),
  revenueTier: z.enum(["High", "Med", "Low"]),
  health: z.enum(["green", "yellow", "red"]),
  healthReason: z.string().max(200, "Reason must be less than 200 characters").optional(),
  updateFrequency: z.enum(["Daily", "Weekly", "Bi-weekly", "Monthly"]),
  nextMilestone: z.string().max(100, "Milestone must be less than 100 characters").optional(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

export interface Client {
  id: string;
  name: string;
  accountType: "Retainer" | "Project" | "Internal Product";
  revenueTier: "High" | "Med" | "Low";
  health: HealthStatus;
  healthReason?: string;
  lastTouch: string;
  nextMilestone: string;
  updateFrequency: string;
  activeWorkItems: number;
  openEscalations: number;
}

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSubmit: (data: ClientFormData) => void;
}

export function ClientFormModal({ open, onOpenChange, client, onSubmit }: ClientFormModalProps) {
  const isEditing = !!client;

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      accountType: client?.accountType || "Project",
      revenueTier: client?.revenueTier || "Med",
      health: client?.health || "green",
      healthReason: client?.healthReason || "",
      updateFrequency: (client?.updateFrequency as ClientFormData["updateFrequency"]) || "Weekly",
      nextMilestone: client?.nextMilestone || "",
    },
  });

  // Reset form when client changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit = (data: ClientFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Retainer">Retainer</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Internal Product">Internal Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenueTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Med">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="health"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="green">Healthy</SelectItem>
                        <SelectItem value="yellow">At Risk</SelectItem>
                        <SelectItem value="red">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="updateFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="healthReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Reason (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any health concerns or notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextMilestone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Milestone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MVP launch - Feb 28" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isEditing ? "Save Changes" : "Add Client"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
