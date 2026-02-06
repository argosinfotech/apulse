import { useState } from "react";
import { Plus, Search, ExternalLink, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  WorkItemFormModal, 
  WorkItem, 
  WorkItemStatus, 
  WorkItemFormData 
} from "@/components/workitems/WorkItemFormModal";
import { WorkItemDetailModal } from "@/components/workitems/WorkItemDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { canEdit } from "@/config/permissions";
import { toast } from "sonner";

const clients = ["Stephengould", "Virtu-Meet", "TEL", "SOLI", "SpiritWorx"];

const initialWorkItems: WorkItem[] = [
  {
    id: "WI-001",
    client: "Stephengould",
    title: "E-commerce checkout optimization",
    category: "Feature",
    priority: "P1",
    size: "L",
    status: "Blocked",
    risk: "red",
    riskReason: "Waiting on client API credentials for 5 days",
    blockedBy: "Client",
    jiraLinks: ["STEPH-123", "STEPH-124"],
    owner: "Sarah Chen",
    startedDate: "2024-01-10",
    targetDate: "2024-01-30",
    lastUpdated: "5 days ago",
    clientStatusNote: "Pending API access",
    internalNotes: "Client IT team is slow to respond",
  },
  {
    id: "WI-002",
    client: "Virtu-Meet",
    title: "Mobile app performance improvements",
    category: "Bug",
    priority: "P0",
    size: "M",
    status: "In Progress",
    risk: "yellow",
    riskReason: "Technical complexity higher than estimated",
    blockedBy: "Tech",
    jiraLinks: ["VM-456"],
    owner: "Sarah Chen",
    startedDate: "2024-01-12",
    targetDate: "2024-02-15",
    lastUpdated: "2 days ago",
  },
  {
    id: "WI-003",
    client: "TEL",
    title: "Dashboard redesign phase 2",
    category: "Feature",
    priority: "P2",
    size: "XL",
    status: "Client Review",
    risk: "yellow",
    riskReason: "Client unresponsive to review requests",
    blockedBy: "Client",
    jiraLinks: ["TEL-789", "TEL-790", "TEL-791"],
    owner: "Sarah Chen",
    targetDate: "2024-02-05",
    lastUpdated: "7 days ago",
    clientStatusNote: "Awaiting feedback on v2 mockups",
  },
  {
    id: "WI-004",
    client: "SOLI",
    title: "User authentication system",
    category: "Feature",
    priority: "P1",
    size: "M",
    status: "In Progress",
    risk: "green",
    jiraLinks: ["SOLI-101"],
    owner: "Sarah Chen",
    startedDate: "2024-01-15",
    targetDate: "2024-02-28",
    lastUpdated: "Today",
  },
  {
    id: "WI-005",
    client: "SpiritWorx",
    title: "Beta analytics dashboard",
    category: "Product",
    priority: "P3",
    size: "S",
    status: "Ready for Review",
    risk: "green",
    jiraLinks: ["SW-55"],
    owner: "Sarah Chen",
    targetDate: "2024-03-10",
    lastUpdated: "1 day ago",
  },
];

const statusColumns: WorkItemStatus[] = [
  "Triage", "In Progress", "Blocked", "Ready for Review", "Client Review", "Done"
];

