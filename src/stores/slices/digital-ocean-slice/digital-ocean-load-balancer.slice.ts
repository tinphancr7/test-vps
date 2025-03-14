import digitalOceanApi from "@/apis/digital-ocean.api";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface digitalOceanLoadBalancer {
    listLoadBalancer: Array<any>;
    total: number;
    isLoading: boolean;
    search: any;
}
const initialState: digitalOceanLoadBalancer = {
    listLoadBalancer: [],
    total: 0,
    isLoading: false,
    search: {},
};
export const getListLoadBalancer: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/balancer/get",
    async (query, { rejectWithValue }) => {
        try {
            const response =
                await digitalOceanApi.managementLoadBalancerDigitalOcean(query);
            if (response?.data?.status === 1) {
                return response.data;
            }
            return rejectWithValue("Invalid data format");
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
const digitalOceanLoadBalancerSlice = createSlice({
    name: "billing-digitalocean",
    initialState,
    reducers: {
        setListLoadBalancer: (state, action) => {
            state.listLoadBalancer = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pagination Users
            .addCase(getListLoadBalancer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListLoadBalancer.fulfilled, (state, action) => {
                state.listLoadBalancer = action.payload.data.listLoadBalancer;
                state.total = action.payload.data.total;
                state.isLoading = false;
            })
            .addCase(getListLoadBalancer.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setListLoadBalancer, setSearch } =
    digitalOceanLoadBalancerSlice.actions;

export default digitalOceanLoadBalancerSlice.reducer;
