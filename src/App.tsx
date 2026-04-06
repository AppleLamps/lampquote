import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { QuotesProvider } from "@/hooks/useQuotes";

import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = lazy(() => import("./pages/Index"));
const GrokImaginePrompt = lazy(() => import("./pages/GrokImaginePrompt"));
const ImageGen = lazy(() => import("./pages/ImageGen"));
const NotFound = lazy(() => import("./pages/NotFound"));

function EnhancedSidebarTrigger() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      onClick={toggleSidebar}
      className="group relative flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-accent hover:border-accent/50 hover:shadow-glow/30 active:scale-95"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <div className="relative overflow-hidden">
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        )}
      </div>
      <div className="absolute inset-0 rounded-md bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-10" />
    </button>
  );
}

function AppContent() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/30 backdrop-blur-sm px-4 relative">
            <EnhancedSidebarTrigger />
            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-playfair font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight leading-none">
              LampScribe
            </h1>
          </header>
          <div className="flex-1">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse text-muted-foreground">Loading…</div></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/grok-imagine" element={<GrokImaginePrompt />} />
                <Route path="/flux" element={<Navigate to="/grok-imagine" replace />} />
                <Route path="/image" element={<ImageGen />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <TooltipProvider>
    <QuotesProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QuotesProvider>
  </TooltipProvider>
);

export default App;
