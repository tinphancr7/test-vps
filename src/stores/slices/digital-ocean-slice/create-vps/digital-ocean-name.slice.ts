import { createSlice } from "@reduxjs/toolkit";

interface DigitalOceanNameVPS {
  nameVPS: string;
  isValidName: boolean;
}
const initialState: DigitalOceanNameVPS = {
  nameVPS: "",
  isValidName: false,
};
const digitalOceanNameVPSSlice = createSlice({
  name: "digitalOceanImageSlice",
  initialState,
  reducers: {
    setDataNameVPSDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataNameVPSDigitalOcean } = digitalOceanNameVPSSlice.actions;

export default digitalOceanNameVPSSlice.reducer;
