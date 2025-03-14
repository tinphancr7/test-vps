// src/store/slices/resourcePlanSlice.ts
import { ResourcePlan } from "@/interfaces/upcloud-response.interface";
import { fetchResourcePlans } from "@/stores/async-thunks/up-cloud.thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResourcePlanState {
  resourcePlans: ResourcePlan[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourcePlanState = {
  resourcePlans: [],
  loading: false,
  error: null,
};

const resourcePlanSlice = createSlice({
  name: "resourcePlans",
  initialState,
  reducers: {
    setResourcePlans: (state, action: PayloadAction<ResourcePlan[]>) => {
      state.resourcePlans = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourcePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourcePlans.fulfilled, (state, action) => {
        state.resourcePlans = action.payload;
        state.loading = false;
      })
      .addCase(fetchResourcePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setResourcePlans } = resourcePlanSlice.actions;
export default resourcePlanSlice.reducer;
