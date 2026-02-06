import { useState } from "react";
import { Plus, Search, Eye, Filter, LayoutGrid, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IntakeFormModal, IntakeRequest, IntakeStatus, IntakeFormData } from "@/components/intake/IntakeFormModal";
import { IntakeDetailModal } from "@/components/intake/IntakeDetailModal";
import { ConvertToWorkItemModal, WorkItemFormData } from "@/components/intake/ConvertToWorkItemModal";
import { useAuth } from "@/contexts/AuthContext";
import { canEdit } from "@/config/permissions";
import { toast } from "sonner";

const initialRequests: IntakeRequest[] = [
  {
    id: "IR-001",
    client: "Stephengould",
    summary: "Need to add Apple Pay support to checkout",
    type: "Feature",
    source: "Email",
    urgency: "High",
    status: "New",
    intakeDate: "2024-01-15",
    daysOld: 0,
  },
  {
    id: "IR-002",
    client: "TEL",
    summary: "Dashboard charts not loading on Safari",
    type: "Bug",
    source: "WhatsApp",
    urgency: "Critical",
    status: "New",
    intakeDate: "2024-01-14",
    daysOld: 1,
  },
  {
    id: "IR-003",
    client: "Virtu-Meet",
    summary: "Request for user analytics export feature",
    type: "Feature",
    source: "Meeting",
    urgency: "Low",
    status: "Need Client Info",
    intakeDate: "2024-01-12",
    daysOld: 3,
    clarifyingQuestions: "What date range and format do they need?",
  },
  {
    id: "IR-004",
    client: "SOLI",
    summary: "SEO optimization for landing pages",
    type: "SEO",
    source: "Email",
    urgency: "Medium",
    status: "Accepted",
    intakeDate: "2024-01-10",
    daysOld: 5,
  },
  {
    id: "IR-005",
    client: "SpiritWorx",
    summary: "Mobile app performance optimization",
    type: "Enhancement",
    source: "Slack",
    urgency: "High",
    status: "New",
    intakeDate: "2024-01-15",
    daysOld: 0,
  },
];

export default function IntakeRequests() {
  const { user } = useAuth();
  const canEditIntake = user ? canEdit(user.role, "intake") : false;

  const [requests, setRequests] = useState<IntakeRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<IntakeRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<IntakeRequest | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [requestToConvert, setRequestToConvert] = useState<IntakeRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IntakeRequest | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: IntakeRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleAddRequest = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleEditRequest = (request: IntakeRequest) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (request: IntakeRequest) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (requestToDelete) {
      setRequests(requests.filter((r) => r.id !== requestToDelete.id));
      toast.success(`Request ${requestToDelete.id} has been deleted`);
      setRequestToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleStatusChange = (request: IntakeRequest, newStatus: IntakeStatus) => {
    setRequests(requests.map((r) =>
      r.id === request.id ? { ...r, status: newStatus } : r
    ));
    toast.success(`${request.id} moved to ${newStatus}`);
  };

  const handleConvertClick = (request: IntakeRequest) => {
    setRequestToConvert(request);
    setConvertModalOpen(true);
  };

  const handleConvert = (requestId: string, data: WorkItemFormData) => {
    setRequests(requests.map((r) =>
      r.id === requestId ? { ...r, status: "Converted" as IntakeStatus } : r
    ));
    toast.success(`Work item "${data.title}" created from ${requestId}`);
  };

  const handleFormSubmit = (data: IntakeFormData) => {
    if (editingRequest) {
      setRequests(requests.map((r) =>
        r.id === editingRequest.id ? { ...r, ...data } : r
      ));
      toast.success(`Request ${editingRequest.id} has been updated`);
    } else {
      const newRequest: IntakeRequest = {
        id: `IR-${String(requests.length + 1).padStart(3, "0")}`,
        client: data.client,
        summary: data.summary,
        type: data.type,
        source: data.source,
        urgency: data.urgency,
        clarifyingQuestions: data.clarifyingQuestions,
        status: "New",
        intakeDate: new Date().toISOString().split("T")[0],
        daysOld: 0,
      };
      setRequests([newRequest, ...requests]);
      toast.success(`Request ${newRequest.id} has been created`);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-destructive text-destructive-foreground";
      case "High": return "bg-warning text-warning-foreground";
      case "Medium": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-primary/10 text-primary border-primary/30";
      case "Need Client Info": return "bg-warning/10 text-warning border-warning/30";
      case "Accepted": return "bg-success/10 text-success border-success/30";
      case "Rejected": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Converted": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bug": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Feature": return "bg-primary/10 text-primary border-primary/30";
      case "Enhancement": return "bg-accent/10 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusCounts = {
    all: requests.length,
    New: requests.filter(r => r.status === "New").length,
    "Need Client Info": requests.filter(r => r.status === "Need Client Info").length,
    Accepted: requests.filter(r => r.status === "Accepted").length,
    Rejected: requests.filter(r => r.status === "Rejected").length,
    Converted: requests.filter(r => r.status === "Converted").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Intake Requests</h1>
            <p className="text-muted-foreground mt-1">
              {canEditIntake ? "Manage incoming client requests and route to work items" : "View incoming client requests"}
            </p>
          </div>
          {!canEditIntake && (
            <Badge variant="outline" className="bg-muted/50">
              <Eye className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
        {canEditIntake && (
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleAddRequest}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "all", label: "All", color: "bg-muted" },
          { key: "New", label: "New", color: "bg-primary" },
          { key: "Need Client Info", label: "Need Info", color: "bg-warning" },
          { key: "Accepted", label: "Accepted", color: "bg-success" },
          { key: "Rejected", label: "Rejected", color: "bg-destructive" },
          { key: "Converted", label: "Converted", color: "bg-muted-foreground" },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key as IntakeStatus | "all")}
            className={`p-3 rounded-lg border transition-all ${
              statusFilter === status.key 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              <span className="text-sm font-medium text-foreground">{status.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {statusCounts[status.key as keyof typeof statusCounts]}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, client, or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table View */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Summary</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Urgency</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Age</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(request)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-foreground">{request.client}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-sm text-foreground line-clamp-1">{request.summary}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${request.daysOld > 2 ? "text-warning font-medium" : "text-muted-foreground"}`}>
                        {request.daysOld === 0 ? "Today" : `${request.daysOld}d`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No intake requests found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <IntakeDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        request={selectedRequest}
        onEdit={handleEditRequest}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        onConvert={handleConvertClick}
        canEdit={canEditIntake}
      />

      {/* Intake Form Modal */}
      <IntakeFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        request={editingRequest}
        onSubmit={handleFormSubmit}
      />

      {/* Convert to Work Item Modal */}
      <ConvertToWorkItemModal
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
        request={requestToConvert}
        onConvert={handleConvert}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {requestToDelete?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
