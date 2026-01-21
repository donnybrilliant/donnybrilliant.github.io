import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import spinnerIcon from "@iconify-icons/fa6-solid/spinner";
import { fetchPackageData } from "@/api";

export const PackageJsonViewer = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  // Prefetched in App.tsx - data is usually already available
  const { data, isLoading, isError } = useQuery({
    queryKey: ["package-json"],
    queryFn: fetchPackageData,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon={spinnerIcon}
            className="w-8 h-8 animate-spin mx-auto mb-4 text-terminal-text"
          />
          <p className="text-terminal-text font-pixel">
            Loading dependencies...
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            (API might take a moment to wake up)
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive font-pixel">
          Failed to load dependencies. API might be sleeping.
        </p>
      </div>
    );
  }

  const repos = data ? Object.keys(data) : [];

  return (
    <div className="h-full bg-terminal-bg p-4 overflow-auto">
      <div className="mb-4">
        <h3 className="font-pixel text-terminal-text mb-2">
          Select Repository:
        </h3>
        <div className="flex flex-wrap gap-2">
          {repos.map((repo) => (
            <motion.button
              key={repo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSelectedRepo(selectedRepo === repo ? null : repo)
              }
              className={`px-3 py-1 font-pixel text-xs border transition-colors ${
                selectedRepo === repo
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-window-header text-window-header-foreground border-window-border hover:bg-primary/20"
              }`}
            >
              {repo}
            </motion.button>
          ))}
        </div>
      </div>

      {selectedRepo && data?.[selectedRepo] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <pre className="text-terminal-text text-sm overflow-auto">
            <code>{JSON.stringify(data[selectedRepo], null, 2)}</code>
          </pre>
        </motion.div>
      )}

      {!selectedRepo && (
        <div className="text-center py-8">
          <p className="text-muted-foreground font-pixel text-sm">
            Click a repository to view its dependencies
          </p>
        </div>
      )}
    </div>
  );
};
