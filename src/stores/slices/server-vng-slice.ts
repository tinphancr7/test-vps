import { createSlice } from "@reduxjs/toolkit";
import { ServerVngState } from "@/interfaces/server-vng-state";
import { asyncThunkPaginationServerVng } from "../async-thunks/server-vng-thunk";

const initialState: ServerVngState = {
    serverList: [],
    total: 0,
    isLoading: false,
    isSubmitting: false,
}

const vpsVngSlice = createSlice({
    name: 'serverVng',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkPaginationServerVng.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkPaginationServerVng.fulfilled,
                (state, action) => {
                    state.serverList = action.payload.data;
                    state.total = action.payload.total;
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkPaginationServerVng.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

// export const { setUsers } = vpsVngSlice.actions;

export default vpsVngSlice.reducer;