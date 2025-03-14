/**
 * 
Module Account
 */

import HttpService from "@/configs/http";
import {filterParams} from "@/utils";
import {AxiosInstance} from "axios";

interface PayloadConfirmDeposit {
    client_id: number;
    amount: number;
}

class accountServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    callCreateAccount = (body: any) => {
        return this.instance.post("/account-vps", body);
    };

    callUpdateAccount = (body: any, id: string) => {
        return this.instance.put(`/account-vps/${id}`, body);
    };

    callDeleteAccount = (ids: string) => {
        return this.instance.delete(`/account-vps/${ids}`);
    };

    callFetchAccount = (params: any) => {
        return this.instance.get("/account-vps/get-paging", {
            params: filterParams(params),
        });
    };

    callFetchAccountById = (id: string) => {
        return this.instance.get(`/account-vps/${id}`);
    };

    getAllYourAccount = () => {
        return this.instance.get(`/account-vps/get-all-your-Account`);
    };

    getAllAccountDigitalOcean = () => {
        return this.instance.get(
            `/account-vps/get-all-account-digital-ocean-by-owner`
        );
    };

    confirmDeposit(payload: PayloadConfirmDeposit) {
        return this.instance.post(
            `/account-vps/confirm-deposit`, payload
        );
    }
}

const accountApi = new accountServices();
export default accountApi;
