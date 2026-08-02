"use client";

import { createContext, useCallback, useContext, useState } from "react";

import Toast from "@/shared/ui/Toast";

const ToastContext = createContext(null);

const INITIAL_TOAST = {
  show: false,
  type: "success",
  title: "",
  message: "",
  duration: 3000,
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(INITIAL_TOAST);

  const showToast = useCallback(
    ({ type = "success", title = "", message = "", duration = 3000 } = {}) => {
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

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
