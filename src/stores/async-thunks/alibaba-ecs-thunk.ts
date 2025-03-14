import alibabaEcsApis, {
    ParamsGetPriceAlibabaEcs,
} from "@/apis/alibaba-ecs.api";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";
import vpsApis, { GetPagingVps } from "@/apis/vps-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type ParamsGetInstanceTypes = {
    RegionId: string;
    ZoneId: string;
    PageNumber: number;
    InstanceCategory?: string;
    CpuArchitecture?: string;
    GPUSpec?: string;
};

type ParamsGetImages = {
    RegionId: string;
    InstanceType: string;
};

export const asyncThunkGetRegionsAlibabaEcs = createAsyncThunk<any>(
    "/alibaba-ecs/regions",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await alibabaEcsApis.getRegions();

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const asyncThunkGetZonesByRegionIdAlibabaEcs = createAsyncThunk<
    any,
    string
>("/alibaba-ecs/zones", async (RegionId, { rejectWithValue }) => {
    try {
        const { data } = await alibabaEcsApis.getZonesByRegion(RegionId);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetInstanceTypesAlibabaEcs = createAsyncThunk<
    any,
    ParamsGetInstanceTypes
>("/alibaba-ecs/instance-types", async (params, { rejectWithValue }) => {
    try {
        const { data } = await alibabaEcsApis.getInstanceType(params);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetImagesAlibabaEcs = createAsyncThunk<
    any,
    ParamsGetImages
>("/alibaba-ecs/images", async (params, { rejectWithValue }) => {
    try {
        const { data } = await alibabaEcsApis.getImages(params);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetPriceAlibabaEcs = createAsyncThunk<
    any,
    ParamsGetPriceAlibabaEcs
>("/alibaba-ecs/price", async (params, { rejectWithValue }) => {
    try {
        const { data } = await alibabaEcsApis.getPrice(params);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetPagingAlibabaEcs = createAsyncThunk<
    any,
    GetPagingVps
>("/alibaba-ecs/instances", async (params, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getPagingInstancesAlibabaEcs(params);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetAlibabaEcsInstanceByVpsId = createAsyncThunk<
    any,
    string
>("/alibaba-ecs/instances/id", async (id, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getAlibabaEcsInstanceByVpsId(id);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetAlibabaEcsBlockStorageByInstanceId = createAsyncThunk<
    any,
    string
>("/alibaba-ecs/disk/instances/id", async (id, { rejectWithValue }) => {
    try {
        const { data } = await alibabaEcsApis.getBlockStorageByInstanceId(id);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetPagingBuCloudAlibabaEcs = createAsyncThunk<
    any,
    GetPagingVps
>("/bucloud-alibaba-ecs/instances", async (params, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getPagingInstancesBuCloudAlibabaEcs(
            params
        );

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId = createAsyncThunk<
    any,
    string
>("/bucloud-alibaba-ecs/instances/id", async (id, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getBuCloudAlibabaEcsInstanceByVpsId(id);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetBuCloudAlibabaEcsBlockStorageByInstanceId = createAsyncThunk<
    any,
    string
>("/bucloud-alibaba-ecs/disk/instances/id", async (id, { rejectWithValue }) => {
    try {
        const { data } = await buCloudAlibabaEcsApis.getBlockStorageByInstanceId(id);

        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});