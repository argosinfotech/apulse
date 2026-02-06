import { useAuth } from "@/contexts/AuthContext";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { DCOLDashboard } from "@/components/dashboard/DCOLDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "dcol") {
    return <DCOLDashboard />;
  }

  return <FounderDashboard />;
}
