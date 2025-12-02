import { useState, useEffect } from "react";

// returns the current hash location (minus the # symbol)
// and a function to update it
export const useHashLocation = () => {
  const getHashPath = () => {
    // Get the hash, remove the leading #
    const hash = window.location.hash.replace(/^#/, "");
    // If empty, default to "/"
    if (!hash) return "/";
    // Ensure it starts with /
    return hash.startsWith("/") ? hash : "/" + hash;
  };

  const [loc, setLoc] = useState(getHashPath());

  useEffect(() => {
    const handler = () => setLoc(getHashPath());

    // Subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [loc, navigate] as [string, (to: string) => void];
};
