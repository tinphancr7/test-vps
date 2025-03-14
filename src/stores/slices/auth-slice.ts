import permissionApis from "@/apis/permission-apis";
import { clearLS, getAccessTokenFromLS } from "@/utils/auth";
import { getStateLocalStorage } from "@/utils/get-state-lc-storage";
import { setStateLocalStorage } from "@/utils/set-state-lc-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: Boolean(getAccessTokenFromLS()),
  user: getStateLocalStorage("user"),
  permissions: [],
  isLoading: true,
};
export const fetchPermissionsByRoleId = createAsyncThunk(
  "auth/fetchPermissions",
  async (id: string) => {
    const response = await permissionApis.getPermissionByRoleId(id);

    return response?.data?.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.user = action.payload;
      state.permissions = action.payload?.permissions;
    },

    logout: (state) => {
      state.isAuth = false;
      state.user = null;

      clearLS();
    },

    setSecret2FA: (state, action) => {
		const payload = {
			...getStateLocalStorage("user"),
			secret_2fa: action.payload,
		};

		setStateLocalStorage("user", payload);		
		state.user = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Permission By Role Id
      .addCase(fetchPermissionsByRoleId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPermissionsByRoleId.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPermissionsByRoleId.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { login, logout, setSecret2FA } = authSlice.actions;

export default authSlice.reducer;
