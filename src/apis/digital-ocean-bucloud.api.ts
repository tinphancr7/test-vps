import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";
class DigitalOceanBuCloud {
  private instance: AxiosInstance;

  constructor() {
    this.instance = HttpService.getInstance(); // Use the shared Axios instance
  }

  //VPS

  createVPSDigitalOceanBuCloud = (data: any) => {
    return this.instance.post("/digital-ocean/vps/bu-cloud/create", data);
  };

  managementVPSDigitalOceanBuCloud = (query: any) => {
    return this.instance.get("/digital-ocean/vps/bu-cloud/management", {
      params: query,
    });
  };

  detailVPSBuCloudDigitalOcean = (_id: string) => {
    return this.instance.get(
      `/digital-ocean/vps/bu-cloud/management/${_id}/detail`
    );
  };

  getDataBandWithVPSBuCloudDigitalOcean = (_id: any) => {
    return this.instance.get(
      `/digital-ocean/vps/bu-cloud/management/${_id}/graphs/bandwidth`
    );
  };
  getDataCPUVPSBuCloudDigitalOcean = (_id: any) => {
    return this.instance.get(
      `/digital-ocean/vps/bu-cloud/management/${_id}/graphs/cpu`
    );
  };

  destroyVPSBuCloudDigitalOcean = (data: any) => {
    return this.instance.post(
      `/digital-ocean/vps/bu-cloud/management/${data?._id}/destroy`,
      data
    );
  };

  getPasswordVPSDigitalOcean = (_id: any) => {
    return this.instance.get(`/digital-ocean/vps/management/${_id}/password`);
  };

  exportExcelVPSDigitalOceanBuCloud = (query: any) => {
    return this.instance.get(
      "/digital-ocean/vps/bu-cloud/management/export-excel",
      {
        params: query,
      }
    );
  };

  //Billing
  billingHistoryDigitalOcean = (query: any) => {
    return this.instance.get(`/digital-ocean/billing`, {
      params: query,
    });
  };

  invoiceDetailDigitalOcean = (billing_id: string) => {
    return this.instance.get(`/digital-ocean/invoice/${billing_id}/detail`);
  };

  // SSL Certificate
  createCertificateDigitalOcean = (data: any) => {
    return this.instance.post(`/digital-ocean/certificate/create`, data);
  };
  getListCertificateDigitalOcean = () => {
    return this.instance.get(`/digital-ocean/certificate/get-list`);
  };

  // Load Balancer

  exportLBExcelDigitalOcean = (query: any) => {
    return this.instance.get(
      "/digital-ocean/load-balancer/bu-cloud/management/export-excel",
      {
        params: query,
      }
    );
  };

  createLoadBalancerDigitalOcean = (data: any) => {
    return this.instance.post(
      `/digital-ocean/load-balancer/bu-cloud/create`,
      data
    );
  };

  managementLoadBalancerDigitalOcean = (query: any) => {
    return this.instance.get(
      `/digital-ocean/load-balancer/bu-cloud/management`,
      {
        params: query,
      }
    );
  };

  detailLoadBalancerDigitalOcean = (_id: string) => {
    return this.instance.get(
      `/digital-ocean/load-balancer/bu-cloud/management/${_id}/detail`
    );
  };

  getDataChartLoadBalancerHTTPReq = (_id: any) => {
    return this.instance.get(
      `/digital-ocean/load-balancer/management/${_id}/graphs/frontend_http_requests_per_second`
    );
  };

  getDataChartLoadBalancerConnections = (_id: any) => {
    return this.instance.get(
      `/digital-ocean/load-balancer/management/${_id}/graphs/frontend_connections`
    );
  };

  destroyLoadBalancerDigitalOcean = (data: any) => {
    return this.instance.post(
      `/digital-ocean/load-balancer/bu-cloud/management/${data?._id}/destroy`,
      data
    );
  };

  removeVPSLoadBalancerDigitalOcean = (
    droplet_id: any,
    infoLoadBalancer: any
  ) => {
    return this.instance.post(
      `/digital-ocean/load-balancer/bu-cloud/management/${droplet_id}/remove`,
      infoLoadBalancer
    );
  };

  addVPSIntoLoadBalancerDigitalOcean = (
    id_load_balancer: string,
    data: any
  ) => {
    return this.instance.post(
      `/digital-ocean/load-balancer/bu-cloud/management/${id_load_balancer}/add`,
      data
    );
  };

  updateSettingLoadBalancerDigitalOcean = (
    id_load_balancer: any,
    data: any
  ) => {
    return this.instance.post(
      `/digital-ocean/load-balancer/bu-cloud/management/${id_load_balancer}/update`,
      data
    );
  };

  //Action
  createActionDigitalOcean = (data: any) => {
    return this.instance.post(`/digital-ocean/action/create`, data);
  };

  createActionBuCloudDigitalOcean = (data: any) => {
    return this.instance.post(`/digital-ocean/action/bu-cloud/create`, data);
  };

  getActionDigitalOcean = (query: any) => {
    return this.instance.get(`/digital-ocean/action/get`, {
      params: query,
    });
  };

  createAndAddTagDigitalOcean = (data: any) => {
    return this.instance.post(`/digital-ocean/tags/create`, data);
  };

  getListTag = () => {
    return this.instance.get(`/digital-ocean/tags/get`);
  };
}

const digitalOceanBuCloudApi = new DigitalOceanBuCloud();
export default digitalOceanBuCloudApi;
