import domainApis, { GetPagingDomains } from "@/apis/domain-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const asyncThunkGetPaginationDomains = createAsyncThunk<any, GetPagingDomains>(
    "/domains",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await domainApis.getPaging(query);

            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

const initialState = {
    domainsList: [],
    isLoading: false,
    total: 0,
    provider: "",
    status: "",
    team: "",
    brand: "",
    createdBy: null,
    manager: [],
    name: "",
};

const domainsSlice = createSlice({
    name: "domains",
    initialState,
    reducers: {
        setTeam: (state, action) => {
            state.team = action.payload;
        },

        setBrand: (state, action) => {
            state.brand = action.payload;
        },

        setName: (state, action) => {
            state.name = action.payload;
        },

        setCreatedBy: (state, action) => {
            state.createdBy = action.payload;
        },

        setManager: (state, action) => {
            state.manager = action.payload;
        },

        setProvider: (state, action) => {
            state.provider = action.payload;
        },

        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkGetPaginationDomains.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(asyncThunkGetPaginationDomains.fulfilled, (state, action) => {
                state.domainsList = action.payload.domains;
                state.total = action.payload.total;

                state.isLoading = false;
            })
            .addCase(asyncThunkGetPaginationDomains.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setTeam,
    setBrand,
    setName,
    setCreatedBy,
    setManager,
    setProvider,
    setStatus,
} = domainsSlice.actions;

export default domainsSlice.reducer;
