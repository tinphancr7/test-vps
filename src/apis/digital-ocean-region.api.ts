import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

class DigitalOceanRegionApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  getAllListRegion = () => {
    return this.instance.get("/digital-ocean/regions/get-all");
  };

  getAllVPSInRegion = (slugRegion: string) => {
    return this.instance.get(
      `/digital-ocean/regions/get-all-vps-in-region/${slugRegion}`
    );
  };
  getAllVPSByTeamIdInRegion = (slugRegion: string, teamId: string) => {
    return this.instance.get(
      `/digital-ocean/regions/get-all-vps-by-team-in-region/${slugRegion}/${teamId}`
    );
  };

  //for bucloud
  getAllVPSInRegionBuCloud = (slugRegion: string) => {
    return this.instance.get(
      `/digital-ocean/regions/get-all-vps-in-region-bucloud/${slugRegion}`
    );
  };

  getAllVPSByTeamIdInRegionBuCloud = (slugRegion: string, teamId: string) => {
    return this.instance.get(
      `/digital-ocean/regions/get-all-vps-by-team-in-region-bucloud/${slugRegion}/${teamId}`
    );
  };
}

const digitalOceanRegionApi = new DigitalOceanRegionApiService();
export default digitalOceanRegionApi;
