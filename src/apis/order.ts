import config from "../config/api.config";
import axios from "axios";

export async function changeOrderStatus(
  orderId: number,
  status: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const body = {
      newStatusID: status,
    };
    const response = await axios.post(
      `${config.api.host}/api/orders/${orderId}/change-status`,
      body,
      {
        headers: {
          Authorization: `Bearer ${config.api.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status !== 200) {
      return { success: true, message: "Status atualizado com sucesso" };
    }
    return { success: true, message: "Status atualizado com sucesso" };
  } catch (error) {
    console.error("Error changing order status:", error);
    return { success: false, message: "Error changing order status" };
  }
}
