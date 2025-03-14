import { createSlice } from "@reduxjs/toolkit";
import {
  asyncThunkCreateNewUser,
  asyncThunkDeleteUser,
  asyncThunkPaginationUsers,
  asyncThunkUpdateUser,
  asyncThunkGetAllUsers,
} from "../async-thunks/user-thunk";
import { UsersState } from "@/interfaces/users-state";

const initialState: UsersState = {
  users: [],
  total: 0,
  isLoading: false,
  isSubmitting: false,
};

const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pagination Users
      .addCase(asyncThunkPaginationUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkPaginationUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.isLoading = false;
      })
      .addCase(asyncThunkPaginationUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(asyncThunkGetAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncThunkGetAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.isLoading = false;
      })
      .addCase(asyncThunkGetAllUsers.rejected, (state) => {
        state.users = [];
        state.isLoading = false;
      })

      // Create New User
      .addCase(asyncThunkCreateNewUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(asyncThunkCreateNewUser.fulfilled, (state, action) => {
        const newUsers = [action.payload?.user, ...state.users].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          // Check if both dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // Default sort if dates are invalid
          }

          return dateB.getTime() - dateA.getTime();
        });

        state.users = newUsers;
        state.total = state.total + 1;
        state.isSubmitting = false;
      })
      .addCase(asyncThunkCreateNewUser.rejected, (state) => {
        state.isSubmitting = false;
      })

      // Update User
      .addCase(asyncThunkUpdateUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(asyncThunkUpdateUser.fulfilled, (state, action) => {
        const newUsers = state?.users
          ?.map((user) => {
            if (user?._id === action.payload?.user?._id) {
              return action.payload?.user;
            }

            return user;
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            // Check if both dates are valid
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0; // Default sort if dates are invalid
            }

            return dateB.getTime() - dateA.getTime();
          });

        state.users = newUsers;
        state.isSubmitting = false;
      })
      .addCase(asyncThunkUpdateUser.rejected, (state) => {
        state.isSubmitting = false;
      })

      // Delete User
      .addCase(asyncThunkDeleteUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(asyncThunkDeleteUser.fulfilled, (state, action) => {
        const newUsers = state?.users
          .filter((user) => user?._id !== action?.payload.user)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            // Check if both dates are valid
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0; // Default sort if dates are invalid
            }

            return dateB.getTime() - dateA.getTime();
          });

        state.users = newUsers;
        state.total = state.total - 1;
        state.isSubmitting = false;
      })
      .addCase(asyncThunkDeleteUser.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const { setUsers } = authSlice.actions;

export default authSlice.reducer;
