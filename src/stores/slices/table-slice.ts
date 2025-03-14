import { TableState } from "@/interfaces/table-state";
import { SortDescriptor } from "@heroui/react";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, TableState> = {};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    initializeTableState: (state, action) => {
      const { tableId } = action.payload;

      if (!state[tableId]) {
        state[tableId] = {
          pageIndex: 1,
          pageSize: new Set(["10"]),
          selectedKeys: new Set([]),
          sortDescriptor: {
            column: "",
            //@ts-ignore
            direction: undefined,
          },
          sortFields: {},
        };
      }
    },

    setTablePageIndex: (state, action) => {
      const { tableId, pageIndex } = action.payload;

      if (state[tableId]) {
        state[tableId].pageIndex = pageIndex;
      }
    },

    setTablePageSize: (state, action) => {
      const { tableId, pageSize } = action.payload;

      if (state[tableId]) {
        state[tableId].pageSize = pageSize;
      }
    },

    setTableSelectedKeys: (state, action) => {
      const { tableId, selectedKeys } = action.payload;

      if (state[tableId]) {
        state[tableId].selectedKeys = selectedKeys;
      }
    },

    setSortDescriptor: (state, action) => {
      const { tableId, sortDescriptor } = action.payload;

      if (state[tableId]) {
        const direction = sortDescriptor?.direction === "descending" ? -1 : 1;

        state[tableId].sortDescriptor = sortDescriptor as SortDescriptor;
        state[tableId].sortFields[sortDescriptor?.column as string] = direction;
      }
    },

    resetTableState: (state, action) => {
      const { tableId } = action.payload;

      if (state[tableId]) {
        state[tableId].pageIndex = 1;
        state[tableId].pageSize = new Set(["10"]);
        state[tableId].selectedKeys = new Set([]);
        state[tableId].sortDescriptor = {
          column: "",
          //@ts-ignore
          direction: undefined,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase("resetState", (state) => {
      Object.keys(state).forEach((tableId) => {
        state[tableId] = {
          pageIndex: 1,
          pageSize: new Set(["10"]),
          selectedKeys: new Set([]),
          sortDescriptor: {
            column: "",
            //@ts-ignore
            direction: undefined,
          },
          sortFields: {},
        };
      });
    });
  },
});

export const {
  initializeTableState,
  setTablePageIndex,
  setTablePageSize,
  setTableSelectedKeys,
  setSortDescriptor,
  resetTableState,
} = tableSlice.actions;

export default tableSlice.reducer;
