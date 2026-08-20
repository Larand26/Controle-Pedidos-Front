import { useState, useRef, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { changeOrderStatus } from "../apis/orders"; // Import from your API file

const FINISHED_STATUS_ID = 14;

export default function FinishOrder() {
  const [orderId, setOrderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input for the barcode scanner
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    const parsedId = parseInt(orderId, 10);

    const response = await changeOrderStatus(parsedId, FINISHED_STATUS_ID); //[cite: 1]

    if (response.success) {
      //[cite: 1]
      toast.success(`Pedido ${parsedId} finalizado com sucesso!`);
    } else {
      toast.error(response.message || `Erro ao finalizar pedido ${parsedId}.`); //[cite: 1]
    }

    setOrderId("");
    setIsLoading(false);

    // Force re-focus after submission
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
      <div className="bg-offBlack/80 p-10 rounded-2xl border border-petrolBlue shadow-glow w-full text-center">
        <h2 className="font-title text-5xl mb-2">Finalizar Pedido</h2>
        <p className="text-offWhite/70 mb-8">
          Bipe o código de barras do pedido para concluir.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            ref={inputRef}
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={isLoading}
            placeholder="ID do Pedido"
            className="bg-offWhite text-offBlack font-bold text-3xl text-center py-4 px-6 rounded-lg outline-none focus:ring-4 focus:ring-bloodRed transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !orderId}
            className="bg-bloodRed hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg shadow-glow-red transition-all text-xl uppercase tracking-wide"
          >
            {isLoading ? "Processando..." : "Confirmar Leitura"}
          </button>
        </form>
      </div>
    </div>
  );
}
