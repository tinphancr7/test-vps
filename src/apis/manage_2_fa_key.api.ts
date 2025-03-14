import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class Manage2FaKeyServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  callCreateKey = (body: any) => {
    return this.instance.post("/manage-2fa-keys", body);
  };

  callDeleteKey = (ids: string) => {
    return this.instance.delete(`/manage-2fa-keys/${ids}`);
  };

  callFetchKey = ({ search, page, limit }: any) => {
    return this.instance.get("/manage-2fa-keys/get-paging", {
      params: filterParams({ search, page, limit }),
    });
  };
}

const manage2FaKeyApi = new Manage2FaKeyServices();
export default manage2FaKeyApi;
