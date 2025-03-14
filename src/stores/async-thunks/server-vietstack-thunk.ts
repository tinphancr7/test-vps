import serverVietStackApis, {
    GetPagingServerVietStack,
} from "@/apis/server-vietstack-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

type PayloadServerVietStack = {
    data: Array<any>;
    total: number;
    totalPages: number;
};

export const asyncThunkPaginationServerVietStack = createAsyncThunk<
    PayloadServerVietStack,
    GetPagingServerVietStack
>("/server-vietstack/get-paging", async (query, { rejectWithValue }) => {
    try {
        const { data } = await serverVietStackApis.getPagingServerVietStack({
            ...query,
        });

        return {
            data: data?.data,
            total: data?.counts,
            totalPages: data?.totalPages,
        } as PayloadServerVietStack;
    } catch (error) {
        return rejectWithValue(error);
    }
});
