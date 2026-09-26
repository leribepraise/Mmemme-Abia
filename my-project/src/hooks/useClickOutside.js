import { useEffect } from "react";

// Calls `handler` when the user clicks outside `ref` (used by dropdown menus and popovers)
const useClickOutside = (ref, handler, active = true) => {
  useEffect(() => {
    if (!active) return undefined;
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler, active]);
};

export default useClickOutside;
