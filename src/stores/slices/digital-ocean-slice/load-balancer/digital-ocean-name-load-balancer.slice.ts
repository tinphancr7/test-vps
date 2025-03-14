import { createSlice } from "@reduxjs/toolkit";

interface DigitalOceanNameLoadBalancer {
    nameLoadBalancer: string;
    isValidName: boolean;
    team_id: string;
}
const initialState: DigitalOceanNameLoadBalancer = {
    nameLoadBalancer: "",
    isValidName: false,
    team_id: "",
};
const digitalOceanNameLoadBalancer = createSlice({
    name: "digitalOceanNameLoadBalancerSlice",
    initialState,
    reducers: {
        setDataLBNameDigitalOcean: (state: any, action) => {
            Object.keys(action.payload).forEach((key) => {
                if (action.payload[key] !== undefined) {
                    state[key] = action.payload[key];
                }
            });
        },
    },
});

export const { setDataLBNameDigitalOcean } =
    digitalOceanNameLoadBalancer.actions;

export default digitalOceanNameLoadBalancer.reducer;
