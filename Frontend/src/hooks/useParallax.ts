import { useEffect, useRef, useState } from "react";

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

export function useParallax({ speed = 0.5, direction = "up" }: UseParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = scrolled * speed * (direction === "up" ? -1 : 1);
      setOffset(rate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return { ref, offset };
}
