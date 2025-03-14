import { createSlice } from "@reduxjs/toolkit";

interface ForwardingRule {
  entry_protocol: string;
  entry_port: number;
  target_protocol: string;
  target_port: number;
}

interface DigitalOceanForwardingRule {
  forwarding_rules: ForwardingRule[];
}

const initialState: DigitalOceanForwardingRule = {
  forwarding_rules: [
    {
      entry_protocol: "http",
      entry_port: 80,
      target_protocol: "http",
      target_port: 80,
    },
  ],
};

const digitalOceanForwardingRule = createSlice({
  name: "digitalOcean_LB_ForwardingRule",
  initialState,
  reducers: {
    setDataLBForwardingRuleDigitalOcean: (state: any, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setDataLBForwardingRuleDigitalOcean } =
  digitalOceanForwardingRule.actions;

export default digitalOceanForwardingRule.reducer;
