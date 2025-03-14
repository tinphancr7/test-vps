import ordersDomainStatusApis, { GetPagingOrderDomainStatus } from "@/apis/order-domain-status-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncThunkGetPaginationOrdersDomainStatus = createAsyncThunk<any, GetPagingOrderDomainStatus>(
    "/orders-domain-status",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await ordersDomainStatusApis.getPagination(query);

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    orderStatusesList: [],
    isLoading: false,
    total: 0,
    search: "",
};

const ordersDomainStatusSlice = createSlice({
    name: "ordersDomainStatus",
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkGetPaginationOrdersDomainStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(asyncThunkGetPaginationOrdersDomainStatus.fulfilled, (state, action) => {
                state.orderStatusesList = action.payload.orderStatuses;
                state.total = action.payload.total;

                state.isLoading = false;
            })
            .addCase(asyncThunkGetPaginationOrdersDomainStatus.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setSearch } = ordersDomainStatusSlice.actions;

export default ordersDomainStatusSlice.reducer;
