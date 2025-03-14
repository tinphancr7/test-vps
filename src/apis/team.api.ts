/**
 * 
Module team
 */

import HttpService from "@/configs/http";
import { filterParams } from "@/utils";
import { AxiosInstance } from "axios";

class TeamServices {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  callCreateTeam = (body: any) => {
    return this.instance.post("/teams", body);
  };

  callUpdateTeam = (body: any, id: string) => {
    return this.instance.put(`/teams/${id}`, body);
  };

  callDeleteTeam = (ids: string) => {
    return this.instance.delete(`/teams/${ids}`);
  };

  callFetchTeam = ({ search, page, limit }: any) => {
    return this.instance.get("/teams/get-paging", {
      params: filterParams({ search, page, limit }),
    });
  };
  callFetchYourTeamNoneAuth = ({ search, page, limit }: any) => {
    return this.instance.get("/teams/get-paging-your-team-none-auth", {
      params: filterParams({ search, page, limit }),
    });
  };
  callFetchTeamNoneAuth = ({ search, page, limit }: any) => {
    return this.instance.get("/teams/get-paging-none-auth", {
      params: filterParams({ search, page, limit }),
    });
  };

  callFetchTeamById = (id: string) => {
    return this.instance.get(`/teams/${id}`);
  };

  getAllYourTeam = () => {
    return this.instance.get(`/teams/get-all-your-team`);
  };
}

const teamApi = new TeamServices();
export default teamApi;
