"use client";

import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
    duration: 3000,
  });

  const showToast = useCallback(
    ({ type = "success", title = "", message = "", duration = 3000 }) => {
      setToast({
        show: true,
        type,
        title,
        message,
        duration,
      });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
