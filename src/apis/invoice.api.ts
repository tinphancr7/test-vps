/**
 * 
Module Invoice
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class InvoiceServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  callFetchInvoice = (params: any) => {
    return this.instance.get("/invoices", {
      params: filterParams(params),
    });
  };
  callFetchInvoiceExcel = (data: any) => {
    return this.instance.post("/invoices/excel", data);
  };
  callFetchStatistic = (params: any) => {
    return this.instance.get("/invoices/statistics", {
      params: filterParams(params),
    });
  };
  callFetchProvider = ({ search, page, limit }: any) => {
    return this.instance.get("/providers/get-paging", {
      params: filterParams({ search, pageIndex: page, pageSize: limit }),
    });
  };

  callFetchInvoiceById = (id: string, provider: string) => {
    return this.instance.get(`/invoices/${id}`, {
      params: filterParams({ provider }),
    });
  };

  createInvoiceServer(serverId: string) {
    return this.instance.post("/invoices/create-server-invoice", { serverId });
  }
}

const invoiceApi = new InvoiceServices();
export default invoiceApi;
