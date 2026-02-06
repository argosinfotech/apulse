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
import { Separator } from "@/components/ui/separator";
import { HealthStatus } from "@/components/ui/status-badge";

const clientFormSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(100, "Name must be less than 100 characters"),
  accountType: z.enum(["Retainer", "Project", "Internal Product"]),
  revenueTier: z.enum(["High", "Med", "Low"]),
  health: z.enum(["green", "yellow", "red"]),
  updateFrequency: z.enum(["Daily", "Weekly", "Bi-weekly", "Monthly"]),
  // Primary Contact fields
  contactFirstName: z.string().trim().max(50, "First name must be less than 50 characters").optional(),
  contactLastName: z.string().trim().max(50, "Last name must be less than 50 characters").optional(),
  contactPhone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
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
  // Primary Contact fields
  contactFirstName?: string;
  contactLastName?: string;
  contactPhone?: string;
  contactEmail?: string;
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
      name: "",
      accountType: "Project",
      revenueTier: "Med",
      health: "green",
      updateFrequency: "Weekly",
      contactFirstName: "",
      contactLastName: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  // Reset form when modal opens/closes or client changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: client?.name || "",
        accountType: client?.accountType || "Project",
        revenueTier: client?.revenueTier || "Med",
        health: client?.health || "green",
        updateFrequency: (client?.updateFrequency as ClientFormData["updateFrequency"]) || "Weekly",
        contactFirstName: client?.contactFirstName || "",
        contactLastName: client?.contactLastName || "",
        contactPhone: client?.contactPhone || "",
        contactEmail: client?.contactEmail || "",
      });
    }
  }, [open, client, form]);

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
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

            <Separator className="my-4" />

            <div>
              <p className="text-sm font-medium mb-3">Primary Contact</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@company.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
