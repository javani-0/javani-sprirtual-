import { useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    setStage("exit");
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setStage("enter");
    }, 200);
    return () => clearTimeout(timeout);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        transition: "opacity 300ms ease",
        opacity: stage === "enter" ? 1 : 0,
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
