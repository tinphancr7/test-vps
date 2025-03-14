import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";
import { Key } from "react";

export interface ICreateInstance {
    teamId: Key;
    region: string;
    availabilityZone: string;
    blueprintId: string;
    bundleId: string;
}

class AwsLightsailServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

    createInstance(payload: ICreateInstance) {
        return this.instance.post(`/amazon-lightsail-instances`, payload)
    }

    startInstance(id: string) {
        return this.instance.put(`/amazon-lightsail-instances/start/${id}`)
    }

    stopInstance(id: string) {
        return this.instance.put(`/amazon-lightsail-instances/stop/${id}`)
    }

    rebootInstance(id: string) {
        return this.instance.put(`/amazon-lightsail-instances/reboot/${id}`)
    }

    deleteInstance(id: string) {
        return this.instance.delete(`/amazon-lightsail-instances/${id}`)
    }

    getAwsLightsailKeyPair(id: string) {
        return this.instance.get(`/amazon-lightsail-key-pairs/instances/${id}`)
    }
}

const awsLightsailApis = new AwsLightsailServices();
export default awsLightsailApis;
