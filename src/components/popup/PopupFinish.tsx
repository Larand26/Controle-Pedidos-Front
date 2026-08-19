import { useEffect } from "react"; // <-- Importe o useEffect
import Popup from "./Popup";

type OrderData = {
  order: string | number;
  time: number; // em ms
};

type PopupFinishProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: OrderData;
};

export default function PopupFinish({
  isOpen,
  onClose,
  data,
}: PopupFinishProps) {
  // Efeito que controla o fechamento automático
  useEffect(() => {
    // Só inicia o timer se o popup estiver aberto
    if (isOpen) {
      // Define o tempo em milissegundos (5000 = 5 segundos)
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Função de limpeza: cancela o timer se o usuário fechar manualmente
      // ou se o componente for desmontado antes do tempo acabar
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getMinutes = (ms?: number) => {
    if (!ms) return 0;
    return Math.round(ms / 60000);
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Resumo do Pedido">
      {data ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Finalizado!
          </h4>

          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Pedido{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              #{data.order}
            </span>
          </p>

          <div className="mt-4 rounded-lg bg-zinc-200/50 dark:bg-zinc-700/50 px-4 py-2 w-full">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Tempo de Separação:{" "}
              <span className="font-bold">{getMinutes(data.time)} min</span>
            </p>
          </div>

          {/* Opcional: Feedback visual de que vai fechar sozinho */}
          <p className="mt-6 text-xs text-zinc-400">
            Fechando automaticamente em alguns segundos...
          </p>
        </div>
      ) : (
        <p className="text-center text-zinc-500">
          Carregando dados do pedido...
        </p>
      )}

      <div className="mt-4 w-full">
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 cursor-pointer"
        >
          Fechar agora
        </button>
      </div>
    </Popup>
  );
}
