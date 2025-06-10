"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalComponent({
  isOpen,
  onClose,
  children,
}: ModalComponentProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative">
        {children}
      </div>
    </div>,
    document.body
  );
}
