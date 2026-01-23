import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "./components/PageTransition";
import { ThemeProvider } from "./components/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import MembersPage from "./pages/admin/MembersPage";
import ActivitiesPage from "./pages/admin/ActivitiesPage";
import RegistrationsPage from "./pages/admin/RegistrationsPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="registrations" element={<RegistrationsPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="sporthub-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
