import { getOrderStatus } from "../apis/order";
import { useState, useRef } from "react"; // 1. Importe o useRef

export default function Separator() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [data, setData] = useState<{
    order: number;
    time: number;
    newStatus: string;
  } | null>(null);

  const handleGetOrderStatus = async () => {
    try {
      const response = await getOrderStatus();
      console.log("Response from getOrderStatus:", response);
    } catch (error) {
      console.error("Error getting order status:", error);
    }
  };
  // 2. Crie a referência com a tipagem de um elemento de Input do HTML
  const inputRef = useRef<HTMLInputElement>(null);

  // 3. Crie uma função dedicada para fechar o popup e restaurar o foco
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Fecha o popup

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex gap-2">
        <input
          ref={inputRef} // 4. Anexe a referência ao seu input
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
          className="border border-gray-300 rounded-lg p-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          onClick={() => {
            handleGetOrderStatus();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          Separar
        </button>
      </div>
    </div>
  );
}
