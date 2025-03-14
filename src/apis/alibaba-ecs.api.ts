import HttpService from "@/configs/http";
import { AxiosInstance } from "axios";

export type PayloadGetInstanceTypeAlibabaEcs = {
	RegionId: string;
	ZoneId: string;
	PageNumber: number;
}

export type PayloadGetSystemDiskCategoriesByInstanceType = {
	RegionId: string;
	ZoneId: string;
	InstanceType: string;
}

type ParamsGetImagesAlibabaEcs = {
	RegionId: string,
	InstanceType: string,
}

export enum AlibabaEcsResourceType {
	INSTANCE = 'instance',
	DISK = 'disk',
	BANDWIDTH = 'bandwidth',
	DDH = 'ddh',
	ELASTICITY_ASSURANCE = 'ElasticityAssurance',
	CAPACITY_RESERVATION = 'CapacityReservation',
}

enum AlibabaEcsIoOptimized {
	NONE = 'none',
	OPTIMIZED = 'optimized',
}

enum AlibabaEcsSysDiskCategory {
	CLOUD = 'cloud',
	CLOUD_EFFICIENCY = 'cloud_efficiency',
	CLOUD_SSD = 'cloud_ssd',
	EPHEMERAL_SSD = 'ephemeral_ssd',
	CLOUD_ESSD = 'cloud_essd',
	CLOUD_AUTO = 'cloud_auto',
}

export enum AlibabaEcsPriceUnit {
	MONTH = 'Month',
	YEAR = 'Year',
	HOUR = 'Hour',
}

enum AlibabaEcsScope {
	REGION = 'Region',
	ZONE = 'Zone',
}

enum AlibabaEcsPlatform {
	WINDOWS = 'Windows',
	LINUX = 'Linux',
}

export enum AlibabaEcsInstanceChargeType {
	PRE_PAID = 'PrePaid', // subscription
	POST_PAID = 'PostPaid', //pay-as-you-go.
}

export type ParamsGetPriceAlibabaEcs = {
	RegionId: string;
	Endpoint: string;
	ResourceType?: AlibabaEcsResourceType;
	ImageId?: string;
	InstanceType?: string;
	DedicatedHostType?: string;
	IoOptimized?: AlibabaEcsIoOptimized;
	InstanceNetworkType?: string;
	InternetChargeType?: string;
	InternetMaxBandwidthOut?: number;
	'SystemDisk.Category'?: AlibabaEcsSysDiskCategory;
	'SystemDisk.Size'?: number;
	'SystemDisk.PerformanceLevel'?: string;
	Period?: number;
	PriceUnit?: AlibabaEcsPriceUnit;
	Amount?: number;
	InstanceAmount?: number;
	Scope?: AlibabaEcsScope;
	Platform?: AlibabaEcsPlatform;
	Capacity?: number;
	AssuranceTimes?: string;
	InstanceCpuCoreCount?: number;
	InstanceTypeList?: string[];
	ZoneId?: string;
};

export type PayloadCreateInstanceAlibabaEcs = {
	TeamId: string;
	InstancePrice: string;
	ProvisionedPerformanceFee?: string;
	InstanceName: string;
	InstanceChargeType: string;
	RegionId: string;
	ZoneId: string;
	InstanceType: string;
	ImageId: string;
	Category: string;
	Period?: number;
	Size: number;
	PerformanceLevel: string;
	ProvisionedIops?: number;
	// BurstingEnabled?: boolean;
	// Encrypted?: boolean;
	DeleteWithInstance: boolean; // Attack Disk
	InternetChargeType: string;
	InternetMaxBandwidthOut: number;
	Password: string;
	AutoRenew?: boolean;
};

export type PayloadModifyInstanceAttribute = {
	InstanceId: string;
	Password?: string;
	InstanceName?: string;
}

class AlibabaEcsServices {
	private instance: AxiosInstance;

	constructor() {
		this.instance = HttpService.getInstance(); // Use the shared Axios instance
	}

	getRegions() {
		return this.instance.get(`/alibaba-ecs-regions`)
	}

	getZonesByRegion(RegionId: string) {
		return this.instance.get(`/alibaba-ecs-zones`, {
			params: {
				RegionId,
			}
		})
	}

	getInstanceType(params: PayloadGetInstanceTypeAlibabaEcs) {
		return this.instance.get(`/alibaba-ecs-instance-types`, {
			params
		})
	}

	getSystemDiskCategoriesByInstanceType(params: PayloadGetSystemDiskCategoriesByInstanceType) {
		return this.instance.get(`/alibaba-ecs-disk/categories`, {
			params
		})
	}

	getImages(params: ParamsGetImagesAlibabaEcs) {
		return this.instance.get(`/alibaba-ecs-images`, {
			params
		})
	}

	getPrice(body: ParamsGetPriceAlibabaEcs) {
		return this.instance.post(`/alibaba-ecs-instances/price`, body)
	}

	createInstance(body: PayloadCreateInstanceAlibabaEcs) {
		return this.instance.post('/alibaba-ecs-instances', body)
	}

	startInstance(InstanceId: string) {
		return this.instance.post('/alibaba-ecs-instances/start', { InstanceId })
	}

	stopInstance(InstanceId: string) {
		return this.instance.post('/alibaba-ecs-instances/stop', { InstanceId })
	}

	rebootInstance(InstanceId: string) {
		return this.instance.post('/alibaba-ecs-instances/reboot', { InstanceId })
	}

	modifyInstanceAttribute(payload: PayloadModifyInstanceAttribute) {
		return this.instance.post('/alibaba-ecs-instances/attribute', payload)
	}

	getBlockStorageByInstanceId(instanceId: string) {
		return this.instance.get(`/alibaba-ecs-disks/instances`, {
			params: {
				instanceId,
				model: 'alibaba-ecs'
			}
		})
	}
}

const alibabaEcsApis = new AlibabaEcsServices();
export default alibabaEcsApis;
