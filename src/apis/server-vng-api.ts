import HttpService from '@/configs/http';
import { ProviderIDEnum } from '@/constants/enum';
import { Pagination } from '@/interfaces/pagination';
import { AxiosInstance } from 'axios';

export interface GetPagingServerVng extends Pagination {
    team?: string;
}

class ServerVngServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    getPagingServerVng(query: GetPagingServerVng) {
        return this.instance.get(`/servers`, {
            params: {
                ...query,
                provider: ProviderIDEnum.VNG,
            },
        });
    }

    getPwServer(id: string) {
        return this.instance.get(`/servers/get-password/${id}`);
    }
    updateAssignedServerToUser(list_server: string, list_user: string) {
        return this.instance.put('/servers/update-asigned-users', {
            list_server,
            list_user,
        });
    }
    getListServerAdmin = (ids: string) => {
        return this.instance.get(`/servers/get-list-server-admin/${ids}`);
    };
}

const serverVngApis = new ServerVngServices();
export default serverVngApis;
