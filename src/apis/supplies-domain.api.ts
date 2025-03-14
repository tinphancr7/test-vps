import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class SuppliesDomainServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  searchDomain = ({ domain_name }: any) => {
    return this.instance.get("/manager-supplies-domain/search-domain", {
      params: filterParams({ domain_name }),
    });
  };

  loadMoreDynadot(query: any) {
    return this.instance.get("/dynadots/search", {
      params: query,
    });
  }

  loadMoreGname(query: any) {
    return this.instance.get("/gname/search", {
      params: query,
    });
  }

	loadMoreGodaddy(query: any) {
		return this.instance.get("/godaddy/search", {
			params: query,
		});
	}
  loadMoreEpik(query: any) {
    return this.instance.get("/epiks/search", {
      params: query,
    });
  }
  loadMoreName(query: any) {
    return this.instance.get("/names/search", {
      params: query,
    });
  }
  loadMoreNameCheap(query: any) {
    return this.instance.get("/name-cheap/search", {
      params: query,
    });
  }
}

const suppliesDomainApi = new SuppliesDomainServices();
export default suppliesDomainApi;
