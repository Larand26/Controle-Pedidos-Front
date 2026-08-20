import { useEffect } from "react";
import Popup from "./Popup";
import { calculateMinutes } from "../../utils/finish.logic";

export type OrderData = {
  order: string | number;
  time: number;
  newStatus?: string;
};

export type PopupFinishProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: OrderData | null;
};

export default function PopupFinish({
  isOpen,
  onClose,
  data,
}: PopupFinishProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Resumo do Pedido">
      {data ? (
        <div className="flex flex-col items-center text-center py-2">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#003650]/10 shadow-inner">
            <svg
              className="h-8 w-8 text-[#003650]"
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

          <h4 className="text-4xl font-bebas text-[#1C1C1C] tracking-wider uppercase">
            Finalizado!
          </h4>

          <p className="mt-2 text-lg text-[#1C1C1C]/70 font-montserrat">
            Pedido{" "}
            <span className="font-bold text-[#BC0F0F]">#{data.order}</span>
          </p>

          <div className="mt-6 rounded-lg bg-white shadow-sm border border-[#1C1C1C]/10 px-6 py-3 w-full">
            <p className="text-md text-[#1C1C1C]/80 font-montserrat">
              Tempo de Separação:{" "}
              <span className="font-bold text-[#003650]">
                {calculateMinutes(data.time)} min
              </span>
            </p>
          </div>

          <p className="mt-6 text-sm text-[#1C1C1C]/50 font-montserrat italic">
            Fechando automaticamente em alguns segundos...
          </p>
        </div>
      ) : (
        <p className="text-center text-[#1C1C1C]/60 font-montserrat">
          Carregando dados do pedido...
        </p>
      )}

      <div className="mt-6 w-full">
        <button
          onClick={onClose}
          className="w-full rounded-md bg-[#003650] px-4 py-3 font-montserrat font-bold text-[#EAEAEA] transition-all hover:bg-[#002233] hover:shadow-lg focus:outline-none cursor-pointer"
        >
          Fechar agora
        </button>
      </div>
    </Popup>
  );
}
