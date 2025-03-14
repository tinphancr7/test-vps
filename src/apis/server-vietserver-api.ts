import HttpService from '@/configs/http';
import { ProviderIDEnum } from '@/constants/enum';
import { Pagination } from '@/interfaces/pagination';
import { AxiosInstance } from 'axios';

export interface GetPagingServerVietServer extends Pagination {
    team?: string;
}

class ServerVietServerServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    getPagingServerVietServer(query: GetPagingServerVietServer) {
        return this.instance.get(`/servers`, {
            params: {
                ...query,
                provider: ProviderIDEnum.VietServer,
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

const serverVietServerApis = new ServerVietServerServices();
export default serverVietServerApis;
