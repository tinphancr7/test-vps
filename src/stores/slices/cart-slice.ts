import cartApis from "@/apis/cart-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncThunkGetCartInfo = createAsyncThunk<any>(
    "/carts",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await cartApis.getCartInfo();

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export enum DomainProviderNameEnum {
    DYNADOT = "dynadot",
    GNAME = "gname",
    NAME = "name",
    EPIK = "epik",
    GODADDY = "godaddy",
    NAME_CHEAP = "name-cheap",
}

const initialState = {
    domains: [],
    isLoading: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.domains = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkGetCartInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(asyncThunkGetCartInfo.fulfilled, (state, action) => {
                state.domains = action.payload.cart?.cartInfo?.map(
                    (it: any) => ({
                        domainProvider: it?.domainProvider,
                        domain: it?.domain,
                        price: it?.price,
                        renewal: it?.renewal,
                    })
                );

                state.isLoading = false;
            })
            .addCase(asyncThunkGetCartInfo.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
