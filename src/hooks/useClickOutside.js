import { useEffect } from "react";

const useClickOutside = (ref, handler, extraRefs = []) => {
  useEffect(() => {
    const listener = (event) => {
      if (ref.current?.contains(event.target) || extraRefs.some(r => r.current?.contains(event.target))) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, ...extraRefs]);
};

export default useClickOutside;
