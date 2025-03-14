import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class OrderServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  createOrder = (data: any) => {
    return this.instance.post("/order/create-order", data);
  };

  createOrderRenew = (data: any) => {
    return this.instance.post("/order/create-order-renew", data);
  };

  getPaggingOrder = (query: any) => {
    return this.instance.get("/order/get-paging", {
      params: query,
    });
  };

  reviewOrder = (status: string, _idOrder: string) => {
    return this.instance.put(`/order/review-order/${_idOrder}`, { status });
  };

  deleteOrder = (_idOrder: string) => {
    return this.instance.delete(`/order/delete-order/${_idOrder}`);
  };

  uploadBill = (data: any, idOrder: string) => {
    return this.instance.post(`/order/upload-bill/${idOrder}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  paymentMethod = (data: any) => {
    return this.instance.post(`/order/create-payment-method/`, data);
  };

  actionOrderVPS = ({ orderId, type }: { orderId: string; type: string }) => {
    console.log(orderId, type);
    return this.instance.post(`/order/action-vps/`, { orderId, type });
  };

  deleteVPSOrder = ({ _idOrder, ipVPS }: { _idOrder: string; ipVPS: string }) => {
    return this.instance.post(`/order/delete-vps/`, { _idOrder, ipVPS });
  };

  getExchange = () => {
    return this.instance.get(`/order/get-exchange`);
  };

  updateExchange = (exchange: any) => {
    return this.instance.post(`/order/update-exchange`, { exchange });
  };
}

const orderApis = new OrderServices();
export default orderApis;
