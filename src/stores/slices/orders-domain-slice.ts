import ordersDomainApis, { GetPagingOrdersDomain } from "@/apis/order-domain-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncThunkGetPaginationOrdersDomain = createAsyncThunk<any, GetPagingOrdersDomain>(
    "/orders-domain",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await ordersDomainApis.getPagination(query);

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    ordersList: [],
    isLoading: false,
    total: 0,
    teamSelected: "",
    brandSelected: "",
    searchByCode: "",
};

const ordersDomainSlice = createSlice({
    name: "ordersDomain",
    initialState,
    reducers: {
        setTeamSelected: (state, action) => {
            state.teamSelected = action.payload;
        },

        setBrandSelected: (state, action) => {
            state.brandSelected = action.payload;
        },

        setSearchByCode: (state, action) => {
            state.searchByCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkGetPaginationOrdersDomain.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(asyncThunkGetPaginationOrdersDomain.fulfilled, (state, action) => {
                state.ordersList = action.payload.orders;
                state.total = action.payload.total;

                state.isLoading = false;
            })
            .addCase(asyncThunkGetPaginationOrdersDomain.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setTeamSelected, setBrandSelected, setSearchByCode } = ordersDomainSlice.actions;

export default ordersDomainSlice.reducer;
