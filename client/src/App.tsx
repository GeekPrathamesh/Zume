import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/useAuth";

import { LoginScreen, SignupScreen } from "@/components/auth/LoginScreen";
import { ProfileEditScreen } from "@/components/auth/ProfileEditScreen";
import { ChatLayout } from "@/components/chat/ChatLayout";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-yellow-400/30 border-t-yellow-400 animate-spin" />
        <p className="mt-4 text-sm text-foreground-muted tracking-wide">
          Loading your workspace…
        </p>
      </div>
    );
  }

  const isAuthenticated = !!authUser;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />


          <Routes>
            {/* Public Route */}
            <Route
              path="/login/*"
              element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/" />}
            />

            <Route
              path="/signup/*"
              element={
                !isAuthenticated ? <SignupScreen /> : <Navigate to="/" />
              }
            />

            <Route
              path="/"
              element={
                isAuthenticated ? <ChatLayout /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <ProfileEditScreen />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
