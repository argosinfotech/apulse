import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { IntakeCard } from "@/components/intake/IntakeCard";
import { ConvertToWorkItemModal, WorkItemFormData } from "@/components/intake/ConvertToWorkItemModal";
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
    urgency: "Medium",
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
];

const statusColumns: IntakeStatus[] = ["New", "Need Client Info", "Accepted", "Rejected", "Converted"];

export default function IntakeRequests() {
  const [requests, setRequests] = useState<IntakeRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<IntakeRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<IntakeRequest | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [requestToConvert, setRequestToConvert] = useState<IntakeRequest | null>(null);

  const filteredRequests = requests.filter((r) =>
    r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRequestsByStatus = (status: IntakeStatus) => {
    return filteredRequests.filter((r) => r.status === status);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intake Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming client requests and route to work items
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleAddRequest}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {statusColumns.map((status) => (
          <div key={status} className="min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{status}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {getRequestsByStatus(status).length}
              </span>
            </div>
            <div className="space-y-3">
              {getRequestsByStatus(status).map((request) => (
                <IntakeCard
                  key={request.id}
                  request={request}
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteClick}
                  onStatusChange={handleStatusChange}
                  onConvert={handleConvertClick}
                />
              ))}
              {getRequestsByStatus(status).length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                  No requests
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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
