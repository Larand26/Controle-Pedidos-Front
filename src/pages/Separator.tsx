import { useState, useRef } from "react";
import { getOrderStatus } from "../apis/order";
import PopupSeparator from "../components/popup/PopupSeparator";
import type { OrderStatusData } from "../utils/separator.logic";

export default function Separator() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [situations, setSituations] = useState<OrderStatusData[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleGetOrderStatus = async () => {
    if (!orderId) return;

    try {
      const response = await getOrderStatus();
      setSituations(response.data || []);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error getting order status:", error);
      alert("Erro ao buscar as situações do pedido.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setOrderId(null);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#EAEAEA] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAEAEA] to-[#d5d5d5] opacity-80 pointer-events-none z-0"></div>

      <div className="z-10 flex flex-col items-center gap-6 p-10 bg-white rounded-xl shadow-xl border-t-4 border-[#003650]">
        <h1 className="text-5xl font-bebas text-[#003650] tracking-wide">
          Área de Separação
        </h1>

        <div className="flex gap-3 w-full">
          <input
            ref={inputRef}
            value={orderId !== null ? orderId : ""}
            onChange={(e) => setOrderId(e.target.value)}
            type="text"
            placeholder="Digite seu Pedido"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGetOrderStatus();
              }
            }}
            className="font-montserrat border-2 border-[#1C1C1C]/20 rounded-md p-4 w-72 shadow-inner focus:outline-none focus:border-[#BC0F0F] focus:ring-1 focus:ring-[#BC0F0F] transition-all text-[#1C1C1C]"
          />
          <button
            onClick={handleGetOrderStatus}
            className="font-montserrat font-bold bg-[#003650] text-[#EAEAEA] px-6 py-4 rounded-md hover:bg-[#002233] transition-colors shadow-md cursor-pointer uppercase tracking-wider"
          >
            Separar
          </button>
        </div>
      </div>

      <PopupSeparator
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        situations={situations}
        orderId={orderId ? parseInt(orderId) : undefined}
      />
    </div>
  );
}
