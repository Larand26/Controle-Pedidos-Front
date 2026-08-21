import { useState, useRef, useEffect, type FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { changeOrderStatus, getOrderStatus } from "../apis/orders"; //[cite: 1, 2]
import BarcodeGenerator from "../components/BarcodeGenerator"; //[cite: 2]
import type { LayoutContextType } from "../components/Layout";

interface SeparatorStatus {
  id: number;
  name: string;
}

type ScanStep = "ORDER" | "SEPARATOR"; //[cite: 2]

export default function AssignSeparator() {
  const { setShowHeader } = useOutletContext<LayoutContextType>();

  const [step, setStep] = useState<ScanStep>("ORDER"); //[cite: 2]
  const [scannedOrderId, setScannedOrderId] = useState<number | null>(null); //[cite: 2]
  const [inputValue, setInputValue] = useState<string>(""); //[cite: 2]

  // Novo estado para controlar a exibição dos códigos de barra
  const [showBarcodes, setShowBarcodes] = useState<boolean>(false);

  const [separators, setSeparators] = useState<SeparatorStatus[]>([]); //[cite: 2]
  const [isLoading, setIsLoading] = useState<boolean>(false); //[cite: 2]

  const inputRef = useRef<HTMLInputElement>(null); //[cite: 2]

  useEffect(() => {
    if (step === "SEPARATOR") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    return () => setShowHeader(true);
  }, [step, setShowHeader]);

  useEffect(() => {
    fetchSeparators(); //[cite: 2]
    focusInput(); //[cite: 2]
  }, []); //[cite: 2]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "SEPARATOR") {
        handleCancel(); //[cite: 2]
      }
    };
    window.addEventListener("keydown", handleKeyDown); //[cite: 2]

    return () => {
      window.removeEventListener("keydown", handleKeyDown); //[cite: 2]
    };
  }, [step]); //[cite: 2]

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus(); //[cite: 2]
    }, 100); //[cite: 2]
  };

  const fetchSeparators = async () => {
    try {
      const response = await getOrderStatus(); //[cite: 1, 2]
      if (response.success && response.data) {
        //[cite: 1, 2]
        const filtered = response.data
          .filter((status: any) => status.description?.includes("EM SEPARACAO")) //[cite: 2]
          .map((status: any) => ({
            id: status.id,
            name: status.description.replace("EM SEPARACAO |", "").trim(), //[cite: 2]
          }));
        setSeparators(filtered); //[cite: 2]
      } else {
        toast.error(response.message || "Falha ao carregar separadores."); //[cite: 1, 2]
      }
    } catch (error) {
      toast.error("Erro de conexão ao carregar separadores."); //[cite: 2]
    }
  };

  const processAssignment = async (
    orderIdToAssign: number,
    separatorId: number,
  ) => {
    setIsLoading(true); //[cite: 2]
    try {
      const response = await changeOrderStatus(orderIdToAssign, separatorId); //[cite: 1, 2]
      if (response.success) {
        //[cite: 1, 2]
        toast.success(`Pedido ${orderIdToAssign} atribuído com sucesso!`); //[cite: 2]
      } else {
        toast.error(
          response.message || "Erro ao atribuir separador. Tente novamente.", //[cite: 1, 2]
        );
      }
    } catch (error) {
      toast.error(
        "Erro fatal ao processar. Verifique a conexão e tente novamente.", //[cite: 2]
      );
    } finally {
      resetMachineState(); //[cite: 2]
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); //[cite: 2]
    if (!inputValue.trim()) return; //[cite: 2]

    const parsedValue = parseInt(inputValue, 10); //[cite: 2]

    if (step === "ORDER") {
      setScannedOrderId(parsedValue); //[cite: 2]
      setStep("SEPARATOR"); //[cite: 2]
      setInputValue(""); //[cite: 2]
      toast.info("Pedido registrado. Selecione o Separador.");
      focusInput(); //[cite: 2]
      return; //[cite: 2]
    }

    if (step === "SEPARATOR" && scannedOrderId) {
      processAssignment(scannedOrderId, parsedValue); //[cite: 2]
    }
  };

  const handleCardClick = (separatorId: number) => {
    if (step !== "SEPARATOR" || !scannedOrderId) {
      toast.warning("Por favor, bipe o ID do pedido primeiro!"); //[cite: 2]
      focusInput(); //[cite: 2]
      return; //[cite: 2]
    }
    processAssignment(scannedOrderId, separatorId); //[cite: 2]
  };

  const handleCancel = () => {
    toast.info("Operação cancelada."); //[cite: 2]
    resetMachineState(); //[cite: 2]
  };

  const resetMachineState = () => {
    setStep("ORDER"); //[cite: 2]
    setScannedOrderId(null); //[cite: 2]
    setInputValue(""); //[cite: 2]
    setIsLoading(false); //[cite: 2]
    focusInput(); //[cite: 2]
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full h-full min-h-0 overflow-hidden py-2">
      {/* Passo A */}
      <div
        className={`rounded-2xl border transition-all duration-500 ease-in-out flex flex-col justify-center bg-offBlack/80 shadow-glow flex-shrink-0 ${
          step === "ORDER"
            ? "border-petrolBlue p-8 min-h-[35vh] opacity-100 mb-4"
            : "border-transparent h-0 min-h-0 p-0 m-0 opacity-0 overflow-hidden"
        }`}
      >
        <h2 className="font-title text-4xl mb-4 text-center">
          Passo 1: Identificar Pedido
        </h2>

        {step === "ORDER" && (
          <form onSubmit={handleSubmit} className="w-full">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Bipe o ID do Pedido..."
              className="w-full bg-offWhite text-offBlack font-bold outline-none focus:ring-4 focus:ring-offWhite/50 transition-all text-center rounded-xl text-3xl py-8 shadow-inner"
            />
          </form>
        )}
      </div>

      {/* Passo B */}
      <div
        className={`bg-offBlack/80 rounded-2xl border transition-all duration-500 flex-1 flex flex-col min-h-0 overflow-hidden ${
          step === "ORDER"
            ? "border-petrolBlue shadow-glow p-6 opacity-60"
            : "border-bloodRed shadow-glow-red p-4 md:p-6 opacity-100"
        }`}
      >
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2
              className={`font-title transition-colors duration-300 ${step === "SEPARATOR" ? "text-bloodRed text-3xl md:text-4xl" : "text-offWhite text-2xl"}`}
            >
              {step === "ORDER"
                ? "Equipe Disponível"
                : "Passo 2: Atribuir Separador"}
            </h2>
            {step === "SEPARATOR" && (
              <span className="font-bold text-xl text-offWhite bg-offBlack/60 px-3 py-1 rounded-md border border-white/10 shadow-inner mt-1">
                Pedido #{scannedOrderId}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {/* Toggle de Código de Barras */}
            <button
              onClick={() => setShowBarcodes(!showBarcodes)}
              className={`text-sm font-bold border py-2 px-4 rounded-lg transition-all cursor-pointer ${
                showBarcodes
                  ? "bg-offWhite text-offBlack border-offWhite shadow-glow"
                  : "text-offWhite/70 hover:text-white border-offWhite/30 hover:border-white bg-offWhite/5"
              }`}
            >
              {showBarcodes ? "Ocultar Códigos" : "Exibir Códigos"}
            </button>

            {step === "SEPARATOR" && (
              <button
                onClick={handleCancel}
                className="text-sm font-bold text-offWhite hover:text-white border border-bloodRed/50 hover:border-bloodRed py-2 px-4 rounded-lg transition-all cursor-pointer bg-bloodRed/20 active:bg-bloodRed/80 hover:bg-bloodRed/40"
              >
                Cancelar (ESC)
              </button>
            )}
          </div>
        </div>

        {step === "SEPARATOR" && (
          <form
            onSubmit={handleSubmit}
            className="sr-only absolute opacity-0 pointer-events-none"
          >
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </form>
        )}

        {separators.length === 0 ? (
          <p className="text-offWhite/50 flex-1 flex items-center justify-center text-xl">
            Carregando separadores...
          </p>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-full min-h-0 auto-rows-fr pb-2">
            {separators.map((sep) => (
              <button
                key={sep.id}
                onClick={() => handleCardClick(sep.id)}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center bg-offWhite/5 border border-white/10 rounded-xl p-3 transition-all group overflow-hidden ${
                  step === "SEPARATOR"
                    ? "hover:bg-petrolBlue/60 hover:border-petrolBlue hover:shadow-glow cursor-pointer transform hover:-translate-y-1 active:scale-95"
                    : "cursor-not-allowed opacity-50 grayscale"
                }`}
              >
                {/* O layout do texto muda se o código de barras estiver visível ou não */}
                <div
                  className={`text-center w-full transition-all ${showBarcodes ? "mb-1" : "mb-0"}`}
                >
                  <span
                    className={`font-bold leading-tight block truncate text-offWhite group-hover:text-white transition-all ${showBarcodes ? "text-lg" : "text-2xl"}`}
                  >
                    {sep.name}
                  </span>
                  <span
                    className={`text-offWhite/50 mt-1 uppercase tracking-widest font-semibold block transition-all ${showBarcodes ? "text-[10px]" : "text-xs"}`}
                  >
                    ID: {sep.id}
                  </span>
                </div>

                {/* Renderização condicional do código de barras */}
                {showBarcodes && (
                  <div
                    className={`w-full flex items-center justify-center scale-[0.80] origin-top ${step === "SEPARATOR" ? "opacity-100" : "opacity-40"}`}
                  >
                    <BarcodeGenerator value={sep.id} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
