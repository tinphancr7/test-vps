import { TableState } from "./table-state";

export interface TableStore {
    [tableId: string]: TableState;
}