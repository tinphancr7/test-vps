import HttpService from '@/configs/http';
import { ProviderIDEnum } from '@/constants/enum';
import { Pagination } from '@/interfaces/pagination';
import { AxiosInstance } from 'axios';

export interface GetPagingServerVietStack extends Pagination {
    team?: string;
}

class ServerVietStackServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    getPagingServerVietStack(query: GetPagingServerVietStack) {
        return this.instance.get(`/servers`, {
            params: {
                ...query,
                provider: ProviderIDEnum.VIET_STACK,
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

const serverVietStackApis = new ServerVietStackServices();
export default serverVietStackApis;
