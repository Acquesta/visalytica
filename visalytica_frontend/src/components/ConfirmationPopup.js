"use client";
import { useState } from "react";
import ReactDOM from "react-dom";

export default function ConfirmationPopup({
  children,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700 text-white",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white dark:bg-noturno_medio p-6 rounded-xl shadow-lg w-full mx-4 max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-2 rounded-lg transition ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}