import { createSlice } from "@reduxjs/toolkit";
import { asyncThunkGetDetailVmServiceByVpsId } from "../async-thunks/detail-vps-thunk";
import { DetailVpsState } from "@/interfaces/detail-vps-state";

const initialState: DetailVpsState = {
    service: {},
    vm: {},
    userAaPanel: "",
    passWorkAaPanel: "",
    uRLAaPanel: "",
    total: 0,
    isLoading: false,
    isSubmitting: false,
}

const detailVpsSlice = createSlice({
    name: 'detailVps',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Detail Vps
            .addCase(asyncThunkGetDetailVmServiceByVpsId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                asyncThunkGetDetailVmServiceByVpsId.fulfilled,
                (state, action) => {
                    state.service = action.payload.service;
                    state.vm = action.payload.vm;
                    state.userAaPanel = action.payload.userAaPanel || "";
                    state.passWorkAaPanel = action.payload.passWorkAaPanel || "";
                    state.uRLAaPanel = action.payload.uRLAaPanel || "";
                    state.isLoading = false;
                }
            )
            .addCase(asyncThunkGetDetailVmServiceByVpsId.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

// export const { setUsers } = detailVpsSlice.actions;

export default detailVpsSlice.reducer;