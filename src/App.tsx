import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DCOLProvider } from "@/contexts/DCOLContext";
import { CommunicationsProvider } from "@/contexts/CommunicationsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "./pages/Login";
import LoginFounder from "./pages/LoginFounder";
import LoginDCOL from "./pages/LoginDCOL";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import IntakeRequests from "./pages/IntakeRequests";
import WorkItems from "./pages/WorkItems";
import Risks from "./pages/Risks";
import Escalations from "./pages/Escalations";
import Communications from "./pages/Communications";
import ClientThread from "./pages/ClientThread";
import Notifications from "./pages/Notifications";

import WeeklySnapshot from "./pages/WeeklySnapshot";
import SnapshotHistory from "./pages/SnapshotHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// App component with all providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <DCOLProvider>
          <CommunicationsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public client thread view - no auth required */}
                  <Route path="/c/:token" element={<ClientThread />} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/login/founder" element={<LoginFounder />} />
                  <Route path="/login/dcol" element={<LoginDCOL />} />
                  <Route
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/:clientId" element={<ClientDetail />} />
                    <Route path="/intake" element={<IntakeRequests />} />
                    <Route path="/work-items" element={<WorkItems />} />
                    <Route path="/risks" element={<Risks />} />
                    <Route path="/escalations" element={<Escalations />} />
                    <Route path="/communications" element={<Communications />} />
                    <Route path="/notifications" element={<Notifications />} />
                    
                    <Route path="/snapshot" element={<WeeklySnapshot />} />
                    <Route path="/snapshot-history" element={<SnapshotHistory />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CommunicationsProvider>
        </DCOLProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
