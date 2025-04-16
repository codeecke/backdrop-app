"use client";

import { useState, useEffect } from "react";

/**
 * A hook that returns true if the current device is a mobile device.
 * This is determined by checking if the window width is less than 768px.
 *
 * @returns {boolean} True if the current device is a mobile device
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window === "undefined") return;

    // Function to check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}
