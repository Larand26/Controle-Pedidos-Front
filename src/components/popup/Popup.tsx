import React from "react";

export type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
}: PopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      {/* Overlay: Off Black simulando um backdrop escuro com blur */}
      <div
        className="absolute inset-0 bg-[#1C1C1C]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal: Fundo Off White, Borda Vermelho Sangue */}
      <div
        className={`relative w-full max-w-md transform rounded-xl p-6 shadow-2xl transition-all duration-300 ease-out bg-[#EAEAEA] border-t-4 border-[#BC0F0F] ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-3xl font-bebas text-[#003650] tracking-wide">
              {title}
            </h3>
          )}

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#1C1C1C]/50 hover:bg-[#1C1C1C]/10 hover:text-[#BC0F0F] transition-colors"
            aria-label="Fechar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Conteúdo com a fonte Montserrat */}
        <div className="text-[#1C1C1C] font-montserrat">{children}</div>
      </div>
    </div>
  );
}
