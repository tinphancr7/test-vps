import { RolesState } from "@/interfaces/roles-state";
import { createSlice } from "@reduxjs/toolkit";
import {
	asyncThunkCreateNewRole,
	asyncThunkDeleteRoleById,
	asyncThunkGetAllRoles,
	asyncThunkGetPermissionsByRoleId,
	asyncThunkUpdatePermissionRole,
} from "../async-thunks/role-thunk";

const initialState: RolesState = {
	roles: [],
	role: {},
	permissions: [],
	total: 0,
	isLoading: false,
	isSubmitting: false,
};

const rolesSlice = createSlice({
	name: "roles",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get All Roles
			.addCase(asyncThunkGetAllRoles.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				asyncThunkGetAllRoles.fulfilled,
				(state, action) => {
					state.roles = action.payload.roles;
					state.isLoading = false;
				}
			)
			.addCase(asyncThunkGetAllRoles.rejected, (state) => {
				state.isLoading = false;
			})

			// Get Permission By Role Id
			.addCase(asyncThunkGetPermissionsByRoleId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				asyncThunkGetPermissionsByRoleId.fulfilled,
				(state, action) => {
					state.permissions = action.payload.permissionsRole;
					state.isLoading = false;
				}
			)
			.addCase(asyncThunkGetPermissionsByRoleId.rejected, (state) => {
				state.isLoading = false;
			})

			// Create New Permission Role
			.addCase(asyncThunkCreateNewRole.pending, (state) => {
				state.isSubmitting = true;
			})
			.addCase(asyncThunkCreateNewRole.fulfilled, (state, action) => {
				const newRoles: Array<any> = [
					action.payload?.role,
					...state.roles,
				].sort((a, b) => {
					const dateA = new Date(a.createdAt);
					const dateB = new Date(b.createdAt);

					// Check if both dates are valid
					if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
						return 0; // Default sort if dates are invalid
					}

					return dateB.getTime() - dateA.getTime();
				});

				state.roles = newRoles;
				state.total = state.total + 1;
				state.isSubmitting = false;
			})
			.addCase(asyncThunkCreateNewRole.rejected, (state) => {
				state.isSubmitting = false;
			})

			// Update Permission Role
			.addCase(asyncThunkUpdatePermissionRole.pending, (state) => {
				state.isSubmitting = true;
			})
			.addCase(
				asyncThunkUpdatePermissionRole.fulfilled,
				(state, action) => {
					const roleUpdated = action.payload?.role;

					const newRoles = state.roles?.map((role) =>
						role?._id === roleUpdated?._id ? roleUpdated : role
					);

					state.roles = newRoles;
					state.isSubmitting = false;
				}
			)
			.addCase(asyncThunkUpdatePermissionRole.rejected, (state) => {
				state.isSubmitting = false;
			})

			// Delete Role
			.addCase(asyncThunkDeleteRoleById.pending, (state) => {
				state.isSubmitting = true;
			})
			.addCase(asyncThunkDeleteRoleById.fulfilled, (state, action) => {
				const newRoles: Array<any> = state?.roles
					?.filter((role) => role?._id !== action.payload?._id)
					.sort((a, b) => {
						const dateA = new Date(a.createdAt);
						const dateB = new Date(b.createdAt);

						// Check if both dates are valid
						if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
							return 0; // Default sort if dates are invalid
						}

						return dateB.getTime() - dateA.getTime();
					});

				state.roles = newRoles;
				state.isSubmitting = false;
			})
			.addCase(asyncThunkDeleteRoleById.rejected, (state) => {
				state.isSubmitting = false;
			});
	},
});

export default rolesSlice.reducer;
