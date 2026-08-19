import { useState, useRef } from "react"; // 1. Importe o useRef
import PopupFinish from "../components/popup/PopupFinish";

export default function Finish() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
          type="text"
          placeholder="Digite seu Pedido"
          autoFocus
          className="border border-gray-300 rounded-lg p-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          Finalizar
        </button>
      </div>
      <PopupFinish
        isOpen={isPopupOpen}
        onClose={handleClosePopup} // 5. Passe a nova função no onClose
        // Coloquei 900000ms de exemplo, pois na lógica anterior fizemos a conversão de ms para minutos (900000ms = 15 minutos)
        data={{ order: 123, time: 900000 }}
      />
    </div>
  );
}
