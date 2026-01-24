import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import MembersPage from "./pages/admin/MembersPage";
import AddMemberPage from "./pages/admin/AddMemberPage";
import EditMemberPage from "./pages/admin/EditMemberPage";
import ActivitiesPage from "./pages/admin/ActivitiesPage";
import AddActivityPage from "./pages/admin/AddActivityPage";
import EditActivityPage from "./pages/admin/EditActivityPage";
import RegistrationsPage from "./pages/admin/RegistrationsPage";
import AddEnrollmentPage from "./pages/admin/AddEnrollmentPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/add" element={<AddMemberPage />} />
        <Route path="members/edit/:id" element={<EditMemberPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/add" element={<AddActivityPage />} />
        <Route path="activities/edit/:id" element={<EditActivityPage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="registrations/add" element={<AddEnrollmentPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="sporthub-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
