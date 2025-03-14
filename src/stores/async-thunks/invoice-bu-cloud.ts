import invoiceBuCloudApi from "@/apis/invoice-bu-cloud.api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const asyncThunkPaginationInvoiceBuCloud = createAsyncThunk<any, any>(
    "/vps-vng/get-paging",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await invoiceBuCloudApi.getInvoicesList({
                ...query,
            });

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
