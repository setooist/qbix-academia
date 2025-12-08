"use client";

import { useState, useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

interface CTAModalProps {
  title: string;
  src: string;
  buttonStyle?: string;
  children?: ReactNode;
}

export default function CalendorModal({ title, src, buttonStyle = "", children }: CTAModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999999] p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-card text-card-foreground w-full h-[85vh] md:h-[90vh] max-w-5xl rounded-2xl shadow-2xl relative flex flex-col border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 bg-muted hover:bg-secondary text-foreground rounded-lg p-2 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto rounded-xl">
          <iframe src={src} className="w-full h-full border-0" title={title} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          buttonStyle ||
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
        }`}
      >
        {children ? children : <span>{title}</span>}
      </button>

      {open && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
}
