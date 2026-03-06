import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import spinnerIcon from "@iconify-icons/fa6-solid/spinner";
import { fetchPackageData } from "@/api";

type Section = "dependencies" | "devDependencies";

export const PackageJsonViewer = () => {
  const [section, setSection] = useState<Section>("dependencies");

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

  const deps = data?.dependencies ?? {};
  const devDeps = data?.devDependencies ?? {};
  const current = section === "dependencies" ? deps : devDeps;
  const isEmpty = Object.keys(current).length === 0;

  return (
    <div className="h-full bg-terminal-bg p-4 overflow-auto">
      <div className="mb-4">
        <h3 className="font-pixel text-terminal-text mb-2">
          Packages from my projects
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["dependencies", "devDependencies"] as const).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSection(tab)}
              className={`px-3 py-1 font-pixel text-xs border transition-colors ${
                section === tab
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-window-header text-window-header-foreground border-window-border hover:bg-primary/20"
              }`}
            >
              {tab === "dependencies" ? "Production" : "Development"}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        {isEmpty ? (
          <p className="text-muted-foreground font-pixel text-sm">
            No packages in this list.
          </p>
        ) : (
          <pre className="text-terminal-text text-sm overflow-auto">
            <code>{JSON.stringify(current, null, 2)}</code>
          </pre>
        )}
      </motion.div>
    </div>
  );
};
