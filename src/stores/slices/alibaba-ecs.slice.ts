import {createSlice} from "@reduxjs/toolkit";
import {
	asyncThunkGetAlibabaEcsBlockStorageByInstanceId,
	asyncThunkGetAlibabaEcsInstanceByVpsId,
	asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId,
	asyncThunkGetImagesAlibabaEcs,
	asyncThunkGetInstanceTypesAlibabaEcs,
	asyncThunkGetPagingAlibabaEcs,
	asyncThunkGetPagingBuCloudAlibabaEcs,
	asyncThunkGetPriceAlibabaEcs,
	asyncThunkGetRegionsAlibabaEcs,
	asyncThunkGetZonesByRegionIdAlibabaEcs,
} from "../async-thunks/alibaba-ecs-thunk";
import {performanceLevelsList} from "@/pages/buy-vps-alibaba-ecs/components/constants";

const checksIsValidPw = (value: string) => {
	return [
		{
			isValid: /^.{8,30}$/.test(value),
			message: "Mật khẩu phải có từ 8 đến 30 ký tự.",
		},
		{
			isValid: /[a-z]/.test(value),
			message: "Mật khẩu phải chứa ít nhất một chữ cái viết thường.",
		},
		{
			isValid: /[A-Z]/.test(value),
			message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.",
		},
		{
			isValid: /[0-9]/.test(value),
			message: "Mật khẩu phải chứa ít nhất một chữ số.",
		},
	];
};

const initialState: any = {
	teamId: "",
	instanceChargeType: "PrePaid",
	region: "ap-southeast-1",
	zone: "",
	vCpuSelected: "",
	memoriesSelected: "",
	searchIntType: "",
	x86Selected: "",
	armSelected: "",
	gpuSelected: "",
	architectureSelected: "",
	instanceType: "",
	platform: "",
	versionPlatform: {},
	category: "",
	size: 40,
	minSize: 40,
	performanceLevel: "",
	provisionedIops: 10,
	provisionedIopsEnabled: false,
	burstingEnabled: true,
	deleteWithInstance: true,
	encrypted: false,
	isPublicIpAddress: true,
	internetChargeType: "PayByBandwidth",
	internetMaxBandwidthOut: 1,
	password: "",
	pwConfirm: "",
	isInValidPw: true,
	autoRenew: false,
	period: "1",
	price: {},
	regionsList: [],
	zonesList: [],
	instanceTypesList: [],
	imagesList: [],
	categoriesList: [],
	performanceLevelsList: [],
	pageNumber: 1,
	totalPagesInstanceTypes: 0,
	isLoading: {
		regionsList: false,
		zonesList: false,
		instanceTypesList: false,
		imagesList: false,
		price: false,
		fetch: false,
		detail: false,
		storage: false,
	},
	isSubmitting: false,
	instance: {},
	instancesList: [],
	totalPrice: 0,
	totalInstancesList: 0,
	status: "",
	teamSelected: null,
	searchByIp: "",
	disks: [],
};