export default function WorkItems() {
  const { user } = useAuth();
  const canEditWorkItems = user ? canEdit(user.role, "work-items") : false;

  const [workItems, setWorkItems] = useState<WorkItem[]>(initialWorkItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkItemStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkItem, setEditingWorkItem] = useState<WorkItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workItemToDelete, setWorkItemToDelete] = useState<WorkItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);

  const filteredWorkItems = workItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (workItem: WorkItem) => {
    setSelectedWorkItem(workItem);
    setDetailModalOpen(true);
  };

  const handleAddWorkItem = () => {
    setEditingWorkItem(null);
    setIsFormOpen(true);
  };

  const handleEditWorkItem = (workItem: WorkItem) => {
    setEditingWorkItem(workItem);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (workItem: WorkItem) => {
    setWorkItemToDelete(workItem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workItemToDelete) {
      setWorkItems(workItems.filter((w) => w.id !== workItemToDelete.id));
      toast.success(`Work item ${workItemToDelete.id} deleted`);
      setWorkItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleStatusChange = (workItem: WorkItem, newStatus: WorkItemStatus) => {
    setWorkItems(workItems.map((w) =>
      w.id === workItem.id ? { ...w, status: newStatus, lastUpdated: "Just now" } : w
    ));
    setSelectedWorkItem((prev) =>
      prev && prev.id === workItem.id ? { ...prev, status: newStatus, lastUpdated: "Just now" } : prev
    );
    toast.success(`${workItem.id} moved to ${newStatus}`);
  };

  const handleFormSubmit = (data: WorkItemFormData, jiraLinks: string[]) => {
    if (editingWorkItem) {
      setWorkItems(workItems.map((w) =>
        w.id === editingWorkItem.id 
          ? { ...w, ...data, jiraLinks, lastUpdated: "Just now" } 
          : w
      ));
      toast.success(`Work item ${editingWorkItem.id} updated`);
    } else {
      const newWorkItem: WorkItem = {
        id: `WI-${String(workItems.length + 1).padStart(3, "0")}`,
        client: data.client,
        title: data.title,
        category: data.category,
        priority: data.priority,
        size: data.size,
        status: data.status,
        risk: data.risk,
        riskReason: data.riskReason,
        blockedBy: data.blockedBy,
        owner: data.owner,
        startedDate: data.startedDate,
        targetDate: data.targetDate,
        clientStatusNote: data.clientStatusNote,
        internalNotes: data.internalNotes,
        jiraLinks,
        lastUpdated: "Just now",
      };
      setWorkItems([newWorkItem, ...workItems]);
      toast.success(`Work item ${newWorkItem.id} created`);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "red": return "bg-destructive text-destructive-foreground";
      case "yellow": return "bg-warning text-warning-foreground";
      default: return "bg-success text-success-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-destructive text-destructive-foreground";
      case "P1": return "bg-warning text-warning-foreground";
      case "P2": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Triage": return "bg-muted text-muted-foreground";
      case "In Progress": return "bg-primary/10 text-primary border-primary/30";
      case "Blocked": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Ready for Review": return "bg-warning/10 text-warning border-warning/30";
      case "Client Review": return "bg-accent/10 text-accent border-accent/30";
      case "Done": return "bg-success/10 text-success border-success/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusCounts = {
    all: workItems.length,
    Triage: workItems.filter(w => w.status === "Triage").length,
    "In Progress": workItems.filter(w => w.status === "In Progress").length,
    Blocked: workItems.filter(w => w.status === "Blocked").length,
    "Ready for Review": workItems.filter(w => w.status === "Ready for Review").length,
    "Client Review": workItems.filter(w => w.status === "Client Review").length,
    Done: workItems.filter(w => w.status === "Done").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Work Items</h1>
            <p className="text-muted-foreground mt-1">
              {canEditWorkItems ? "Track and manage delivery across all clients" : "View delivery status across all clients"}
            </p>
          </div>
          {!canEditWorkItems && (
            <Badge variant="outline" className="bg-muted/50">
              <Eye className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
        {canEditWorkItems && (
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleAddWorkItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Work Item
          </Button>
        )}
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { key: "all", label: "All", color: "bg-muted" },
          { key: "Triage", label: "Triage", color: "bg-muted-foreground" },
          { key: "In Progress", label: "In Progress", color: "bg-primary" },
          { key: "Blocked", label: "Blocked", color: "bg-destructive" },
          { key: "Ready for Review", label: "Review", color: "bg-warning" },
          { key: "Client Review", label: "Client", color: "bg-accent" },
          { key: "Done", label: "Done", color: "bg-success" },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key as WorkItemStatus | "all")}
            className={`p-2 rounded-lg border transition-all text-left ${
              statusFilter === status.key 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              <span className="text-xs font-medium text-foreground">{status.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-1">
              {statusCounts[status.key as keyof typeof statusCounts]}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, client, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Target</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Jira</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(item)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-muted-foreground">{item.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-foreground">{item.client}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-sm text-foreground line-clamp-1">{item.title}</span>
                      {item.riskReason && (
                        <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-1">
                          {item.riskReason}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getRiskColor(item.risk)}>
                        {item.risk.charAt(0).toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{item.targetDate}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.jiraLinks.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ExternalLink className="h-3 w-3" />
                          {item.jiraLinks.length}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(item);
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
          {filteredWorkItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No work items found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <WorkItemDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        workItem={selectedWorkItem}
        onEdit={handleEditWorkItem}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        canEdit={canEditWorkItems}
      />

      {/* Form Modal */}
      <WorkItemFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        workItem={editingWorkItem}
        onSubmit={handleFormSubmit}
        clients={clients}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Work Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {workItemToDelete?.id}? This action cannot be undone.
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
