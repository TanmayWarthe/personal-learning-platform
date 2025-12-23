import React from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const toastColors = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${toastColors[type]}`}
      role="alert"
      onClick={onClose}
      style={{ cursor: onClose ? "pointer" : undefined }}
    >
      {message}
      {onClose && (
        <button
          className="ml-4 text-white text-lg font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
}
