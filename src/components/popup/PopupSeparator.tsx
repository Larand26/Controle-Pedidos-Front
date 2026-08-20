import { useEffect } from "react";
import Popup from "./Popup"; // Mantém a sua importação original

type OrderData = {
  ID_SITUACAO: number;
  SIT_DESCRICAO: string;
};

type PopupSeparatorProps = {
  isOpen: boolean;
  onClose: () => void;
  // Assumindo que a API ou o componente pai envia a lista completa de status
  situacoes: OrderData[];
};

export default function PopupSeparator(props: PopupSeparatorProps) {
  const { isOpen, onClose, situacoes } = props;

  useEffect(() => {
    console.log("PopupSeparator montado");
  }, []);

  // 1. Filtra apenas as descrições que contêm o separador "|"
  const colaboradores =
    situacoes?.filter((sit) => sit.SIT_DESCRICAO.includes("|")) || [];

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      {/* Container principal do Popup */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-2xl flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Atribuir Separador
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Selecione o colaborador responsável por esta separação.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Fechar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Grid de Cards (Responsivo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
          {colaboradores.map((colaborador) => {
            // 2. Extrai o nome (Tudo que vem depois do "|")
            const nomeSeparador =
              colaborador.SIT_DESCRICAO.split("|")[1].trim();

            // 3. Pega as duas primeiras iniciais para o Avatar (ex: "Alex Mariano" -> "AM")
            const iniciais = nomeSeparador
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={colaborador.ID_SITUACAO}
                onClick={() => {
                  console.log(
                    `Selecionou: ${nomeSeparador} (ID: ${colaborador.ID_SITUACAO})`,
                  );
                  // Insira sua lógica de update/submit aqui
                  // onClose();
                }}
                className="group flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-200 ease-in-out"
              >
                {/* Avatar do Colaborador */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 font-bold flex items-center justify-center rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                  {iniciais}
                </div>

                {/* Dados do Colaborador */}
                <div className="ml-4 overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-800 truncate">
                    {nomeSeparador}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium bg-gray-200 px-2 py-0.5 rounded-md mt-1 inline-block group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    ID: {colaborador.ID_SITUACAO}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Popup>
  );
}
