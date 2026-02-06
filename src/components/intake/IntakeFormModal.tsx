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
import { Textarea } from "@/components/ui/textarea";

export type IntakeStatus = "New" | "Need Client Info" | "Accepted" | "Rejected" | "Converted";
export type IntakeType = "Bug" | "Feature" | "Enhancement" | "SEO" | "Content" | "Admin" | "Question";
export type IntakeSource = "Email" | "Call" | "Meeting" | "WhatsApp" | "Slack";
export type IntakeUrgency = "Low" | "Medium" | "High" | "Critical";

export interface IntakeRequest {
  id: string;
  client: string;
  summary: string;
  type: IntakeType;
  source: IntakeSource;
  urgency: IntakeUrgency;
  status: IntakeStatus;
  intakeDate: string;
  daysOld: number;
  clarifyingQuestions?: string;
}

const intakeFormSchema = z.object({
  client: z.string().trim().min(1, "Client name is required").max(100),
  summary: z.string().trim().min(1, "Summary is required").max(500, "Summary must be less than 500 characters"),
  type: z.enum(["Bug", "Feature", "Enhancement", "SEO", "Content", "Admin", "Question"]),
  source: z.enum(["Email", "Call", "Meeting", "WhatsApp", "Slack"]),
  urgency: z.enum(["Low", "Medium", "High", "Critical"]),
  clarifyingQuestions: z.string().max(500).optional(),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;

interface IntakeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: IntakeRequest | null;
  onSubmit: (data: IntakeFormData) => void;
}

export function IntakeFormModal({ open, onOpenChange, request, onSubmit }: IntakeFormModalProps) {
  const isEditing = !!request;

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      client: "",
      summary: "",
      type: "Feature",
      source: "Email",
      urgency: "Medium",
      clarifyingQuestions: "",
    },
  });

  // Reset form when request changes or modal opens
  useEffect(() => {
    if (open) {
      if (request) {
        form.reset({
          client: request.client,
          summary: request.summary,
          type: request.type,
          source: request.source,
          urgency: request.urgency,
          clarifyingQuestions: request.clarifyingQuestions || "",
        });
      } else {
        form.reset({
          client: "",
          summary: "",
          type: "Feature",
          source: "Email",
          urgency: "Medium",
          clarifyingQuestions: "",
        });
      }
    }
  }, [open, request, form]);

  const handleSubmit = (data: IntakeFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Request" : "New Intake Request"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the request..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bug">Bug</SelectItem>
                        <SelectItem value="Feature">Feature</SelectItem>
                        <SelectItem value="Enhancement">Enhancement</SelectItem>
                        <SelectItem value="SEO">SEO</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Question">Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Slack">Slack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clarifyingQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clarifying Questions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any questions to ask the client..."
                      className="resize-none"
                      rows={2}
                      {...field}
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
                {isEditing ? "Save Changes" : "Create Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
