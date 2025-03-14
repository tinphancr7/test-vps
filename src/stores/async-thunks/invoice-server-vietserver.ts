import invoiceApi from "@/apis/invoice.api";
import { ProviderIDEnum } from "@/constants/enum";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const asyncThunkPaginationInvoiceServerVietServer = createAsyncThunk<any, any>(
    "/invoice/server/vietserver",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await invoiceApi.callFetchInvoice({
                ...query,
            });

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const asyncThunkDetailInvoiceServerVietServer = createAsyncThunk<any, any>(
    "/invoice/server/vietserver/id",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await invoiceApi.callFetchInvoiceById(id, ProviderIDEnum.VietServer);

            return data?.data[0];
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
