// src/store/slices/storageSlice.ts
import { StorageUpCloud } from "@/interfaces/upcloud-response.interface";
import { fetchStorages } from "@/stores/async-thunks/up-cloud.thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StorageState {
  storages: StorageUpCloud[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: StorageState = {
  storages: null,
  loading: false,
  error: null,
};

const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setStorages(state, action: PayloadAction<StorageUpCloud[]>) {
      state.storages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStorages.fulfilled, (state, action) => {
        state.storages = action.payload;
        state.loading = false;
      })
      .addCase(fetchStorages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStorages } = storageSlice.actions;
export default storageSlice.reducer;
