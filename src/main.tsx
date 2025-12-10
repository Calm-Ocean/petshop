import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider

const queryClient = new QueryClient(); // Create a new QueryClient

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}> {/* Wrap App with QueryClientProvider */}
    <App />
  </QueryClientProvider>
);