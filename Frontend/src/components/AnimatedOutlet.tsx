import { useOutlet } from "react-router-dom";

export function AnimatedOutlet() {
  const outlet = useOutlet();
  return <>{outlet}</>;
}
