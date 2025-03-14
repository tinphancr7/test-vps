import { UserSchema } from "./user-schema";

export interface TeamSchema {
    _id: string;
    name: string;
    user: string | UserSchema;
    isDelete: boolean;
    managers: Array<string | UserSchema>;
}