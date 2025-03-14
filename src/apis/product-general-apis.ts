import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class ProdGeneralServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  getAllProducts() {
    return this.instance.get("/product-general/get-all-products");
  }
}

const prodGeneralApis = new ProdGeneralServices();
export default prodGeneralApis;
