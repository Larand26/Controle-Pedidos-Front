import { useState, useRef, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { changeOrderStatus, getOrderStatus } from "../apis/orders"; // Import from your API file

// Interface baseada no retorno genérico da API
interface SeparatorStatus {
  id: number;
  name: string;
}

export default function AssignSeparator() {
  const [orderId, setOrderId] = useState<string>("");
  const [separators, setSeparators] = useState<SeparatorStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const orderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSeparators();
    orderInputRef.current?.focus();
  }, []);

  const fetchSeparators = async () => {
    const response = await getOrderStatus(); //[cite: 1]

    if (response.success && response.data) {
      //[cite: 1]
      // Filtra e limpa a string "EM SEPARACAO | "
      const filtered = response.data
        .filter((status: any) => status.description?.includes("EM SEPARACAO |"))
        .map((status: any) => ({
          id: status.id,
          name: status.description.replace("EM SEPARACAO |", "").trim(),
        }));
      setSeparators(filtered);
    } else {
      toast.error(response.message || "Falha ao carregar separadores."); //[cite: 1]
    }
  };

  const handleAssign = async (separatorId: number) => {
    if (!orderId.trim()) {
      toast.error("Por favor, bipe o ID do pedido primeiro.");
      orderInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    const parsedOrderId = parseInt(orderId, 10);

    const response = await changeOrderStatus(parsedOrderId, separatorId); //[cite: 1]

    if (response.success) {
      //[cite: 1]
      toast.success(`Separador atribuído ao pedido ${parsedOrderId}!`);
      setOrderId("");
    } else {
      toast.error(response.message || "Erro ao atribuir separador."); //[cite: 1]
    }

    setIsLoading(false);
    setTimeout(() => {
      orderInputRef.current?.focus();
    }, 100);
  };

  const handleOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Apenas impede o reload, o fluxo real acontece ao clicar/bipar o separador
    if (orderId) {
      toast.info("Pedido bipado. Agora selecione ou bipe o separador.");
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full gap-8 py-8">
      {/* Top Section: Order Input */}
      <div className="bg-offBlack/80 p-8 rounded-2xl border border-petrolBlue shadow-glow">
        <h2 className="font-title text-4xl mb-2">1. Identificar Pedido</h2>
        <form onSubmit={handleOrderSubmit}>
          <input
            ref={orderInputRef}
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Bipe o ID do Pedido aqui..."
            className="w-full bg-offWhite text-offBlack font-bold text-2xl py-4 px-6 rounded-lg outline-none focus:ring-4 focus:ring-petrolBlue transition-all"
          />
        </form>
      </div>

      {/* Bottom Section: Separators Grid */}
      <div className="bg-offBlack/80 p-8 rounded-2xl border border-petrolBlue shadow-glow">
        <h2 className="font-title text-4xl mb-6">2. Selecionar Separador</h2>
        {separators.length === 0 ? (
          <p className="text-offWhite/50">Carregando separadores...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {separators.map((sep) => (
              <button
                key={sep.id}
                onClick={() => handleAssign(sep.id)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center bg-offWhite/5 border border-white/10 hover:bg-petrolBlue/40 hover:border-petrolBlue hover:shadow-glow rounded-xl p-6 transition-all group"
              >
                {/* Ícone simulando código de barras/ID */}
                <div className="mb-4 text-bloodRed group-hover:text-offWhite transition-colors">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 6h2v12H4zm4 0h1v12H8zm3 0h2v12h-2zm4 0h1v12h-1zm3 0h2v12h-2z" />
                  </svg>
                </div>
                <span className="font-bold text-lg mb-1">{sep.name}</span>
                <span className="text-sm text-offWhite/50 bg-offBlack px-2 py-1 rounded">
                  ID: {sep.id}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
