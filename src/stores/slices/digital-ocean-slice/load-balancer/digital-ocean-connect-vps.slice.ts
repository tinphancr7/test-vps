import { createSlice } from "@reduxjs/toolkit";

interface DigitalOceanConnectVPS {
    listVPSInRegion: [];
    selectedVPSInRegion: [];
}
const initialState: DigitalOceanConnectVPS = {
    listVPSInRegion: [],
    selectedVPSInRegion: [],
};

const digitalOceanLBConnectVPS = createSlice({
    name: "digitalOcean_LB_ConnectVPS",
    initialState,
    reducers: {
        setDataLBConnectVPSDigitalOcean: (state: any, action) => {
            Object.keys(action.payload).forEach((key) => {
                if (action.payload[key] !== undefined) {
                    state[key] = action.payload[key];
                }
            });
        },
    },
});

export const { setDataLBConnectVPSDigitalOcean } =
    digitalOceanLBConnectVPS.actions;

export default digitalOceanLBConnectVPS.reducer;
