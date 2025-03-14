import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IpWhiteListState {
  isIpAllowed: boolean | null;
  errorMessage: string | null;
  statusMessageCode: number | null;
}

const initialState: IpWhiteListState = {
  isIpAllowed: null,
  errorMessage: null,
  statusMessageCode: null,
};

const ipWhiteListSlice = createSlice({
  name: "ipWhiteList",
  initialState,
  reducers: {
    setIpAllowed: (state, action: PayloadAction<boolean>) => {
      state.isIpAllowed = action.payload;
    },
    setIpErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setIpStatusMessage(state, action: PayloadAction<number>) {
      state.statusMessageCode = action.payload;
    },
    resetIpAllowed: (state) => {
      state.isIpAllowed = null;
    },
  },
});

export const {
  setIpAllowed,
  setIpErrorMessage,
  setIpStatusMessage,
  resetIpAllowed,
} = ipWhiteListSlice.actions;

export default ipWhiteListSlice.reducer;
