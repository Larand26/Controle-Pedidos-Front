import { useState, useRef, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { changeOrderStatus, getOrderStatus } from "../apis/orders"; //[cite: 1]
import BarcodeGenerator from "../components/BarcodeGenerator";

interface SeparatorStatus {
  id: number;
  name: string;
}

type ScanStep = "ORDER" | "SEPARATOR";

export default function AssignSeparator() {
  // State Machine
  const [step, setStep] = useState<ScanStep>("ORDER");
  const [scannedOrderId, setScannedOrderId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Data States
  const [separators, setSeparators] = useState<SeparatorStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSeparators();
    focusInput();
  }, []);

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const fetchSeparators = async () => {
    try {
      const response = await getOrderStatus(); //[cite: 1]
      if (response.success && response.data) {
        //[cite: 1]
        const filtered = response.data
          .filter((status: any) =>
            status.description?.includes("EM SEPARACAO |"),
          )
          .map((status: any) => ({
            id: status.id,
            name: status.description.replace("EM SEPARACAO |", "").trim(),
          }));
        setSeparators(filtered);
      } else {
        toast.error(response.message || "Falha ao carregar separadores."); //[cite: 1]
      }
    } catch (error) {
      toast.error("Erro de conexão ao carregar separadores.");
    }
  };

  const processAssignment = async (
    orderIdToAssign: number,
    separatorId: number,
  ) => {
    setIsLoading(true);

    try {
      const response = await changeOrderStatus(orderIdToAssign, separatorId); //[cite: 1]

      if (response.success) {
        //[cite: 1]
        toast.success(`Pedido ${orderIdToAssign} atribuído com sucesso!`);
      } else {
        toast.error(
          response.message || "Erro ao atribuir separador. Tente novamente.",
        ); //[cite: 1]
      }
    } catch (error) {
      toast.error(
        "Erro fatal ao processar. Verifique a conexão e tente novamente.",
      );
    } finally {
      // Step D: Reset State Machine and wait for the next order
      setStep("ORDER");
      setScannedOrderId(null);
      setInputValue("");
      setIsLoading(false);
      focusInput();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const parsedValue = parseInt(inputValue, 10);

    // Step A to B: Order ID scanned
    if (step === "ORDER") {
      setScannedOrderId(parsedValue);
      setStep("SEPARATOR");
      setInputValue("");
      toast.info("Pedido registrado. Agora bipe o crachá do Separador.");
      focusInput();
      return;
    }

    // Step C: Separator ID scanned
    if (step === "SEPARATOR" && scannedOrderId) {
      processAssignment(scannedOrderId, parsedValue);
    }
  };

  // Allow clicking the card as an alternative to scanning the badge
  const handleCardClick = (separatorId: number) => {
    if (step !== "SEPARATOR" || !scannedOrderId) {
      toast.warning("Por favor, bipe o ID do pedido primeiro!");
      focusInput();
      return;
    }
    processAssignment(scannedOrderId, separatorId);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full gap-8 py-8">
      {/* Dynamic Input Section based on State Machine */}
      <div
        className={`p-8 rounded-2xl border shadow-glow transition-all duration-300 ${
          step === "ORDER"
            ? "bg-offBlack/80 border-petrolBlue"
            : "bg-petrolBlue/30 border-bloodRed shadow-glow-red"
        }`}
      >
        <h2 className="font-title text-4xl mb-4">
          {step === "ORDER"
            ? "Passo 1: Identificar Pedido"
            : `Passo 2: Atribuir Separador (Pedido #${scannedOrderId})`}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              step === "ORDER"
                ? "Bipe o ID do Pedido..."
                : "Bipe o crachá do Separador..."
            }
            className="w-full bg-offWhite text-offBlack font-bold text-3xl py-6 px-6 rounded-lg outline-none focus:ring-4 focus:ring-offWhite/50 transition-all text-center"
          />
        </form>
      </div>

      {/* Separators Grid */}
      <div className="bg-offBlack/80 p-8 rounded-2xl border border-petrolBlue shadow-glow opacity-90">
        <h2 className="font-title text-3xl mb-6">Equipe Disponível</h2>

        {separators.length === 0 ? (
          <p className="text-offWhite/50">Carregando separadores...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {separators.map((sep) => (
              <button
                key={sep.id}
                onClick={() => handleCardClick(sep.id)}
                disabled={isLoading}
                className={`flex flex-col items-center justify-between bg-offWhite/5 border border-white/10 rounded-xl p-4 transition-all group ${
                  step === "SEPARATOR"
                    ? "hover:bg-petrolBlue/60 hover:border-petrolBlue hover:shadow-glow cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className="text-center w-full">
                  <span className="font-bold text-xl block truncate">
                    {sep.name}
                  </span>
                  <span className="text-xs text-offWhite/50 mt-1 uppercase tracking-widest">
                    ID: {sep.id}
                  </span>
                </div>

                {/* Barcode Render */}
                <BarcodeGenerator value={sep.id} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
