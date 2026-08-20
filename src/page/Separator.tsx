import { useState, useRef } from "react";
import { getOrderStatus } from "../apis/order";
import PopupSeparator from "../components/popup/PopupSeparator"; // <-- 1. Importe o componente que criamos

// Tipagem para facilitar o TypeScript
type OrderData = {
  ID_SITUACAO: number;
  SIT_DESCRICAO: string;
};

export default function Separator() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // 2. O estado agora guarda um array de situações para o Popup processar
  const [situacoes, setSituacoes] = useState<OrderData[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleGetOrderStatus = async () => {
    // Evita chamadas vazias se o usuário apertar Enter sem digitar nada
    if (!orderId) return;

    try {
      const response = await getOrderStatus(); // Considere passar o orderId aqui: getOrderStatus(orderId)
      console.log("Response from getOrderStatus:", response);

      // 3. Salva os dados recebidos da API (ajuste "response.data" conforme a estrutura real da sua API)
      // Assumindo que a resposta seja diretamente o array ou contenha os dados nele
      setSituacoes(response.data || []);

      // 4. Abre o Popup
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error getting order status:", error);
      alert("Erro ao buscar as situações do pedido."); // Feedback simples para o usuário
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setOrderId(null); // Limpa o input ao fechar o popup
    // Opcional: focar novamente no input ao fechar o popup para agilizar o próximo pedido
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 relative">
      <div className="flex gap-2">
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
          className="border border-gray-300 rounded-lg p-3 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          onClick={handleGetOrderStatus}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          Separar
        </button>
      </div>

      {/* 5. Renderização condicional ou controlada do Popup */}
      <PopupSeparator
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        situacoes={situacoes}
        orderId={orderId ? parseInt(orderId) : undefined} // Passa o orderId como número, se disponível
      />
    </div>
  );
}
