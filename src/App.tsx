import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { WindowProvider } from "@/context/WindowContext.tsx";
import { ThemeProvider } from "@/context/ThemeContext.tsx";
import { fetchGitHubRepos, fetchPackageData } from "@/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000, // 1 hour default
      gcTime: 2 * 60 * 60 * 1000, // Keep in cache for 2 hours
      retry: 2,
    },
  },
});

// Prefetch data on app load - runs immediately
queryClient.prefetchQuery({
  queryKey: ["github-repos"],
  queryFn: fetchGitHubRepos,
});

queryClient.prefetchQuery({
  queryKey: ["package-json"],
  queryFn: fetchPackageData,
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WindowProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WindowProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
