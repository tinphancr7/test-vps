import otherProviderApis from "@/apis/other-provider";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const asyncThunkPaginationProviders = createAsyncThunk<
    any,
    any
>("/aws-lightsail/get-paging", async (query, { rejectWithValue }) => {
    try {
        const { data } = await otherProviderApis.getPagingOtherProviders({
            ...query,
        });

        return {
            data: data?.data?.providers,
            total: data?.data?.total,
        } as any;
    } catch (error) {
        return rejectWithValue(error);
    }
});