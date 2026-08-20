import { useEffect } from "react";
import Popup from "./Popup";
import { changeOrderStatus } from "../../apis/order";
import {
  parseSeparators,
  type OrderStatusData,
} from "../../utils/separator.logic";

export type PopupSeparatorProps = {
  isOpen: boolean;
  onClose: () => void;
  situations: OrderStatusData[];
  orderId?: number;
};

export default function PopupSeparator({
  isOpen,
  onClose,
  situations,
  orderId,
}: PopupSeparatorProps) {
  useEffect(() => {
    console.log("PopupSeparator montado");
  }, []);

  const parsedSeparators = parseSeparators(situations);

  const handleChangeStatus = async (
    currentOrderId: number,
    statusId: number,
  ) => {
    try {
      const response = await changeOrderStatus(currentOrderId, statusId);
      if (response.success) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao alterar o status:", error);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Atribuir Separador">
      <div className="flex flex-col gap-4">
        <p className="text-md text-[#1C1C1C]/70 font-montserrat mb-2">
          Selecione o separador responsável
        </p>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
          {parsedSeparators.map((separator) => (
            <div
              key={separator.id}
              onClick={() => {
                if (orderId) handleChangeStatus(orderId, separator.id);
              }}
              className="group flex items-center p-4 bg-white border border-[#1C1C1C]/10 rounded-lg cursor-pointer hover:border-[#003650] hover:shadow-md transition-all duration-200"
            >
              {/* Avatar com as cores da identidade visual */}
              <div className="flex-shrink-0 w-12 h-12 bg-[#EAEAEA] text-[#BC0F0F] font-montserrat font-bold flex items-center justify-center rounded-full group-hover:bg-[#BC0F0F] group-hover:text-[#EAEAEA] transition-colors duration-200">
                {separator.initials}
              </div>

              <div className="ml-4 overflow-hidden">
                <h3 className="text-md font-bold font-montserrat text-[#1C1C1C] group-hover:text-[#003650] truncate">
                  {separator.fullName}
                </h3>
                <span className="text-xs text-[#EAEAEA] bg-[#1C1C1C]/60 font-montserrat px-2 py-1 rounded-md mt-1 inline-block group-hover:bg-[#003650] transition-colors">
                  ID: {separator.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Popup>
  );
}
