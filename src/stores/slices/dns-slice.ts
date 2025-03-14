import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkGetDnsListCloudflare } from "../async-thunks/dns-thunk";

const initialState = {
    dnsList: [],
	dns: null,
    totalDnsList: 0,
	searchValue: "",
    isLoading: false,
};

const dnsSlice = createSlice({
    name: "dns",
    initialState,
    reducers: {
		setSearchValue: (state, action) => {
			state.searchValue = action.payload;
		},
	},
    extraReducers: (builder) => {
        builder
            // Get DNS List
            .addCase(asyncThunkGetDnsListCloudflare.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkGetDnsListCloudflare.fulfilled,
                (state, action) => {
                    state.dnsList = action.payload?.result || [];
                    state.totalDnsList = action.payload?.result_info?.totalCount || 0;
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkGetDnsListCloudflare.rejected, (state) => {
                state.isLoading = false;
            })

    },
});

export const { setSearchValue } = dnsSlice.actions;

export default dnsSlice.reducer;
