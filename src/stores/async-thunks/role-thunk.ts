import permissionApis from "@/apis/permission-apis";
import roleApis from "@/apis/role-apis";
import {createAsyncThunk} from "@reduxjs/toolkit";

type PayloadGetAllRoles = {
	roles: Array<any>;
};

type PayloadGetPermissionsRole = {
	permissionsRole: Array<any>;
};

type PayloadPermissionsRole = {
	status: number;
	role: any;
};

type PayloadDeleteRole = {
	_id: string;
	status: number;
};

export const asyncThunkGetAllRoles = createAsyncThunk<PayloadGetAllRoles>(
	"/permissions/get-all-roles",
	async (_, {rejectWithValue}) => {
		try {
			const {data} = await roleApis.getAllRoles();

			if (data?.status === 1) {
				return {
					roles: data?.data,
				} as PayloadGetAllRoles;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkGetPermissionsByRoleId = createAsyncThunk<
	PayloadGetPermissionsRole,
	any
>(
	"/permissions/get-permissions-by-role-id",
	async (query, {rejectWithValue}) => {
		try {
			const {data} = await permissionApis.getPermissionByRoleId(query);

			if (data?.status === 1) {
				return {
					permissionsRole: data?.data,
				} as PayloadGetPermissionsRole;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkCreateNewRole = createAsyncThunk<
	PayloadPermissionsRole,
	any
>(
	"/permissions/create-new-permission-role",
	async (query, {rejectWithValue}) => {
		try {
			const {data} = await permissionApis.createNewRole(query);

			if (data?.status === 1) {
				return {
					status: data?.status,
					role: data?.data?.role,
				} as PayloadPermissionsRole;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkUpdatePermissionRole = createAsyncThunk<
	PayloadPermissionsRole,
	any
>(
	"/permissions/update-permission-role",
	async ({id, payload}, {rejectWithValue}) => {
		try {
			const {data} = await permissionApis.updatePermissionRole(id, payload);

			if (data?.status === 1) {
				return {
					status: data?.status,
					role: data?.data?.role,
				} as PayloadPermissionsRole;
			}

			return rejectWithValue("Invalid data format");
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const asyncThunkDeleteRoleById = createAsyncThunk<
	PayloadDeleteRole,
	any
>("/permissions/delete-role", async (id, {rejectWithValue}) => {
	try {
		const {data} = await roleApis.deleteRole(id);

		if (data?.status === 1) {
			return {
				_id: id,
				status: data?.status,
			} as PayloadDeleteRole;
		}
		return rejectWithValue("Invalid data format");
	} catch (error) {
		return rejectWithValue(error);
	}
});
