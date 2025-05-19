import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Index from "./pages/Index";
import MapView from "./pages/MapView";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import Authentication from "./pages/Authentication";
import AuthGuard from "@/components/AuthGuard";

// ✅ Import the consent banner component
import ConsentBanner from "@/components/ConsentBanner";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/map" element={<MapView />} />
      <Route
        path="/admin"
        element={
          <AuthGuard requiredRole="admin">
            <AdminPage />
          </AuthGuard>
        }
      />
      <Route path="/auth" element={<Authentication />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    future: {
      v7_normalizeFormMethod: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConsentBanner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
