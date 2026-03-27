import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Practice from "./pages/Practice";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export type Page =
  | "dashboard"
  | "practice"
  | "analytics"
  | "library"
  | "settings";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [userName, setUserName] = useState("Ayush Kumar Nitin");
  const [activeSessionId, setActiveSessionId] = useState<bigint | null>(null);

  const handleStartSession = (sessionId: bigint) => {
    setActiveSessionId(sessionId);
    setCurrentPage("practice");
  };

  const handleSessionComplete = () => {
    setActiveSessionId(null);
    setCurrentPage("dashboard");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userName={userName} />
        <main className="flex-1 overflow-y-auto p-6">
          {currentPage === "dashboard" && (
            <Dashboard
              userName={userName}
              onStartSession={handleStartSession}
              onResume={(id) => {
                setActiveSessionId(id);
                setCurrentPage("practice");
              }}
            />
          )}
          {currentPage === "practice" && (
            <Practice
              activeSessionId={activeSessionId}
              onSessionComplete={handleSessionComplete}
              onStartNew={handleStartSession}
            />
          )}
          {currentPage === "analytics" && <Analytics />}
          {currentPage === "library" && (
            <Library
              onPracticeQuestion={(id) => {
                setActiveSessionId(id);
                setCurrentPage("practice");
              }}
            />
          )}
          {currentPage === "settings" && (
            <Settings userName={userName} onUserNameChange={setUserName} />
          )}
        </main>
        <footer className="px-6 py-3 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PrepAI. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}
