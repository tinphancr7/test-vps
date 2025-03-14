import HttpService from "@/configs/http";

import { AxiosInstance } from "axios";

interface UserPayload {
  username: string;
  password?: string;
  name: string;
  email: string;
  role: string;
  teams: Array<string>;
}

class UserServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  getPaginationUsers(query: any) {
    return this.instance.get("/users", {
      params: query,
    });
  }

  getUserById(id: string) {
    return this.instance.get(`/users/${id}`);
  }

  getAllUser() {
    return this.instance.get("/users/get-all");
  }

  createNewUser(data: UserPayload) {
    return this.instance.post("/users", data);
  }

  updateUser(id: string, data: UserPayload) {
    return this.instance.put(`/users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.instance.delete(`/users/${id}`);
  }

  resetPassword(id: string, payload: string) {
    return this.instance.put(`/users/up-password/${id}`, {
      newPassword: payload,
    });
  }
  changePassword(body: string) {
    return this.instance.put(`/users/change-password`, body);
  }
  getListUser() {
    return this.instance.get("/users/get-all-by-admin");
  }
}

const userApis = new UserServices();
export default userApis;
