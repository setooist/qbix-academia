"use client";

import { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";

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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999999]"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white w-[95%] h-[90%] max-w-4xl rounded-2xl shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition z-50"
        >
          ×
        </button>

        <div className="flex-1 overflow-y-auto rounded-xl">
          <iframe
            src={src}
            className="w-full h-full rounded-xl border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`bg-linear-to-r from-[#5D491B] to-[#927949] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${buttonStyle}`}
      >
        {children ? children : <span>{title}</span>}
      </button>

      {open && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
}