const alibabaEcsSlice = createSlice({
	name: "alibabaEcs",
	initialState,
	reducers: {
		setTeamId: (state, action) => {
			state.teamId = action.payload;
		},

		setInstanceChargeType: (state, action) => {
			state.instanceChargeType = action.payload;
		},

		setRegion: (state, action) => {
			state.region = action.payload;

			state.vCpuSelected = "";
			state.memoriesSelected = "";
			state.searchIntType = "";
			state.x86Selected = "";
			state.armSelected = "";
			state.gpuSelected = "";
			state.architectureSelected = "";
		},

		setZone: (state, action) => {
			state.zone = action.payload;

			state.vCpuSelected = "";
			state.memoriesSelected = "";
			state.searchIntType = "";
			state.x86Selected = "";
			state.armSelected = "";
			state.gpuSelected = "";
			state.architectureSelected = "";
		},

		setVCpuSelected: (state, action) => {
			state.vCpuSelected = action.payload;
		},

		setMemoriesSelected: (state, action) => {
			state.memoriesSelected = action.payload;
		},

		setSearchIntType: (state, action) => {
			state.searchIntType = action.payload;
		},

		setX86Selected: (state, action) => {
			state.x86Selected = action.payload;
		},

		setArmSelected: (state, action) => {
			state.armSelected = action.payload;
		},

		setGpuSelected: (state, action) => {
			state.gpuSelected = action.payload;
		},

		setArchitectureSelected: (state, action) => {
			state.architectureSelected = action.payload;
		},

		setInstanceType: (state, action) => {
			state.instanceType = action.payload;

			const getSysDiskCategories = state.instanceTypesList?.find(
				(it: any) => it?.InstanceTypeId === action.payload
			);

			if (getSysDiskCategories) {
				state.categoriesList = getSysDiskCategories?.SystemDiskCategories || [];
				state.category = getSysDiskCategories?.SystemDiskCategories[0]?.Value;

				if (
					getSysDiskCategories?.SystemDiskCategories[0]?.Value === "cloud_essd"
				) {
					state.performanceLevel = performanceLevelsList.slice(0, 2);
					state.performanceLevelsList = performanceLevelsList[0]?.value;
				}
			}
		},

		setPlatform: (state, action) => {
			state.platform = action.payload;
		},

		setVersionPlatform: (state, action) => {
			state.versionPlatform[action.payload.platform] = action.payload.ImageId;
		},

		setCategory: (state, action) => {
			state.category = action.payload;

			if (action.payload === "cloud_essd") {
				let arrList: Array<any> = [];

				if (state.size >= 1 && state.size < 20) {
					arrList = [performanceLevelsList[0]];
				}

				if (state.size >= 20 && state.size < 461) {
					arrList = performanceLevelsList.slice(0, 2);
				}

				if (state.size >= 461 && state.size < 1261) {
					arrList = performanceLevelsList.slice(0, 3);
				}

				if (state.size >= 1261 && state.size < 65536) {
					arrList = performanceLevelsList;
				}

				state.performanceLevelsList = arrList;
				state.performanceLevel = arrList[0]?.value;
			}
		},

		setSize: (state, action) => {
			state.size = action.payload;

			if (state.category === "cloud_auto" && action.payload <= 3) {
				state.provisionedIops = 10;
				state.provisionedIopsEnabled = false;
				state.burstingEnabled = false;
			}

			if (state.category === "cloud_essd") {
				let arrList: Array<any> = [];

				if (action.payload >= 1 && action.payload < 20) {
					arrList = [performanceLevelsList[0]];
				}

				if (action.payload >= 20 && action.payload < 461) {
					arrList = performanceLevelsList.slice(0, 2);
				}

				if (action.payload >= 461 && action.payload < 1261) {
					arrList = performanceLevelsList.slice(0, 3);
				}

				if (action.payload >= 1261 && action.payload < 65536) {
					arrList = performanceLevelsList;
				}

				state.performanceLevelsList = arrList;
			}
		},

		setMinSize: (state, action) => {
			state.minSize = action.payload;
		},

		setPerformanceLevel: (state, action) => {
			state.performanceLevel = action.payload;
		},

		setPerformanceLevelsList: (state, action) => {
			state.performanceLevelsList = action.payload;
		},

		setProvisionedIops: (state, action) => {
			state.provisionedIops = action.payload;
		},

		setProvisionedIopsEnabled: (state, action) => {
			state.provisionedIopsEnabled = action.payload;
		},

		setBurstingEnabled: (state, action) => {
			state.burstingEnabled = action.payload;
		},

		setEncrypted: (state, action) => {
			state.encrypted = action.payload;
		},

		setDeleteWithInstance: (state, action) => {
			state.deleteWithInstance = action.payload;
		},

		setIsPublicIpAddress: (state, action) => {
			state.isPublicIpAddress = action.payload;
		},

		setInternetChargeType: (state, action) => {
			state.internetChargeType = action.payload;

			if (action.payload === "PayByTraffic") {
				state.internetMaxBandwidthOut = 5;
			} else {
				state.internetMaxBandwidthOut = 1;
			}
		},

		setInternetMaxBandwidthOut: (state, action) => {
			state.internetMaxBandwidthOut = action.payload;
		},

		setPassword: (state, action) => {
			state.password = action.payload;

			const isValidPw = checksIsValidPw(action.payload)?.every(
				(it) => it?.isValid
			);

			state.isInValidPw = !isValidPw
				? "Password invalid"
				: !state.pwConfirm
				? "Confirm the password"
				: "";
		},

		setPwConfirm: (state, action) => {
			state.pwConfirm = action.payload;

			const isValidPw = checksIsValidPw(action.payload)?.every(
				(it) => it?.isValid
			);

			const isInValidPw = !isValidPw
				? "Password invalid"
				: action.payload !== state.password
				? "The passwords do not match."
				: "";

			state.isInValidPw = isInValidPw;
		},

		setAutoRenew: (state, action) => {
			state.autoRenew = action.payload;
		},

		setPeriod: (state, action) => {
			state.period = action.payload;
		},

		setTotalPagesInstanceTypes: (state, action) => {
			state.totalPagesInstanceTypes = action.payload;
		},

		setPageNumber: (state, action) => {
			state.pageNumber = action.payload;
		},

		setIsSubmitting: (state, action) => {
			state.isSubmitting = action.payload;
		},

		setStatus: (state, action) => {
			state.status = action.payload;
		},

		setTeamSelected: (state, action) => {
			state.teamSelected = action.payload;
		},

		setSearchByIp: (state, action) => {
			state.searchByIp = action.payload;
		},

		setInstanceName: (state, action) => {
			state.instance.vps_id.InstanceName = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Get Regions
			.addCase(asyncThunkGetRegionsAlibabaEcs.pending, (state) => {
				state.isLoading.regionsList = true;
			})
			.addCase(asyncThunkGetRegionsAlibabaEcs.fulfilled, (state, action) => {
				state.regionsList = action.payload.regions;
				state.isLoading.regionsList = false;
			})
			.addCase(asyncThunkGetRegionsAlibabaEcs.rejected, (state) => {
				state.isLoading.regionsList = false;
			})

			// Get Zones
			.addCase(asyncThunkGetZonesByRegionIdAlibabaEcs.pending, (state) => {
				state.isLoading.zonesList = true;
			})
			.addCase(
				asyncThunkGetZonesByRegionIdAlibabaEcs.fulfilled,
				(state, action) => {
					state.zonesList = action.payload.zones;
					state.isLoading.zonesList = false;
				}
			)
			.addCase(asyncThunkGetZonesByRegionIdAlibabaEcs.rejected, (state) => {
				state.isLoading.zonesList = false;
			})

			// Get Instance Types
			.addCase(asyncThunkGetInstanceTypesAlibabaEcs.pending, (state) => {
				state.isLoading.instanceTypesList = true;
			})
			.addCase(
				asyncThunkGetInstanceTypesAlibabaEcs.fulfilled,
				(state, action) => {
					state.instanceTypesList = action.payload.instanceTypes;
					state.totalPagesInstanceTypes = action.payload.totalPages;
					state.isLoading.instanceTypesList = false;
				}
			)
			.addCase(asyncThunkGetInstanceTypesAlibabaEcs.rejected, (state) => {
				state.isLoading.instanceTypesList = false;
			})

			// Get Images
			.addCase(asyncThunkGetImagesAlibabaEcs.pending, (state) => {
				state.isLoading.imagesList = true;
			})
			.addCase(asyncThunkGetImagesAlibabaEcs.fulfilled, (state, action) => {
				state.isLoading.imagesList = false;
				state.imagesList = action.payload.images;

				const isExistUbuntuPf = action.payload?.images?.find(
					(it: any) => it?.Platform === "Ubuntu"
				);

				const platforms = action.payload.images[0]?.Platform?.replace(
					/\d+/g,
					""
				).trim();

				const defaultPlatform = isExistUbuntuPf ? "Ubuntu" : platforms;

				state.platform = defaultPlatform;

				const versionPlatform = action.payload?.images?.reduce(
					(curr: any, item: any) => {
						const replacePlatform = item?.Platform?.replace(/\d+/g, "").trim();

						curr[replacePlatform] = item?.ImageId;

						return curr;
					},
					{}
				);

				state.versionPlatform = versionPlatform;

				const image = action.payload?.images?.find(
					(it: any) => it?.ImageId === versionPlatform[defaultPlatform]
				);

				state.size = Number(image?.Size);
				state.size = Number(image?.Size);
			})
			.addCase(asyncThunkGetImagesAlibabaEcs.rejected, (state) => {
				state.isLoading.imagesList = false;
			})

			// Get Price
			.addCase(asyncThunkGetPriceAlibabaEcs.pending, (state) => {
				state.isLoading.price = true;
			})
			.addCase(asyncThunkGetPriceAlibabaEcs.fulfilled, (state, action) => {
				state.price = action.payload?.PriceInfo?.Price;
				state.isLoading.price = false;
			})
			.addCase(asyncThunkGetPriceAlibabaEcs.rejected, (state) => {
				state.isLoading.price = false;
			})

			// Get Paging Alibaba Ecs
			.addCase(asyncThunkGetPagingAlibabaEcs.pending, (state) => {
				state.isLoading.fetch = true;
			})
			.addCase(asyncThunkGetPagingAlibabaEcs.fulfilled, (state, action) => {
				state.instancesList = action.payload.data;
				state.totalInstancesList = action.payload.total;
				state.totalPrice = action.payload.totalPrice;
				state.isLoading.fetch = false;
			})
			.addCase(asyncThunkGetPagingAlibabaEcs.rejected, (state) => {
				state.isLoading.fetch = false;
			})

			// Get Paging BuCloud Alibaba Ecs
			.addCase(asyncThunkGetPagingBuCloudAlibabaEcs.pending, (state) => {
				state.isLoading.fetch = true;
			})
			.addCase(asyncThunkGetPagingBuCloudAlibabaEcs.fulfilled, (state, action) => {
				state.instancesList = action.payload.data;
				state.totalInstancesList = action.payload.total;
				state.totalPrice = action.payload.totalPrice;
				state.isLoading.fetch = false;
			})
			.addCase(asyncThunkGetPagingBuCloudAlibabaEcs.rejected, (state) => {
				state.isLoading.fetch = false;
			})

			// Get Alibaba Ecs Instance By Vps Id
			.addCase(asyncThunkGetAlibabaEcsInstanceByVpsId.pending, (state) => {
				state.isLoading.detail = true;
			})
			.addCase(
				asyncThunkGetAlibabaEcsInstanceByVpsId.fulfilled,
				(state, action) => {
					state.instance = action.payload.vps;
					state.isLoading.detail = false;
				}
			)
			.addCase(asyncThunkGetAlibabaEcsInstanceByVpsId.rejected, (state) => {
				state.isLoading.detail = false;
			})

			// Get BuCloud Alibaba Ecs Instance By Vps Id
			.addCase(asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId.pending, (state) => {
				state.isLoading.detail = true;
			})
			.addCase(
				asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId.fulfilled,
				(state, action) => {
					state.instance = action.payload.vps;
					state.isLoading.detail = false;
				}
			)
			.addCase(asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId.rejected, (state) => {
				state.isLoading.detail = false;
			})

			// Get Alibaba Ecs Block Storage By Instance Id
			.addCase(
				asyncThunkGetAlibabaEcsBlockStorageByInstanceId.pending,
				(state) => {
					state.isLoading.storage = true;
				}
			)
			.addCase(
				asyncThunkGetAlibabaEcsBlockStorageByInstanceId.fulfilled,
				(state, action) => {
					state.disks = action.payload.disks;
					state.isLoading.storage = false;
				}
			)
			.addCase(
				asyncThunkGetAlibabaEcsBlockStorageByInstanceId.rejected,
				(state) => {
					state.isLoading.storage = false;
				}
			);
	},
});

export const {
	setTeamId,
	setInstanceChargeType,
	setRegion,
	setZone,
	setVCpuSelected,
	setMemoriesSelected,
	setSearchIntType,
	setX86Selected,
	setArmSelected,
	setGpuSelected,
	setArchitectureSelected,
	setInstanceType,
	setPlatform,
	setVersionPlatform,
	setCategory,
	setSize,
	setMinSize,
	setPerformanceLevel,
	setPerformanceLevelsList,
	setProvisionedIops,
	setBurstingEnabled,
	setProvisionedIopsEnabled,
	setEncrypted,
	setDeleteWithInstance,
	setIsPublicIpAddress,
	setInternetChargeType,
	setInternetMaxBandwidthOut,
	setPassword,
	setPwConfirm,
	setAutoRenew,
	setPeriod,
	setTotalPagesInstanceTypes,
	setPageNumber,
	setIsSubmitting,
	setStatus,
	setTeamSelected,
	setSearchByIp,
	setInstanceName,
} = alibabaEcsSlice.actions;

export default alibabaEcsSlice.reducer;
