import { createSlice } from "@reduxjs/toolkit";

interface AddStorageI {
  name: string;
  size_gigabytes: number;
  filesystem_type: string;
  price_monthly: number;
}
interface DigitalAddStorage {
  addStorage: AddStorageI;
  statusCustomStorage: string;
  isSelectedCustomStorage: boolean;
  isSelectAddStorage: boolean;
}
const initialState: DigitalAddStorage = {
  addStorage: {
    name: "",
    size_gigabytes: 0,
    filesystem_type: "ext4",
    price_monthly: 0,
  },
  statusCustomStorage: "IDLE",
  isSelectedCustomStorage: false,
  isSelectAddStorage: false,
};

const digitalOceanAddStorageSlice = createSlice({
  name: "digitalOceanAddStorageSlice",
  initialState,
  reducers: {
    setDataAddStorageDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataAddStorageDigitalOcean } =
  digitalOceanAddStorageSlice.actions;

export default digitalOceanAddStorageSlice.reducer;
