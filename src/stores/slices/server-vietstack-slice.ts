import { createSlice } from "@reduxjs/toolkit";
import { ServerVietStackState } from "@/interfaces/server-vietstack-state";
import { asyncThunkPaginationServerVietStack } from "../async-thunks/server-vietstack-thunk";

const initialState: ServerVietStackState = {
    serverList: [],
    total: 0,
    isLoading: false,
    isSubmitting: false,
}

const vpsVngSlice = createSlice({
    name: 'serverVietStack',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncThunkPaginationServerVietStack.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkPaginationServerVietStack.fulfilled,
                (state, action) => {
                    state.serverList = action.payload.data;
                    state.total = action.payload.total;
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkPaginationServerVietStack.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

// export const { setUsers } = vpsVngSlice.actions;

export default vpsVngSlice.reducer;