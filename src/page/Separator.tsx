import { getOrderStatus } from "../apis/order";

export default function Separator() {
  const handleGetOrderStatus = async () => {
    try {
      const response = await getOrderStatus();
      console.log("Response from getOrderStatus:", response);
    } catch (error) {
      console.error("Error getting order status:", error);
    }
  };
  return (
    <>
      <button onClick={handleGetOrderStatus}>Get Order Status</button>
    </>
  );
}
