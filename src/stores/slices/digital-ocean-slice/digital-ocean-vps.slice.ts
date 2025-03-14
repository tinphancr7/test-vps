import digitalOceanApi from "@/apis/digital-ocean.api";
import { Pagination } from "@/interfaces/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface digitalOceanVPSHistoryI {
    listVPS: Array<any>;
    total: number;
    isLoading: boolean;
    detailVPS: any;
    totalPrice: number;
    search: any;
    listTag: any;
}
const initialState: digitalOceanVPSHistoryI = {
    listVPS: [],
    total: 0,
    isLoading: false,
    detailVPS: {},
    totalPrice: 0,
    search: {},
    listTag: [],
};
export const getListVPS: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/vps",
    async (query, { rejectWithValue }) => {
        try {
            const response = await digitalOceanApi.managementVPSDigitalOcean(
                query
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getDetailVPS: any = createAsyncThunk<Pagination, any>(
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

export const getListTag: any = createAsyncThunk<Pagination, any>(
    "digital-ocean/tags/get",
    async (_id, { rejectWithValue }) => {
        try {
            const response = await digitalOceanApi.getListTag();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
const digitalOceanVPSSlice = createSlice({
    name: "billing-digitalocean",
    initialState,
    reducers: {
        setListVPS: (state, action) => {
            state.listVPS = action.payload;
        },
        setDetailVPS: (state, action) => {
            state.detailVPS = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pagination Users
            .addCase(getListVPS.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListVPS.fulfilled, (state, action) => {
                state.listVPS = action.payload.data.listVPS;
                state.total = action.payload.data.total;
                state.totalPrice = action.payload.data.totalPrice;
                state.isLoading = false;
            })
            .addCase(getListVPS.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(getDetailVPS.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDetailVPS.fulfilled, (state, action) => {
                state.detailVPS = action.payload;
                state.isLoading = false;
            })
            .addCase(getDetailVPS.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(getListTag.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListTag.fulfilled, (state, action) => {
                console.log(action);
                state.listTag = action.payload;
                state.isLoading = false;
            })
            .addCase(getListTag.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setListVPS, setDetailVPS, setSearch } =
    digitalOceanVPSSlice.actions;

export default digitalOceanVPSSlice.reducer;
