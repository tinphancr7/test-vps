/**
 * 
Module Invoice
 */

import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class TransactionServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  getPaggingTransaction = (query: any) => {
    return this.instance.get("/transaction/get-paging", {
      params: query,
    });
  };

  addFundUSDT = (data: any) => {
    return this.instance.post("/transaction/add-fund-usdt", data);
  };

  exportExcelTransaction = (data: any) => {
    return this.instance.post("/transaction/export-excel", data);
  };

  createWalletCrypto = (data: any) => {
    return this.instance.post("/wallet/create", data);
  };

  getOrderAddFund = (data: any) => {
    return this.instance.post("/order-add-fund/create", data);
  };
}

const transactionApis = new TransactionServices();
export default transactionApis;
