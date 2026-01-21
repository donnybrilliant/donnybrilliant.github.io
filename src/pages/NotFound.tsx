import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import houseIcon from "@iconify-icons/fa6-solid/house";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-desktop flex flex-col items-center justify-center gap-6 p-6">
      <motion.h1 
        className="font-pixel text-6xl md:text-8xl text-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        404
      </motion.h1>
      <motion.p 
        className="font-primary text-xl text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page not found
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-pixel text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          <Icon icon={houseIcon} className="w-4 h-4" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
