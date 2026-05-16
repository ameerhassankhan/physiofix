import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const variantStyles = {
  success: "bg-emerald-600 text-white border-emerald-700",
  danger: "bg-rose-600 text-white border-rose-700",
  info: "bg-slate-900 text-white border-slate-800",
};

const getIcon = (variant) => {
  const iconProps = { fontSize: "small", className: "w-5 h-5" };
  switch (variant) {
    case "success":
      return <CheckCircleIcon {...iconProps} />;
    case "danger":
      return <ErrorIcon {...iconProps} />;
    case "info":
      return <InfoIcon {...iconProps} />;
    default:
      return <InfoIcon {...iconProps} />;
  }
};

export default function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div
        className={`w-full max-w-xl overflow-hidden rounded-3xl border px-5 py-4 shadow-lg shadow-slate-900/10 ${
          variantStyles[toast.variant] || variantStyles.info
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex-shrink-0">{getIcon(toast.variant)}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              {toast.title ||
                (toast.variant === "danger"
                  ? "Error"
                  : toast.variant === "success"
                    ? "Success"
                    : "Info")}
            </p>
            <p className="mt-2 text-sm leading-6">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-sm text-white transition hover:bg-white/20"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
