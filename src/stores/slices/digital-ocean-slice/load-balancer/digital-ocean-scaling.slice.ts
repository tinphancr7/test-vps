import { createSlice } from "@reduxjs/toolkit";

interface DigitalOceanLoadBalancerScaling {
  valueOfNode: number;
  statusValueNode: boolean;
}
const initialState: DigitalOceanLoadBalancerScaling = {
  valueOfNode: 2,
  statusValueNode: true,
};

const digitalOceanLBScalingSlice = createSlice({
  name: "digitalOcean_LB_ScalingSlice",
  initialState,
  reducers: {
    setDataLBScalingDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataLBScalingDigitalOcean } =
  digitalOceanLBScalingSlice.actions;

export default digitalOceanLBScalingSlice.reducer;
