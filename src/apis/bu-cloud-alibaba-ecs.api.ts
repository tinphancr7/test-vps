import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";
import { PayloadCreateInstanceAlibabaEcs } from "./alibaba-ecs.api";

export type PayloadModifyInstanceAttribute = {
	InstanceId: string;
	Password?: string;
	InstanceName?: string;
}

class BuCloudAlibabaEcsServices {
    private instance: AxiosInstance;

    constructor() {
        this.instance = HttpService.getInstance(); // Use the shared Axios instance
    }

    createInstance(body: PayloadCreateInstanceAlibabaEcs) {
        return this.instance.post("/bucloud-alibaba-ecs-instances", body);
    }

    startInstance(InstanceId: string) {
        return this.instance.post("/bucloud-alibaba-ecs-instances/start", {
            InstanceId,
        });
    }

    stopInstance(InstanceId: string) {
        return this.instance.post("/bucloud-alibaba-ecs-instances/stop", {
            InstanceId,
        });
    }

    rebootInstance(InstanceId: string) {
        return this.instance.post("/bucloud-alibaba-ecs-instances/reboot", {
            InstanceId,
        });
    }

    modifyInstanceAttribute(payload: PayloadModifyInstanceAttribute) {
        return this.instance.post("/bucloud-alibaba-ecs-instances/attribute", payload);
    }

	getBlockStorageByInstanceId(instanceId: string) {
		return this.instance.get(`/bucloud-alibaba-ecs-disks/instances`, {
			params: {
				instanceId,
				model: 'bucloud-alibaba-ecs'
			}
		})
	}
}

const buCloudAlibabaEcsApis = new BuCloudAlibabaEcsServices();
export default buCloudAlibabaEcsApis;
