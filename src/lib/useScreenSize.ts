import { useEffect, useState } from "react";

export function useScreenSize(threshold: number = 430) {
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  const checkScreenSize = () => {
    setIsScreenSmall(window.innerWidth <= threshold);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  return isScreenSmall;
}
