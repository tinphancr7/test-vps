import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";
class ManageGofiber {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  getAllProductsBuCloud() {
    return this.instance.get("/product-bucloud/get-products");
  }
  getAllProductsByCategoriesBuCloud(categories: string) {
    return this.instance.get(`/product-bucloud/get-products/${categories}`);
  }
}

const manageGofiberAPI = new ManageGofiber();
export default manageGofiberAPI;
