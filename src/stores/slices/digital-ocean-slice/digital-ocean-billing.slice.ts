import digitalOceanApi from "@/apis/digital-ocean.api";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface digitalOceanBillingHistoryI {
    billing: Array<any>;
    total: number;
    isLoading: boolean;
    totalAmountPayment: number;
    searchData: object;
}
const initialState: digitalOceanBillingHistoryI = {
    billing: [],
    total: 0,
    totalAmountPayment: 0,
    isLoading: false,
    searchData: {},
};
export const getBillingHistory: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/billing",
    async (query, { rejectWithValue }) => {
        try {
            const response = await digitalOceanApi.billingHistoryDigitalOcean(
                query
            );
            if (response?.data?.status === 1) {
                return response.data;
            }

            return rejectWithValue("Invalid data format");
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
const digitalOceanBillingHistorySlice = createSlice({
    name: "billing-digitalocean",
    initialState,
    reducers: {
        setBillingHistory: (state, action) => {
            state.billing = action.payload;
        },
        setSearchBilling: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pagination Users
            .addCase(getBillingHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBillingHistory.fulfilled, (state, action) => {
                state.billing = action.payload.data.billingHistory;
                state.total = action.payload.data.total;
                state.totalAmountPayment =
                    action.payload.data.totalAmountPayment;

                state.isLoading = false;
            })
            .addCase(getBillingHistory.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setBillingHistory, setSearchBilling } =
    digitalOceanBillingHistorySlice.actions;

export default digitalOceanBillingHistorySlice.reducer;
