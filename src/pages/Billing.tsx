import { Plus, Search, Check, Clock, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InvoiceStatus = "Draft" | "Ready for Approval" | "Sent" | "Paid";

interface Invoice {
  id: string;
  client: string;
  period: string;
  amount: string;
  status: InvoiceStatus;
  preparedBy: string;
  approvedBy?: string;
  notes?: string;
  dueDate: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-001",
    client: "Stephengould",
    period: "January 2024",
    amount: "$12,500",
    status: "Ready for Approval",
    preparedBy: "DCOL",
    notes: "Monthly retainer + additional checkout optimization work",
    dueDate: "Jan 31",
  },
  {
    id: "INV-002",
    client: "Virtu-Meet",
    period: "January 2024",
    amount: "$8,000",
    status: "Ready for Approval",
    preparedBy: "DCOL",
    dueDate: "Jan 31",
  },
  {
    id: "INV-003",
    client: "TEL",
    period: "January 2024",
    amount: "$6,500",
    status: "Draft",
    preparedBy: "DCOL",
    notes: "Phase 2 milestone payment pending review completion",
    dueDate: "Feb 5",
  },
  {
    id: "INV-004",
    client: "SOLI",
    period: "December 2023",
    amount: "$5,000",
    status: "Paid",
    preparedBy: "DCOL",
    approvedBy: "Manish",
    dueDate: "Dec 31",
  },
  {
    id: "INV-005",
    client: "SpiritWorx",
    period: "December 2023",
    amount: "$3,500",
    status: "Sent",
    preparedBy: "DCOL",
    approvedBy: "Manish",
    dueDate: "Jan 15",
  },
];

const statusConfig: Record<InvoiceStatus, { bg: string; text: string; icon: typeof Check }> = {
  Draft: { bg: "bg-muted", text: "text-muted-foreground", icon: FileText },
  "Ready for Approval": { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  Sent: { bg: "bg-primary/10", text: "text-primary", icon: FileText },
  Paid: { bg: "bg-success/10", text: "text-success", icon: Check },
};

export default function Billing() {
  const awaitingApproval = invoices.filter((i) => i.status === "Ready for Approval");
  const totalPending = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Invoicing</h1>
          <p className="text-muted-foreground mt-1">
            Manage invoices and track billing status
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{awaitingApproval.length}</p>
                <p className="text-sm text-muted-foreground">Awaiting Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${totalPending.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {invoices.filter((i) => i.status === "Paid").length}
                </p>
                <p className="text-sm text-muted-foreground">Paid This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices needing approval */}
      {awaitingApproval.length > 0 && (
        <Card className="shadow-card border-warning/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-warning" />
              Awaiting Your Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {awaitingApproval.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{invoice.id}</p>
                    <h4 className="font-medium text-foreground">{invoice.client}</h4>
                    <p className="text-sm text-muted-foreground">{invoice.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{invoice.amount}</p>
                    <p className="text-xs text-muted-foreground">Due {invoice.dueDate}</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Invoices */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">All Invoices</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Period</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const config = statusConfig[invoice.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-muted-foreground">{invoice.id}</td>
                      <td className="py-4 px-4 text-sm font-medium text-foreground">{invoice.client}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{invoice.period}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-foreground text-right">{invoice.amount}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
