import digitalOceanApi from "@/apis/digital-ocean.api";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface digitalOceanVPSHistoryI {
    listVPS: Array<any>;
    total: number;
    isLoading: boolean;
    detailVPS: any;
    totalPrice: number;
}
const initialState: digitalOceanVPSHistoryI = {
    listVPS: [],
    total: 0,
    isLoading: false,
    detailVPS: {},
    totalPrice: 0,
};
export const getListVPSBuCloud: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/vps",
    async (query, { rejectWithValue }) => {
        try {
            const response =
                await digitalOceanApi.managementVPSDigitalOceanBuCloud({
                    ...query,
                    type: "bu_cloud",
                });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getDetailVPSBuCloud: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/vps/detail",
    async (_id, { rejectWithValue }) => {
        try {
            const response = await digitalOceanApi.detailVPSDigitalOcean(_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
const digitalOceanVPSBuCloudSlice = createSlice({
    name: "billing-digitalocean",
    initialState,
    reducers: {
        setListVPS: (state, action) => {
            state.listVPS = action.payload;
        },
        setDetailVPS: (state, action) => {
            state.detailVPS = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pagination Users
            .addCase(getListVPSBuCloud.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListVPSBuCloud.fulfilled, (state, action) => {
                state.listVPS = action.payload.data.listVPS;
                state.total = action.payload.data.total;
                state.totalPrice = action.payload.data.totalPrice;
                state.isLoading = false;
            })
            .addCase(getListVPSBuCloud.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(getDetailVPSBuCloud.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDetailVPSBuCloud.fulfilled, (state, action) => {
                state.detailVPS = action.payload;
                state.isLoading = false;
            })
            .addCase(getDetailVPSBuCloud.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setListVPS, setDetailVPS } = digitalOceanVPSBuCloudSlice.actions;

export default digitalOceanVPSBuCloudSlice.reducer;
