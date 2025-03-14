import { createServer } from "@/stores/async-thunks/up-cloud.thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ServerState {
  data: any | null; // Server data, can be typed specifically if known
  loading: boolean;
  error: string | null;
}

const initialState: ServerState = {
  data: null,
  loading: false,
  error: null,
};

const createServerSlice = createSlice({
  name: "create-server",
  initialState,
  reducers: {
    // Optional additional reducers can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServer.fulfilled, (state, action: PayloadAction<any>) => {
        toast.success("Tạo Vps thành công!");
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(createServer.rejected, (state, action: any) => {
        if (action.payload?.response?.data?.status === 18) {
          toast.info("Vui lòng tạo tài khoản VPS!");
        } else if (action.payload?.response?.data?.status === 27) {
          toast.error("Số dư tài khoản không đủ vui lòng nạp và thử lại!");
        } else if (action.payload?.response?.data?.status === 21) {
          toast.error("Api Key tài khoản đã hết hạn vui lòng liên hệ admin!");
        } else {
          toast.error("Lỗi máy chủ vui lòng thử lại sau!");
        }

        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default createServerSlice.reducer;
