// src/store/slices/planSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchPlans } from "@/stores/async-thunks/up-cloud.thunk";
import { PlanGroup } from "@/interfaces/upcloud-response.interface";

interface PlanState {
  plans: PlanGroup[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  plans: null,
  loading: false,
  error: null,
};

// Helper function to sort plans
const sortPlans = (plans: PlanGroup[]): PlanGroup[] => {
  const priority = { DEV: 1, General: 2, HICPU: 3, HIMEM: 4 };
  return plans.sort((a, b) => {
    const priorityA = priority[a.type as keyof typeof priority] || 5;
    const priorityB = priority[b.type as keyof typeof priority] || 5;
    return priorityA - priorityB;
  });
};

// Async thunk to fetch plans from the API

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<PlanGroup[]>) => {
      state.plans = sortPlans(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = sortPlans(action.payload);
        state.loading = false;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPlans } = planSlice.actions;
export default planSlice.reducer;
