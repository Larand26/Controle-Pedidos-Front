import React from "react";

type PopupProps = {
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
  // Se não estiver aberto, não renderiza nada para evitar ocupar espaço
  if (!isOpen) return null;

  return (
    // Container principal: cobre a tela e centraliza. Adiciona transição de opacidade geral.
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      {/* Overlay: Fundo escuro com desfoque. Fecha ao clicar fora. */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Caixa do Modal: Agora com fundo cinza claro e animação de escala/opacidade */}
      <div
        className={`relative w-full max-w-md transform rounded-2xl p-6 shadow-2xl transition-all duration-300 ease-out bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Cabeçalho do Popup */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>

          {/* Botão de Fechar (X) */}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Fechar"
          >
            <svg
              className="h-5 w-5"
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

        {/* Conteúdo (children) - Ajustado para fundo cinza */}
        <div className="text-zinc-700 dark:text-zinc-200">{children}</div>
      </div>
    </div>
  );
}
