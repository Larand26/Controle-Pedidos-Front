import { useState } from "react";
import PopupFinish from "../components/popup/PopupFinish";

export default function Finish() {
  // Estado para controlar se o popup está aberto ou fechado
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Container do Input e Botão */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite seu Pedido"
          className="border border-gray-300 rounded-lg p-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Finalizar
        </button>
      </div>
      <PopupFinish
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        data={{ order: 123, time: 15 }} // Exemplo de dados do pedido
      />
    </div>
  );
}
