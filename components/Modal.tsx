import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface ModalProps {
  title: string;
  storageKey: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  storageKey,
  open,
  onClose,
  children,
}) => {
  const [dontShow, setDontShow] = useState(false);
  const dontShowKey = storageKey + "-dontShow";
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const dontShowStored = localStorage.getItem(dontShowKey);
    setDontShow(dontShowStored === "true");
    if (dontShowStored === "true" && isInitialLoad.current) {
      onClose();
    }
    isInitialLoad.current = false;
  }, [dontShowKey, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontShow(checked);
    localStorage.setItem(dontShowKey, checked.toString());
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded shadow-xl max-w-md w-full p-6 mx-2"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <button
          className="absolute top-2 right-2 rounded-full p-2 hover:bg-gray-100 focus:outline-none"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="text-lg font-semibold text-center">{title}</div>
        <div className="flex flex-col gap-6 py-4 text-base">{children}</div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={handleCheckbox}
            />
            {"Don't show this again"}
          </label>
          <button
            className="w-full rounded p-2 bg-black text-white"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
