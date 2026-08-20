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

  // Initial Load and Focus
  useEffect(() => {
    fetchSeparators();
    focusInput();
  }, []);

  // Keyboard Event Listener for 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "SEPARATOR") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on unmount or re-render
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [step]);

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
      resetMachineState();
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

  const handleCardClick = (separatorId: number) => {
    if (step !== "SEPARATOR" || !scannedOrderId) {
      toast.warning("Por favor, bipe o ID do pedido primeiro!");
      focusInput();
      return;
    }
    processAssignment(scannedOrderId, separatorId);
  };

  const handleCancel = () => {
    toast.info("Operação cancelada.");
    resetMachineState();
  };

  const resetMachineState = () => {
    setStep("ORDER");
    setScannedOrderId(null);
    setInputValue("");
    setIsLoading(false);
    focusInput();
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-6 py-4">
      {/* Dynamic Input Section */}
      <div
        className={`rounded-2xl border transition-all duration-500 ease-in-out flex flex-col justify-center overflow-hidden ${
          step === "ORDER"
            ? "bg-offBlack/80 border-petrolBlue shadow-glow p-12 min-h-[35vh]"
            : "bg-petrolBlue/30 border-bloodRed shadow-glow-red p-6 min-h-[15vh]"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <h2
            className={`font-title transition-all duration-500 ${step === "ORDER" ? "text-5xl" : "text-3xl"}`}
          >
            {step === "ORDER"
              ? "Passo 1: Identificar Pedido"
              : `Passo 2: Atribuir Separador`}
          </h2>

          {/* Cancel Route (Visible only in SEPARATOR step) */}
          {step === "SEPARATOR" && (
            <button
              onClick={handleCancel}
              className="text-sm font-bold text-offWhite/70 hover:text-white border border-offWhite/30 hover:border-white py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              Cancelar (ESC)
            </button>
          )}
        </div>

        {step === "SEPARATOR" && (
          <p className="text-offWhite/80 mb-4 text-lg">
            Pedido escaneado:{" "}
            <span className="font-bold text-xl text-bloodRed bg-offBlack px-3 py-1 rounded">
              #{scannedOrderId}
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              step === "ORDER"
                ? "Bipe o ID do Pedido aqui..."
                : "Bipe o crachá do Separador aqui..."
            }
            className={`w-full bg-offWhite text-offBlack font-bold outline-none focus:ring-4 focus:ring-offWhite/50 transition-all text-center rounded-lg ${
              step === "ORDER" ? "text-4xl py-8 px-8" : "text-1xl py-2 px-4"
            }`}
          />
        </form>
      </div>

      {/* Separators Grid Section */}
      <div
        className={`bg-offBlack/80 rounded-2xl border border-petrolBlue shadow-glow transition-all duration-500 flex-1 flex flex-col ${
          step === "ORDER" ? "p-6 opacity-60" : "p-8 opacity-100"
        }`}
      >
        <h2 className="font-title text-3xl mb-6">Equipe Disponível</h2>

        {separators.length === 0 ? (
          <p className="text-offWhite/50 flex-1 flex items-center justify-center">
            Carregando separadores...
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
            {separators.map((sep) => (
              <button
                key={sep.id}
                onClick={() => handleCardClick(sep.id)}
                disabled={isLoading}
                className={`flex flex-col items-center justify-between bg-offWhite/5 border border-white/10 rounded-xl p-4 transition-all group ${
                  step === "SEPARATOR"
                    ? "hover:bg-petrolBlue/60 hover:border-petrolBlue hover:shadow-glow cursor-pointer transform hover:-translate-y-1"
                    : "cursor-not-allowed opacity-50 grayscale"
                }`}
              >
                <div className="text-center w-full mb-2">
                  <span className="font-bold text-lg block truncate text-offWhite group-hover:text-white">
                    {sep.name}
                  </span>
                  <span className="text-xs text-offWhite/50 mt-1 uppercase tracking-widest">
                    ID: {sep.id}
                  </span>
                </div>

                <div
                  className={`${step === "SEPARATOR" ? "opacity-100" : "opacity-40"}`}
                >
                  <BarcodeGenerator value={sep.id} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
