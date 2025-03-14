/**
 * 
Module log
 */

import HttpService from '@/configs/http';
import { filterParams } from '@/utils';
import { AxiosInstance } from 'axios';

class OrderDomainLogServices {
    private instance: AxiosInstance;
    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }
    callCreateOrderDomainLog = (body: any) => {
        return this.instance.post('logs', {
            ...body,
        });
    };

    callUpdateOrderDomainLog = (body: any, id: string) => {
        return this.instance.put(`/logs/update/${id}`, {
            ...body,
        });
    };

    callDeleteOrderDomainLog = (ids: string) => {
        return this.instance.delete(`/logs/delete/${ids}`);
    };

    callFetchOrderDomainLog = (params: any) => {
        return this.instance.get('/order-domain-logs', {
            params: filterParams(params),
        });
    };

    callFetchLogById = (id: string) => {
        return this.instance.get(`/logs/${id}`);
    };
}

const logApi = new OrderDomainLogServices();
export default logApi;
