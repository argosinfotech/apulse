import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DCOL, ClientInfo } from "@/contexts/DCOLContext";

const dcolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "inactive"]),
  assignedClients: z.array(z.string()),
});

type DCOLFormValues = z.infer<typeof dcolSchema>;

interface DCOLFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dcol?: DCOL | null;
  clients: ClientInfo[];
  onSubmit: (data: DCOLFormValues) => void;
}

export function DCOLFormModal({
  open,
  onOpenChange,
  dcol,
  clients,
  onSubmit,
}: DCOLFormModalProps) {
  const form = useForm<DCOLFormValues>({
    resolver: zodResolver(dcolSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
      assignedClients: [],
    },
  });

  useEffect(() => {
    if (dcol) {
      form.reset({
        name: dcol.name,
        email: dcol.email,
        status: dcol.status,
        assignedClients: dcol.assignedClients,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        status: "active",
        assignedClients: [],
      });
    }
  }, [dcol, form, open]);

  const handleSubmit = (data: DCOLFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const selectedClients = form.watch("assignedClients");

  const toggleClient = (clientId: string) => {
    const current = form.getValues("assignedClients");
    if (current.includes(clientId)) {
      form.setValue(
        "assignedClients",
        current.filter((id) => id !== clientId)
      );
    } else {
      form.setValue("assignedClients", [...current, clientId]);
    }
  };

  const removeClient = (clientId: string) => {
    const current = form.getValues("assignedClients");
    form.setValue(
      "assignedClients",
      current.filter((id) => id !== clientId)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dcol ? "Edit Coordinator" : "Add New Coordinator"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alex Chen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., alex@company.com" {...field} />
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assigned Clients */}
            <div className="space-y-3">
              <FormLabel>Assigned Clients</FormLabel>
              
              {/* Selected clients badges */}
              {selectedClients.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50">
                  {selectedClients.map((clientId) => {
                    const client = clients.find((c) => c.id === clientId);
                    return (
                      <Badge
                        key={clientId}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        {client?.name || clientId}
                        <button
                          type="button"
                          onClick={() => removeClient(clientId)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Client selection */}
              <ScrollArea className="h-[160px] rounded-lg border p-3">
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleClient(client.id)}
                    >
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => toggleClient(client.id)}
                      />
                      <span className="text-sm font-medium">{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.id}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {selectedClients.length} client{selectedClients.length !== 1 ? "s" : ""} assigned
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {dcol ? "Save Changes" : "Add Coordinator"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
