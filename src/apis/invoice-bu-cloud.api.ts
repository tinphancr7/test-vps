/**
 * 
Module Invoice
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class InvoiceBuCloudServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  getInvoicesList = (params: any) => {
    return this.instance.get("/invoices-bu-cloud", {
      params: filterParams(params),
    });
  };

  getInvoicesListExcel = (params: any) => {
    return this.instance.post("/invoices-bu-cloud/excel", params);
  };
}

const invoiceBuCloudApi = new InvoiceBuCloudServices();
export default invoiceBuCloudApi;
