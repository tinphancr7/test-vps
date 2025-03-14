import userApis from "@/apis/user-api";
import showToast from "@/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Pagination = {
  total: number;
  users: Array<any>;
};

type PayloadUser = {
  status: number;
  user: any;
};

export const asyncThunkPaginationUsers = createAsyncThunk<Pagination, any>(
  "/users/get-paging-users",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await userApis.getPaginationUsers(query);

      if (data?.status === 1) {
        return {
          total: data?.total,
          users: data?.users,
        } as Pagination;
      }

      return rejectWithValue("Invalid data format");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const asyncThunkGetAllUsers = createAsyncThunk<{ users: Array<any> }>(
  "/users/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userApis.getAllUser();

      if (data?.status === 1) {
        return {
          users: data?.data,
        };
      }

      return rejectWithValue("Invalid data format");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asyncThunkCreateNewUser = createAsyncThunk<PayloadUser, any>(
  "/users/create",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await userApis.createNewUser(query);

      if (data?.status === 1) {
        showToast("Thêm nhân sự mới thành công!", "success");

        return {
          status: data?.status,
          user: data?.user,
        } as PayloadUser;
      }

      return rejectWithValue("Invalid data format");
    } catch (error: any) {
      switch (error?.response?.data?.status) {
        case 5:
          showToast("Tên Đăng Nhập Đã Tồn Tại!", "error");
          break;

        case 6:
          showToast("Email Đã Tồn Tại!", "error");
          break;

        default:
          showToast("Thêm tài khoản mới thất bại!", "error");
      }

      return rejectWithValue(error);
    }
  }
);

export const asyncThunkUpdateUser = createAsyncThunk<PayloadUser, any>(
  "/users/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await userApis.updateUser(id, payload);

      if (data?.status === 1) {
        showToast("Cập nhật thông tin nhân sự thành công!", "success");

        return {
          status: data?.status,
          user: data?.user,
        } as PayloadUser;
      }

      return rejectWithValue("Invalid data format");
    } catch (error: any) {
      switch (error?.response?.data?.status) {
        case 5:
          showToast("Tên Đăng Nhập Đã Tồn Tại!", "error");
          break;

        case 6:
          showToast("Email Đã Tồn Tại!", "error");
          break;

        default:
          showToast("Cập nhật thông tin thất bại!", "error");
      }

      return rejectWithValue(error);
    }
  }
);

export const asyncThunkDeleteUser = createAsyncThunk<PayloadUser, any>(
  "/users/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await userApis.deleteUser(id);

      if (data?.status === 1) {
        showToast("Xóa nhân sự thành công!", "success");

        return {
          status: data?.status,
          user: id,
        } as PayloadUser;
      }

      return rejectWithValue("Invalid data format");
    } catch (error: any) {
      showToast("Xóa nhân sự thất bại!", "error");

      return rejectWithValue(error);
    }
  }
);
