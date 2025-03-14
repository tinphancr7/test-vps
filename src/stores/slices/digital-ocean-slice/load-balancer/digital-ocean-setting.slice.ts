import digitalOceanApi from "@/apis/digital-ocean.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DigitalOceanEditLoadBalancer {
    hiddenButtonEditSetting: boolean;
    isLoadingSetting: boolean;
    detailSettingLoadBalancer: object;
    dataChangeSetting: object;
    isUpdateSetting: boolean;
    isConfirmUpdateNode: boolean;
    result: object;
}
const initialState: DigitalOceanEditLoadBalancer = {
    hiddenButtonEditSetting: false,
    isLoadingSetting: false,
    detailSettingLoadBalancer: {},
    dataChangeSetting: {},
    isUpdateSetting: false,
    isConfirmUpdateNode: false,
    result: {},
};

export const updateSettingLoadBalancer: any = createAsyncThunk(
    "digital-ocean/vps",
    async (data: any, { rejectWithValue }) => {
        try {
            const response =
                await digitalOceanApi.updateSettingLoadBalancerDigitalOcean(
                    data?._id,
                    data
                );
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const loadBalancerEditDigitalOcean = createSlice({
    name: "editSettingLoadBalancer",
    initialState: initialState,
    reducers: {
        setDataSettingLoadBalancer: (state: any, action) => {
            Object.keys(action.payload).forEach((key) => {
                if (action.payload[key] !== undefined) {
                    state[key] = action.payload[key];
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateSettingLoadBalancer.pending, (state) => {
                state.isLoadingSetting = true;
            })
            .addCase(updateSettingLoadBalancer.fulfilled, (state, action) => {
                state.result = action.payload;
                state.isLoadingSetting = false;
            })
            .addCase(updateSettingLoadBalancer.rejected, (state) => {
                state.isLoadingSetting = false;
            });
    },
});

export const { setDataSettingLoadBalancer } =
    loadBalancerEditDigitalOcean.actions;

export default loadBalancerEditDigitalOcean.reducer;
