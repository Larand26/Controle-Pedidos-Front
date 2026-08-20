import { useState, useRef } from "react";
import PopupFinish, { type OrderData } from "../components/popup/PopupFinish";
import { changeOrderStatus } from "../apis/order";

export default function Finish() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [data, setData] = useState<OrderData | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeOrderStatus = async (currentOrderId: string) => {
    try {
      const response = await changeOrderStatus(Number(currentOrderId), 14);
      if (response.success) {
        setOrderId(null);
        setData(response.data ?? null);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#EAEAEA] relative overflow-hidden">
      {/* Background Effect: Simulação de granulação com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAEAEA] to-[#d5d5d5] opacity-80 pointer-events-none z-0"></div>

      <div className="z-10 flex flex-col items-center gap-6 p-10 bg-white rounded-xl shadow-xl border-t-4 border-[#003650]">
        <h1 className="text-5xl font-bebas text-[#003650] tracking-wide">
          Finalizar Pedido
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
                handleChangeOrderStatus(orderId !== null ? orderId : "0");
              }
            }}
            className="font-montserrat border-2 border-[#1C1C1C]/20 rounded-md p-4 w-72 shadow-inner focus:outline-none focus:border-[#BC0F0F] focus:ring-1 focus:ring-[#BC0F0F] transition-all text-[#1C1C1C]"
          />
          <button
            onClick={() =>
              handleChangeOrderStatus(orderId !== null ? orderId : "0")
            }
            className="font-montserrat font-bold bg-[#BC0F0F] text-[#EAEAEA] px-6 py-4 rounded-md hover:bg-[#8A0B0B] transition-colors shadow-md cursor-pointer uppercase tracking-wider"
          >
            Finalizar
          </button>
        </div>
      </div>

      <PopupFinish
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        data={data}
      />
    </div>
  );
}
