import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class VpsOrtherServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance();
  }

  createNewVps(data: any) {
    return this.instance.post("/orther-vps", data);
  }
  updateVps(data: any, id: any) {
    return this.instance.put(`/orther-vps/${id}`, data);
  }
  getPaging(data: any) {
    return this.instance.get("/orther-vps/get-paging", { params: data });
  }
  updateNoteVps(id: string, payload: string) {
    return this.instance.put(`/orther-vps/${id}/note`, {
      note: payload,
    });
  }
  updateLabelVps(id: string, payload: any) {
    return this.instance.put(`/orther-vps/${id}/label`, payload);
  }
  getDetailVps(id: string) {
    return this.instance.get(`/orther-vps/${id}`);
  }
  getAapanel(id: string) {
    return this.instance.get(`/orther-vps/get-aapanel/${id}`);
  }

  getPwVps(id: string) {
    return this.instance.get(`/orther-vps/get-password/${id}`);
  }

  getPwAaPanel(id: string) {
    return this.instance.get(`/orther-vps/get-password-aapanel/${id}`);
  }
  updateAccountAapanel = (id: string, body: any) => {
    return this.instance.put(`/orther-vps/update-account-aapnel/${id}`, body);
  };
  callAccessPanel = (id: string) => {
    return this.instance.get(`/orther-vps/get-token-aapanel/${id}`);
  };
  delete = (id: string) => {
    return this.instance.delete(`/orther-vps/${id}`);
  };
  uploadExcelFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.instance.post("/orther-vps/upload-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getFileExel() {
    return this.instance.get("/public/files/example_vps_import.xlsx", {
      responseType: "blob", // Trả về dữ liệu file dưới dạng blob
    });
  }

  getListVpsAdmin = (ids: string) => {
    return this.instance.get(`/orther-vps/get-list-vps-admin/${ids}`);
  };

  updateAssignedVpsToUser(list_vps: string, list_user: string) {
    return this.instance.put("/orther-vps/update-asigned-users", {
      list_vps,
      list_user,
    });
  }
}

const vpsOrtherApis = new VpsOrtherServices();
export default vpsOrtherApis;
