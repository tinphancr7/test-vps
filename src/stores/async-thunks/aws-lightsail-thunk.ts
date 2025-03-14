import vpsApis, { GetPagingVps } from "@/apis/vps-apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadInstance = {
    data: Array<any>;
    total: number;
    totalPrice: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
};

type PayloadGetInstanceAwsLgByBpsId = {
    data: any;
};

export const asyncThunkPaginationAwsLightsail = createAsyncThunk<
    PayloadInstance,
    GetPagingVps
>("/aws-lightsail/get-paging", async (query, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getPagingAwsLightsailInstances({
            ...query,
        });

        return {
            data: data?.data,
            total: data?.total,
            pageIndex: data?.pageIndex,
            pageSize: data?.pageSize,
            totalPages: data?.totalPages,
            totalPrice: data?.totalPrice,
        } as PayloadInstance;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const asyncThunkGetInstanceAwsLightsailByVpsId = createAsyncThunk<
    PayloadGetInstanceAwsLgByBpsId,
    any
>("/aws-lightsail/id", async (id, { rejectWithValue }) => {
    try {
        const { data } = await vpsApis.getAwsInstanceByVpsId(id);

        return {
            data: data?.vps,
        } as PayloadInstance;
    } catch (error) {
        return rejectWithValue(error);
    }
});
