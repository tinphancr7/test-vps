import brandApis from "@/apis/brand-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncThunkPaginationBrands = createAsyncThunk<any, any>(
    "/brand/get-paging",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await brandApis.getPaging(query);

            return {
                data: data?.result,
                total: data?.counts,
            } as any;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const asyncThunkGetAllBrands = createAsyncThunk<any>(
    "/brand/get-all",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await brandApis.getAll();

            return {
                data: data?.brands,
            } as any;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    brandsList: [],
    brands: [],
    total: 0,
    isLoading: false,
    isSubmitting: false,
    search: "",
};

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkPaginationBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkPaginationBrands.fulfilled,
                (state, action) => {
                    state.brandsList = action.payload.data;
                    state.total = action.payload.total;
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkPaginationBrands.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(asyncThunkGetAllBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkGetAllBrands.fulfilled,
                (state, action) => {
                    state.brands = action.payload.data;
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkGetAllBrands.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setSearch } = brandSlice.actions;

export default brandSlice.reducer;
