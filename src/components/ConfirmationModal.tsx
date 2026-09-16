import type { ReactElement } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  statusDescription: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ConfirmationModal({
  isOpen,
  statusDescription,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationModalProps): ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-offBlack border border-bloodRed shadow-glow-red rounded-2xl p-8 max-w-lg w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-bloodRed/20 text-bloodRed flex items-center justify-center rounded-full mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-title text-offWhite mb-4">Atenção!</h3>
        <p className="text-offWhite/80 text-lg mb-8">
          Este pedido encontra-se no status:{" "}
          <strong className="text-white bg-white/10 px-2 py-1 rounded">
            {statusDescription}
          </strong>
          .<br />
          Deseja continuar e reatribuir o separador?
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-4 px-4 border border-offWhite/20 hover:bg-white/10 rounded-xl text-offWhite font-bold transition-all disabled:opacity-50"
          >
            Não, cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-4 px-4 bg-bloodRed hover:bg-red-700 shadow-glow-red rounded-xl text-white font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? "Processando..." : "Sim, continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
