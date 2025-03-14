import { RoleSchema } from "./role-schema";

export interface PermissionSchema {
	role: RoleSchema;
	action: Array<string>;
	subject: string;
}