import { RoleSchema } from "./role-schema";
import { TeamSchema } from "./team-schema";

export interface UserSchema {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string | RoleSchema;
  isDelete: boolean;
  teams: Array<string | TeamSchema>;
  listIp: Array<string>;
}
