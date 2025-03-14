import { Selection, SortDescriptor } from "@heroui/react";
import { Key } from "react";

export interface TableState {
    pageIndex: number | string;
    pageSize: Set<Key>;
    selectedKeys?: Selection | undefined;
    sortDescriptor: SortDescriptor;
    sortFields: {
        [key: string]: number;
    };
}
