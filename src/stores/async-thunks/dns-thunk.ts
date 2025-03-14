import cloudflareApis, { GetPagingDns } from "@/apis/cloudflare-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const asyncThunkGetDnsListCloudflare =
    createAsyncThunk<any, GetPagingDns>(
        "/cloudflare-dns",
        async (query, { rejectWithValue }) => {
            try {
                const { data } = await cloudflareApis.getDnsList(query);

                return data;
            } catch (error) {
                return rejectWithValue(error);
            }
        }
    );
